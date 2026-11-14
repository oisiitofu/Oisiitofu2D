'use strict';

const LimitBreak=(()=>{
 const threshold=100,profiles=new Map();
 let enabled=false, meters=new Map(), scene=null, visualRevision=0, drawnRevision=0;
 const hasCinematic=id=>profiles.has(id);
 const standardOpener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,23)],30,22,{
  damage:5,pose:0,aerial:true,canClank:false,velocityMultiplier:.28,intangibleFrames:[[1,23]]
 });
 const standardFinisher={name:'リミットブレイク',type:'limitFinisher',damage:28,angle:-.55,
  baseKnockback:3.8,knockbackGrowth:.075,launchPercentOffset:13,projectile:true};
 function opener(f){
  const authored=profile(f.characterId);
  if(authored)return authored.opener;
  const jab=movesFor(f)?.jab,neutral=0,strike=jab?.activeFrames?.[0]?.pose??jab?.pose??neutral;
  return {...standardOpener,standardLimit:true,pose:strike,soundFamily:jab?.soundFamily,
   animation:{...standardOpener.animation,anticipationPose:neutral,accelerationPose:strike,recoveryPose:neutral}};
 }
 function standardBoxes(f,a,t){
  const window=CombatData.activeWindow(a,t);
  if(!window||meter(f)?.used)return [];
  const {height,radius}=f.character.ecb,y=f.y-Math.max(23,Math.min(62,height*.47));
  return [{x1:f.x,y1:y,x2:f.x+f.face*(Math.max(15,radius)+91),y2:y,radius:Math.max(26,Math.min(43,height*.34)),window}];
 }
 const canConnect=f=>f.attack?.type==='limitBreak'&&!meter(f)?.used&&!f.hitlag&&!f.hitstun&&!f.pendingLaunch;

 function comboTimeline({id,shotTime,cues,combo,duration}){
  // The early cinematics and previously approved sequences keep their authored timing.
  const hits=[...(combo?.keys()??[])].sort((a,b)=>a-b);
  if(duration<=320||hits.length<2||id==='kingbonby'||id==='alucard')return null;
  const gaps=hits.slice(1).map((hit,i)=>hit-hits[i]);
  if(!gaps.some(gap=>gap>32)||gaps.filter(gap=>gap>23).length<2)return null;
  const first=hits[0],last=hits.at(-1);
  let sourceStart=0;
  while(sourceStart<duration&&shotTime(sourceStart)!==first)sourceStart++;
  const sourceEnd=sourceStart+last-first;
  if(sourceEnd>=duration||shotTime(sourceEnd)!==last)return null;
  const frames=[sourceStart];
  const cueTimes=[...cues.keys()].sort((a,b)=>a-b);
  for(let i=0;i<gaps.length;i++){
   const start=hits[i],end=hits[i+1];
   // Keep action cues as well as damage frames. Longer movement beats retain extra room.
   const beats=[start,...cueTimes.filter(cue=>cue>start&&cue<end),end];
   const gap=end-start;
   const target=gap<=23?gap:gap<=55?16+Math.round((gap-20)*.18):23+Math.round((gap-55)*.22);
   for(let j=1;j<beats.length;j++){
    const previous=beats[j-1],next=beats[j];
    const sourceLength=next-previous;
    const length=Math.max(1,Math.round(sourceLength*target/gap));
    for(let step=1;step<=length;step++){
     frames.push(sourceStart+previous-first+Math.round(step*sourceLength/length));
    }
   }
  }
  const saved=sourceEnd-sourceStart-frames.length+1;
  if(saved<=0)return null;
  const sourceTime=time=>time<=sourceStart?time:time<sourceStart+frames.length?frames[time-sourceStart]:time+saved;
  return {duration:duration-saved,sourceTime};
 }
 function define(id,profile,visual){
  const timeline=comboTimeline({...profile,id});
  profiles.set(id,{...profile,visual,...timeline});
 }
 function profile(id){return profiles.get(id);}
 function matchProfiles(players,enabled){
  if(!enabled)return [];
  const ids=new Set(players.flatMap(p=>[p.character,...(p.team||[])]));
  return [...ids].filter(hasCinematic).map(profile);
 }
 function prepareArt(players,enabled){return Promise.all(matchProfiles(players,enabled).map(p=>p.visual().load()));}
 function artPrepared(players,enabled){return matchProfiles(players,enabled).every(p=>p.visual().prepared);}
 function draw(current){
  const {profile,time}=current;
  profile.visual().draw(profile.sourceTime?{...current,time:profile.sourceTime(time)}:current);
 }
 function drawOpeners(){for(const f of fighters)if(f.attack?.type==='limitBreak')profile(f.characterId)?.visual().drawOpener?.(f);}
 function drawContact(current){current.profile.visual().drawContact(current);}

 function begin(on){
  enabled=on;meters=new Map();scene=null;visualRevision++;
  document.getElementById('training-limit-max').classList.toggle('hidden',!training||!enabled||!fighters[0]);
 }
 function meter(f){return meters.get(f.id);}
 function ready(f){const m=meter(f);return enabled&&!f.respawn&&!BattlePlayers.out(f)&&m?.value>=threshold&&!m.used;}
 function charge(f,damage){
  if(!enabled||damage<=0)return;
  const m=meter(f)||{value:0,used:false};
  if(!m.used)m.value=Math.min(threshold,m.value+damage);
  meters.set(f.id,m);
 }
 function tryStart(f,input){
  if(!input.shareStock||input.guard||input.grab||input.jump||!ready(f))return false;
  if(f.attack&&(f.timer>4||!['jab','heavy','up','low','air','fair','bair','uair','dair','dragon','dash','gale','rise'].includes(f.attack.type)))return false;
  if(Math.abs(input.x)>.35)f.face=Math.sign(input.x);
  if(!attack(f,'limitBreak'))return false;
  meter(f).value=0;
  f.fastFall=false;
  sound('swing',1.2,f);
  return true;
 }
 function capture(attacker,target,touch){
  if(scene||!canConnect(attacker))return;
  meter(attacker).used=true;
  const config=profile(attacker.characterId);
  if(!config){
   CombatSystem.limitFinisher(attacker,target,{...standardFinisher,launchDirection:attacker.face},touch);
   return;
  }
  scene={attacker,target,profile:config,face:attacker.face,x:touch.x,y:touch.y,time:0};
  sound(...config.contactCue,attacker);
  visualRevision++;
 }
 function tick(){
  const current=scene,{shotTime,cues,duration,finalStrike,combo,sourceTime}=current.profile;
  const authoredTime=frame=>shotTime(sourceTime?sourceTime(frame):frame);
  const previous=authoredTime(current.time);
  const time=authoredTime(++current.time);
  if(time!==previous){
   const cue=cues.get(time),damage=combo?.get(time);
   if(cue)sound(...cue,current.attacker);
   if(damage)CombatSystem.limitHit(current.attacker,current.target,{...finalStrike,damage});
  }
  visualRevision++;
  if(current.time<duration)return;
  scene=null;
  const {attacker,target,face}=current;
  attacker.attack=null;attacker.buffer=null;
  PlayerStates.enter(attacker,attacker.grounded?'NormalLanding':'Fall',attacker.grounded?12:Infinity);
  const launchDirection=finalStrike.reverseLaunch?-face:face;
  CombatSystem.limitFinisher(attacker,target,{...finalStrike,launchDirection});
 }
 function visualChanged(){if(drawnRevision===visualRevision)return false;drawnRevision=visualRevision;return true;}
 addEventListener('DOMContentLoaded',()=>{
  const button=document.createElement('button');
  button.id='training-limit-max';
  button.type='button';
  button.className='hidden';
  button.textContent='リミットブレイク 最大';
  button.onclick=()=>{
   const fighter=fighters[0];
   if(!training||!enabled||Net.active||scene||!fighter||fighter.attack?.type==='limitBreak')return;
   meters.set(fighter.id,{value:threshold,used:false});
   visualRevision++;
  };
  document.querySelector('#training-tools .debug-buttons').append(button);
 });
 function hud(f,x,y){
  if(!enabled)return;
  if(!hasCinematic(f.characterId))y+=33;
  const m=meter(f),isReady=ready(f);
  ctx.fillStyle='#091427';ctx.fillRect(x+152,y+47,94,14);
  if(isReady){
   ctx.save();
   const gold=ctx.createLinearGradient(0,y+48,0,y+60);
   gold.addColorStop(0,'#fff4aa');gold.addColorStop(.55,'#ffd258');gold.addColorStop(1,'#b96c17');
   ctx.fillStyle=gold;ctx.shadowBlur=9;ctx.shadowColor='#ffcc4d';ctx.fillRect(x+153,y+48,92,12);
   ctx.restore();
  }else if(!m?.used){
   ctx.fillStyle='#3968d4';ctx.fillRect(x+153,y+48,92*(m?.value||0)/threshold,12);
  }
  text(m?.used?'リミットブレイク 使用済み':isReady?'MAX  攻撃＋必殺':'リミットブレイク',x+199,y+57,9,isReady?'#2a1506':'#fff');
 }
 return {define,profile,hasCinematic,threshold,opener,standardBoxes,canConnect,prepareArt,artPrepared,draw,drawOpeners,drawContact,hud,begin,meter,ready,charge,tryStart,capture,tick,visualChanged,get enabled(){return enabled;},get active(){return !!scene;},get scene(){return scene;}};
})();

// Layers and camera helpers shared by the separately choreographed cinematics.
const LimitCinematic=(()=>{
 const unit=n=>Math.max(0,Math.min(1,n));
 const ease=n=>{const p=unit(n);return p*p*(3-2*p);};
 const mix=(a,b,n)=>a+(b-a)*n;
 function cutIn(image,x,y,minWidth,minHeight,alpha=1){
  if(!image||alpha<=0)return;
  const scale=Math.max(minWidth/image.naturalWidth,minHeight/image.naturalHeight);
  const w=image.naturalWidth*scale,h=image.naturalHeight*scale;
  ctx.save();ctx.globalAlpha*=alpha;ctx.drawImage(image,x-w/2,y-h/2,w,h);ctx.restore();
 }
 const impactOpacity=strength=>unit(strength*1.65);
 // Some early atlases use black as their transparent backdrop.
 function keyImpactAtlas(image){
  const layer=document.createElement('canvas');layer.width=image.width;layer.height=image.height;
  const paint=layer.getContext('2d',{willReadFrequently:true});paint.drawImage(image,0,0);
  const pixels=paint.getImageData(0,0,layer.width,layer.height),{data}=pixels;
  for(let i=0;i<data.length;i+=4){
   const light=Math.max(data[i],data[i+1],data[i+2]);
   data[i+3]=Math.min(255,Math.max(0,(light-14)*2.4));
  }
  paint.putImageData(pixels,0,0);return layer;
 }
 function assets(id,names,{blackMatte=false}={}){
  const images={};let pending,impactAtlas;
  const load=()=>pending??=Promise.all(names.map(async name=>{
   const image=new Image();image.src='characters/'+id+'/assets/limit-'+name+'.webp';
   await image.decode();
   if(name==='effects')impactAtlas=blackMatte?keyImpactAtlas(image):image;
   images[name]=image;
  })).catch(error=>{pending=null;throw error;});
  function image(name,x,y,w,h,alpha=1){
   if(!images[name]||alpha<=0)return;
   ctx.save();ctx.globalAlpha*=alpha;ctx.drawImage(images[name],x,y,w,h);ctx.restore();
  }
  function grid(name,n,cols,rows,x,y,height,{anchorX=.5,anchorY=.96,alpha=1,face=1}={}){
   const src=images[name];if(!src||alpha<=0)return;
   const sw=src.width/cols,sh=src.height/rows,w=height*sw/sh;
   ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;
   ctx.drawImage(src,(n%cols)*sw,Math.floor(n/cols)*sh,sw,sh,-w*anchorX,-height*anchorY,w,height);ctx.restore();
  }
  function drawEffect(src,blend,n,x,y,w,h,alpha,angle,face){
   if(!src||alpha<=0)return;
   const sw=src.width/2,sh=src.height/2;
   ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(face,1);ctx.globalAlpha*=alpha;
   ctx.globalCompositeOperation=blend;
   ctx.drawImage(src,n%2*sw+2,Math.floor(n/2)*sh+2,sw-4,sh-4,-w/2,-h/2,w,h);ctx.restore();
  }
  const strike=(n,x,y,w,h,strength=1,angle=0,face=1)=>drawEffect(impactAtlas,'source-over',n,x,y,w,h,impactOpacity(strength),angle,face);
  const glow=(n,x,y,w,h,alpha=1,angle=0,face=1)=>drawEffect(images.effects,'screen',n,x,y,w,h,alpha,angle,face);
  const portrait=(zoom,alpha)=>cutIn(images.cutin,W/2,H/2,W*zoom,710*zoom,alpha);
  return {load,image,grid,strike,glow,portrait,get prepared(){return names.every(name=>!!images[name]);}};
 }
 function camera(shots,t){
  const next=shots.findIndex(s=>s[0]>t);
  if(next<=0)return shots[next===0?0:shots.length-1].slice(1);
  const a=shots[next-1],b=shots[next],p=ease((t-a[0])/(b[0]-a[0]));
  return [...a.slice(1,-1).map((n,i)=>mix(n,b[i+1],p)),p<.55?a.at(-1):b.at(-1)];
 }
 function frameClip(){
  ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();
 }
 function world(cx,cy,z,roll,face,t,shock){
  const shake=Accessibility.shake;
  ctx.save();ctx.translate(W*.5+Math.sin(t*2.13)*shock*14*shake,H*.51+Math.cos(t*1.9)*shock*10*shake);
  ctx.rotate(roll*(.5+.5*shake));ctx.scale(z*face,z);ctx.translate(-cx,-cy);
 }
 function target(fighter,x,y,tilt,scale=1.85){
  const sprite={...fighter,x,y,face:-1,attack:null,mode:'Tumble',state:'hit',inv:0,intangible:0,grounded:false};
  ctx.save();ctx.translate(x,y-66);ctx.rotate(tilt);ctx.translate(-x,66-y);
  drawSprite(sprite,1,pose(sprite),scale);ctx.restore();
 }
 function bands(t,color='#080611'){
  const h=32*ease(t/7);
  ctx.fillStyle=color;ctx.fillRect(0,0,W,h);ctx.fillRect(0,H-h,W,h);
 }
 function flash(rgb,strength){
  if(!Accessibility.flash||strength<=0)return;
  ctx.fillStyle='rgba('+rgb+','+unit(strength)*Accessibility.flash+')';ctx.fillRect(0,0,W,H);
 }
 return {unit,ease,mix,assets,camera,frameClip,world,target,bands,flash,cutIn,impactOpacity,keyImpactAtlas};
})();

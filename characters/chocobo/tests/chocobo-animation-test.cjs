// Preserve approved pixels AND anatomy while checking actual intermediate limbs.
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const old=JSON.parse(fs.readFileSync('characters/chocobo/tests/legacy-art-checks.json'));
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);
 const manifest=await page.evaluate(async()=>await(await fetch('assets/ready/manifest.json')).json()),now=manifest.characters.chocobo;
 assert.deepEqual(now.checks.frames.slice(0,43),old.checks.frames);assert.deepEqual(now.checks.effects,old.checks.effects);
 for(let c=0;c<5;c++)assert.deepEqual(now.checks.tints[c].slice(0,43),old.checks.tints[c]);
 for(const k of ['portraits','selectionPortraits','selectionThumbnails','selectionCrop'])assert.deepEqual(now[k],old[k],k+' unchanged');
 const result=await page.evaluate(()=>{
  state='pause';setupStage('0');const failures=[],timings={};let checks=0;
  const check=(name,ok,detail)=>{checks++;if(!ok)failures.push({name,detail});};
  const make=(face=1)=>{const f=makeFighter(0,0,'chocobo');Object.assign(f,{x:180,y:220,grounded:true,face,inv:0,respawn:0,hitstun:0,hitlag:0,mode:'Idle',state:'idle'});fighters=[f,makeFighter(1,0,'chiikawa')];return f;};
  let f=make();const art=characterArt.chocobo;
  check('43 approved poses plus hidden torso',art.frames.length===44);
  check('original standing dimensions',art.frames[0].width===213&&art.frames[0].height===240);
  function render(f,override=null){ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,360,260);drawSprite(f,1,override,1.5);return ctx.getImageData(0,0,360,260).data;}
  for(const color of [0,1,2,3,4])for(const face of [-1,1]){
   f=make(face);f.color=color;render(f,0);const approved=render(f,0);
   for(const t of [1,2,30,60,100]){f.stateFrame=t;check('idle original pixels '+color+'/'+face+'/'+t,render(f).every((v,i)=>v===approved[i]));}
   attack(f,'smash');f.timer=1;check('attack starts on original stance '+color+face,render(f).every((v,i)=>v===approved[i]));
   f.timer=f.attack.totalFrames;check('attack returns to original stance '+color+face,render(f).every((v,i)=>v===approved[i]));
  }
  const poseJSON=f=>JSON.stringify(f,(k,v)=>v instanceof Set?[...v]:v);
  for(const face of [-1,1])for(const type of Object.keys(ChocoboMoves)){
   f=make(face);f.grounded=!['air','fair','bair','uair','dair'].includes(type);attack(f,type);const a=f.attack;check('attack exists '+type+face,!!a);if(!a)continue;
   timings[type]={startup:a.startupFrames,active:a.activeFrames.map(w=>[w.start,w.end]),total:a.totalFrames,damage:a.damage,landing:a.landingLag};
   const unique=new Set();let prior=null;
   for(let t=1;t<=a.totalFrames;t++){
    f.timer=t;const before=poseJSON(f),s=ChocoboAnimation.sample(f),again=ChocoboAnimation.sample(f),sk=ChocoboAnimation.skeleton(s.parts),active=CombatData.activeWindow(a,t);
    check('pure '+type+face+t,JSON.stringify(s)===JSON.stringify(again)&&before===poseJSON(f));
    check('finite '+type+face+t,Object.values(s.parts).flat().every(Number.isFinite));
    for(const [name,j]of Object.entries(sk.joints)){
     const [upper,lower]=ChocoboAnimation.lengths[name];check('fixed bone lengths '+type+face+t+name,Math.abs(Math.hypot(j.knee[0]-j.hip[0],j.knee[1]-j.hip[1])-upper)<1e-6&&Math.abs(Math.hypot(j.ankle[0]-j.knee[0],j.ankle[1]-j.knee[1])-lower)<1e-6);
    }
    const b=sk.bones[0],head=ChocoboAnimation.outlines.head;
    // The actual original head polygon and neck use this exact rigid matrix.
    const l=Math.hypot(head[2][0]-head[0][0],head[2][1]-head[0][1]),p=ChocoboAnimation.apply(b,head[0]),q=ChocoboAnimation.apply(b,head[2]);
    check('head neck torso keep original proportions '+type+face+t,Math.abs(Math.hypot(p[0]-q[0],p[1]-q[1])-l)<1e-6&&Math.abs(b[0]*b[3]-b[1]*b[2]-1)<1e-6);
    if(t<a.startupFrames)check('startup '+type+face+t,s.phase==='startup'&&!active);
    if(active)check('active '+type+face+t,s.phase==='active');
    if(prior)check('bounded intermediate positions '+type+face+t,Math.max(...Object.keys(s.parts).map(k=>Math.hypot(s.parts[k][0]-prior[k][0],s.parts[k][1]-prior[k][1])))<50);
    unique.add(JSON.stringify(s.parts));prior=s.parts;
   }
   check('actual intermediate limbs '+type+face,unique.size>Math.min(4,a.totalFrames-1),unique.size);
   if(f.grounded)check('returns to approved skeleton '+type+face,JSON.stringify(ChocoboAnimation.sample(f).parts)===JSON.stringify(ChocoboAnimation.base));
  }
  for(const name of ['idle','walk','run','crouch','jump','double','fall','land','guard','dodge','hit','fly','down','getup','grab','throw']){
   f=make();Object.assign(f,{state:name,stateDuration:24});for(let t=1;t<=60;t++){f.stateFrame=t;const s=ChocoboAnimation.sample(f);check('state finite '+name+t,Object.values(s.parts).flat().every(Number.isFinite));}
   const before=JSON.stringify(ChocoboAnimation.sample(f));frame+=200;check('state ignores rendering clock '+name,before===JSON.stringify(ChocoboAnimation.sample(f)));
  }
  for(const face of [-1,1]){
   f=make(face);PlayerStates.enter(f,'LedgeHang');f.ledge={x:500,y:560,face};Object.assign(f,ledgeHangPosition(f,f.ledge));const s=ChocoboAnimation.sample(f),sk=ChocoboAnimation.skeleton(s.parts),toe=ChocoboAnimation.apply(sk.bones[5],[169,233]),unit=FIGHTER_SCALE*BattleSize.art('chocobo')*BattleSize.native('chocobo',0)*MorphieRules.scale(f);
   check('original claw anchors on ledge '+face,Math.abs(f.x+(toe[0]-106.5)*unit*face-500)<1e-6&&Math.abs(f.y+(toe[1]-236)*unit-560)<1e-6);
  }
  // Inspect the canvas transform on real texture draws, not only rig metadata.
  for(const stateName of ['down','getup'])for(const face of [-1,1])for(const t of [1,6,12,24]){
   f=make(face);f.state=stateName;f.stateDuration=24;f.stateFrame=t;const raster=render(f);let bottom=-1;
   for(let y=0;y<260;y++)for(let x=0;x<360;x++)if(raster[(y*360+x)*4+3]>=8)bottom=y;
   check('fallen body stays on floor '+stateName+face+t,bottom>=f.y-4&&bottom<=f.y+4,{bottom,floor:f.y});
  }
  const original=ctx.drawImage;let bad=0,draws=0;
  ctx.drawImage=function(img,...args){if(img===art.tints[f.color][0]){draws++;const m=ctx.getTransform(),unit=FIGHTER_SCALE*BattleSize.art('chocobo')*BattleSize.native('chocobo',0)*MorphieRules.scale(f);if(Math.abs(Math.hypot(m.a,m.b)-unit)>1e-6||Math.abs(Math.hypot(m.c,m.d)-unit)>1e-6||args.length!==2)bad++;}return original.call(this,img,...args);};
  try{for(const color of [0,1,2,3,4])for(const face of [-1,1])for(const type of ['walk','run','jab','heavy','smash','bair','dair','rise']){
   f=make(face);f.color=color;f.state=type==='walk'||type==='run'?type:'idle';if(f.state==='idle')attack(f,type);f.timer=f.attack?.startupFrames||1;f.stateFrame=12;ctx.setTransform(1,0,0,1,0,0);drawSprite(f);
  }}finally{ctx.drawImage=original;}
  check('original anatomy painted rigidly at approved size',draws>0&&bad===0,{draws,bad});
  // Warm the Canvas2D readback path before comparing byte-identical rasters:
  // Chromium can switch from GPU to software rasterization after readbacks.
  f=make();f.state='run';f.stateFrame=12;render(f);render(f);const frozen=render(f);frame+=300;const resumed=render(f);let different=0,maxDifference=0;
  for(let i=0;i<resumed.length;i++)if(resumed[i]!==frozen[i]){different++;maxDifference=Math.max(maxDifference,Math.abs(resumed[i]-frozen[i]));}
  check('hitstop image does not advance',different===0,{different,maxDifference});
  const four=Array.from({length:4},(_,i)=>{const q=make();q.x=100+i*170;q.state='run';q.color=i;return q;}),begin=performance.now();
  for(let t=1;t<=120;t++){ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);for(const q of four){q.stateFrame=t;drawSprite(q);}}
  return{checks,failures,timings,fourFighterDrawMs:(performance.now()-begin)/120};
 });
 fs.writeFileSync('.tools/chocobo-animation-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({checks:result.checks,failed:result.failures.length,failures:result.failures.slice(0,20),fourFighterDrawMs:result.fourFighterDrawMs,errors}));assert.equal(result.failures.length,0);assert.deepEqual(errors,[]);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

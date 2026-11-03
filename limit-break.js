'use strict';

const LimitBreak=(()=>{
 const threshold=100,profiles=new Map();
 let enabled=false, meters=new Map(), scene=null, visualRevision=0, drawnRevision=0;
 const supports=id=>profiles.has(id);
 function define(id,profile,visual){profiles.set(id,{...profile,visual});}
 function profile(id){return profiles.get(id);}
 function matchProfiles(players,enabled){
  if(!enabled)return [];
  const ids=new Set(players.flatMap(p=>[p.character,...(p.team||[])]));
  return [...ids].filter(supports).map(profile);
 }
 function prepareArt(players,enabled){return Promise.all(matchProfiles(players,enabled).map(p=>p.visual().load()));}
 function artPrepared(players,enabled){return matchProfiles(players,enabled).every(p=>p.visual().prepared);}
 function draw(current){current.profile.visual().draw(current);}
 function drawOpeners(){for(const f of fighters)if(f.attack?.type==='limitBreak')profile(f.characterId)?.visual().drawOpener?.(f);}
 function drawContact(current){current.profile.visual().drawContact(current);}

 function begin(on){
  enabled=on;meters=new Map();scene=null;visualRevision++;
  document.getElementById('training-limit-max').classList.toggle('hidden',!training||!enabled||!supports(fighters[0]?.characterId));
 }
 function meter(f){return meters.get(f.id);}
 function ready(f){const m=meter(f);return enabled&&supports(f.characterId)&&!f.respawn&&!BattlePlayers.out(f)&&m?.value>=threshold&&!m.used;}
 function charge(f,damage){
  if(!enabled||!supports(f.characterId)||damage<=0)return;
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
  if(scene||attacker.attack?.type!=='limitBreak'||attacker.hitlag||attacker.hitstun||attacker.pendingLaunch)return;
  meter(attacker).used=true;
  const config=profile(attacker.characterId);
  scene={attacker,target,profile:config,face:attacker.face,x:touch.x,y:touch.y,time:0};
  sound(...config.contactCue,attacker);
  visualRevision++;
 }
 function tick(){
  const current=scene,{shotTime,cues,duration,finalStrike}=current.profile;
  const time=shotTime(++current.time);
  const cue=time!==shotTime(current.time-1)&&cues.get(time);
  if(cue)sound(...cue,current.attacker);
  visualRevision++;
  if(current.time<duration)return;
  scene=null;
  const {attacker,target,face}=current;
  attacker.attack=null;attacker.buffer=null;
  PlayerStates.enter(attacker,attacker.grounded?'NormalLanding':'Fall',attacker.grounded?12:Infinity);
  CombatSystem.limitFinisher(attacker,target,{...finalStrike,launchDirection:face});
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
   if(!training||!enabled||Net.active||scene||!supports(fighter?.characterId)||fighter.attack?.type==='limitBreak')return;
   meters.set(fighter.id,{value:threshold,used:false});
   visualRevision++;
  };
  document.querySelector('#training-tools .debug-buttons').append(button);
 });
 function hud(f,x,y){
  if(!LimitBreak.enabled||!LimitBreak.supports(f.characterId))return;
  const m=LimitBreak.meter(f),ready=LimitBreak.ready(f);
  ctx.fillStyle='#091427';ctx.fillRect(x+152,y+47,94,14);
  if(ready){
   ctx.save();
   const gold=ctx.createLinearGradient(0,y+48,0,y+60);
   gold.addColorStop(0,'#fff4aa');gold.addColorStop(.55,'#ffd258');gold.addColorStop(1,'#b96c17');
   ctx.fillStyle=gold;ctx.shadowBlur=9;ctx.shadowColor='#ffcc4d';ctx.fillRect(x+153,y+48,92,12);
   ctx.restore();
  }else if(!m?.used){
   ctx.fillStyle='#3968d4';ctx.fillRect(x+153,y+48,92*(m?.value||0)/LimitBreak.threshold,12);
  }
  text(m?.used?'リミットブレイク 使用済み':ready?'MAX  攻撃＋必殺':'リミットブレイク',x+199,y+57,9,ready?'#2a1506':'#fff');
 }
 return {define,profile,supports,threshold,opener:f=>profile(f.characterId)?.opener,prepareArt,artPrepared,draw,drawOpeners,drawContact,hud,begin,meter,ready,charge,tryStart,capture,tick,visualChanged,get enabled(){return enabled;},get active(){return !!scene;},get scene(){return scene;}};
})();

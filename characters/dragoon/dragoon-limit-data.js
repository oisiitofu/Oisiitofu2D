'use strict';

const DragoonLimit=(()=>{
 const threshold=100, cutInHold=20, duration=234+cutInHold, name='蒼天のドラゴンダイブ';
 const shotTime=time=>time-Math.min(cutInHold,Math.max(0,time-16));
 const opener=CombatData.createMove('リミットブレイク・槍の一閃',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:215,hitboxSize:1.65,pose:13,aerial:true,canClank:false,velocityMultiplier:.28,
  intangibleFrames:[[1,23]],
  animation:{anticipationEnd:5,anticipationPose:14,accelerationPose:6,followThroughFrames:5,recoveryPose:0,lean:-.1,lunge:15,impactScale:1.07}
 });
 const finalStrike={name,type:'limitFinisher',damage:28,angle:-.55,baseKnockback:4.2,knockbackGrowth:.04,element:'thunder',projectile:true};
 const cues=new Map([[1,['parry',.85]],[29,['spear-thrust',1]],[36,['spear-hit',.9]],[51,['sword-hit',1]],[67,['spear-hit-heavy',1.15]],[78,['jump',.9]],[104,['wind-cast',1.2]],[139,['wind-cast',1.25]],[153,['light-hit-heavy',1.35]],[178,['light-cast',1]],[197,['thunder-cast',1.2]],[204,['explosion',1.2]]]);
 let enabled=false, meters=new Map(), scene=null, visualRevision=0, drawnRevision=0;
 const supports=id=>id==='dragoon';
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
 function capture(attacker,target){
  if(scene||attacker.attack?.type!=='limitBreak'||attacker.hitlag||attacker.hitstun||attacker.pendingLaunch)return;
  meter(attacker).used=true;
  scene={attacker,target,face:attacker.face,time:0};
  visualRevision++;
 }
 function tick(){
  const current=scene;
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
 return {supports,threshold,duration,shotTime,opener,begin,meter,ready,charge,tryStart,capture,tick,visualChanged,get enabled(){return enabled;},get active(){return !!scene;},get scene(){return scene;}};
})();

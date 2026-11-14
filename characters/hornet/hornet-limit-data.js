'use strict';

const HornetLimitProfile=(()=>{
 const contactHold=13,duration=249;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:7,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[46, 3], [62, 3], [80, 4], [99, 4], [117, 4], [137, 4]]);
 const cues=new Map([[1,['sword-hit',1]],...[...combo.keys()].map((time,index)=>[time,['sword-hit',.86+index*.046]]),
  [182,['hornet-limit-thread',1]]]);
 const finalStrike={name:'スレッドストーム',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('hornet',HornetLimitProfile,()=>HornetLimitVFX);

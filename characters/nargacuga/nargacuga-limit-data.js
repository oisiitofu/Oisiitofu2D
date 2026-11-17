'use strict';

const NargacugaLimitProfile=(()=>{
 const contactHold=13,duration=285;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:19,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'claw'
 });
 const impacts=[
  [46,3,'claw-hit'],[64,3,'sword-hit'],[82,4,'claw-hit'],
  [101,4,'sword-hit'],[121,4,'sword-hit-heavy'],[141,4,'earth-hit']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['claw-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [188,['wind-hit',.63]],[214,['nargacuga-limit-tail-slam',1]]]);
 const finalStrike={name:'迅竜・双刃尾撃',type:'limitFinisher',damage:26,launchDamage:37,angle:-.66,reverseLaunch:true,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'claw'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('nargacuga',NargacugaLimitProfile,()=>NargacugaLimitVFX);

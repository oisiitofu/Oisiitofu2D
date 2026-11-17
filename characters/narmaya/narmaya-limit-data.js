'use strict';

const NarmayaLimitProfile=(()=>{
 const contactHold=13,duration=280;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:12,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const impacts=[
  [45,3,"sword-hit"],[63,3,"sword-hit"],[81,4,"sword-hit"],
  [100,4,"sword-hit-heavy"],[118,4,"sword-hit"],[138,4,"sword-hit-heavy"]
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['sword-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [36,["narmaya-limit-stance",0.55]],[72,["narmaya-limit-stance",0.74]],[163,["narmaya-limit-stance",0.87]],
  [209,["narmaya-limit-dance",1]],[232,["narmaya-limit-stance",0.52]]]);
 const finalStrike={name:'胡蝶刃・天鏡女命舞',type:'limitFinisher',damage:26,launchDamage:37,angle:-0.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('narmaya',NarmayaLimitProfile,()=>NarmayaLimitVFX);

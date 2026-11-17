'use strict';

const CharlottaLimitProfile=(()=>{
 const contactHold=13,duration=276;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:8,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const impacts=[
  [46,3,"hammer-hit"],[62,3,"sword-hit"],[80,4,"sword-hit"],
  [99,4,"sword-hit-heavy"],[118,4,"sword-hit"],[138,4,"sword-hit-heavy"]
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['sword-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [177,["charlotta-limit-shield",0.82]],[206,["charlotta-limit-execution",1]]]);
 const finalStrike={name:'ノーブル・エクスキューション',type:'limitFinisher',damage:26,launchDamage:37,angle:-0.65,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('charlotta',CharlottaLimitProfile,()=>CharlottaLimitVFX);

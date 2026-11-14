'use strict';

const NamineLimitProfile=(()=>{
 const contactHold=13,duration=265;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:16,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'magic'
 });
 const impacts=[[46, 3, "light-hit"], [64, 3, "wind-hit"], [82, 3, "light-hit"], [101, 4, "light-hit"], [121, 4, "wind-hit"], [141, 4, "light-hit-heavy"]];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,[impacts[0][2],1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [197,['namine-limit-memory-chain',1]]]);
 const finalStrike={name:'記憶の鎖',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('namine',NamineLimitProfile,()=>NamineLimitVFX);

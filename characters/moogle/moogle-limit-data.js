'use strict';

const MoogleLimitProfile=(()=>{
 const contactHold=13,duration=264;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'wing'
 });
 const impacts=[[46, 3, "punch-light"], [64, 3, "wind-hit"], [83, 3, "staff-hit"], [102, 4, "wind-hit"], [122, 4, "punch-light"], [142, 4, "wind-hit-heavy"]];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,[impacts[0][2],1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [195,['moogle-limit-rhapsody',1]]]);
 const finalStrike={name:'風のラプソディ',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'wing'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('moogle',MoogleLimitProfile,()=>MoogleLimitVFX);

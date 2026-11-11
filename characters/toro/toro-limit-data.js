"use strict";

const ToroLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=367+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[71,3],[89,3],[148,3],[172,3],[235,4],[274,4]]);
 const cues=new Map([[1,['impact-heavy',.87]],[71,['toro-limit-table',1.12]],[89,['toro-limit-table',.97]],
  [148,['toro-limit-doron',1.18]],[172,['toro-limit-doron',.98]],[235,['toro-limit-mochi',1.16]],
  [274,['toro-limit-mochi',.97]],[319,['toro-limit-mochi',.77]]]);
 const finalStrike={name:'おおモチニャ！',type:'limitFinisher',damage:25,launchDamage:36,angle:-.52,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('toro',ToroLimitProfile,()=>ToroLimitVFX);

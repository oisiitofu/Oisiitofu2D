"use strict";

const ShizunaLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=376+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[59,3],[99,3],[147,4],[186,3],[235,4],[277,4]]);
 const cues=new Map([[1,['impact-heavy',.9]],
  [59,['shizuna-limit-parry',1]],
  [99,['shizuna-limit-parry',1]],
  [147,['shizuna-limit-step',1]],
  [186,['shizuna-limit-step',1]],
  [235,['shizuna-limit-cut',1]],
  [277,['shizuna-limit-cut',1]],
  [331,['shizuna-limit-moon',1]]
 ]);
 const finalStrike={name:'皇技・零月一閃',type:'limitFinisher',damage:26,launchDamage:36,angle:-.55,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('shizuna',ShizunaLimitProfile,()=>ShizunaLimitVFX);

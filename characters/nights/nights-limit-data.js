"use strict";

const NightsLimitProfile=(()=>{
 const contactHold=15;
 const cutInHold=22;
 const duration=365+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:16,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'wind'
 });
 const combo=new Map([[56,4],[197,4],[214,3],[231,3],[252,3]]);
 const cues=new Map([[1,['impact-heavy',.94]],[56,['nights-limit-loop',1.07]],[197,['nights-limit-loop',.9]],
  [214,['nights-limit-loop',1.13]],[231,['nights-limit-loop',1.22]],[252,['nights-limit-loop',1.31]],[310,['nights-limit-ideya',1]]]);
 const finalStrike={name:'イデア・パラループ',type:'limitFinisher',damage:24,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic',element:'light'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('nights',NightsLimitProfile,()=>NightsLimitVFX);

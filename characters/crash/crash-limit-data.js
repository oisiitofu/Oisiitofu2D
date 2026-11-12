"use strict";

const CrashLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=373+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[65,3],[104,3],[138,4],[179,3],[235,3],[279,5]]);
 const cues=new Map([[1,['impact-heavy',.91]],[48,['crash-limit-phase',.89]],[65,['crash-limit-crate',1.19]],
  [104,['crash-limit-crate',1.06]],[138,['crash-limit-crate',1.12]],[164,['crash-limit-phase',.76]],
  [179,['crash-limit-crate',.77]],[235,['crash-limit-crate',.98]],[279,['crash-limit-spin',1.18]],
  [325,['crash-limit-spin',.88]]]);
 const finalStrike={name:'アカノ・ダークマタースピン',type:'limitFinisher',damage:26,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('crash',CrashLimitProfile,()=>CrashLimitVFX);

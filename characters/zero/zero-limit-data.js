'use strict';
const ZeroLimitProfile=(()=>{
 const contactHold=13,cutInHold=24,duration=253+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical'};
 const combo=new Map([[43,1],[52,1],[64,2],[86,2],[107,2],[133,2],[156,2],[177,2]]);
 const cues=new Map([[1,['sword-hit-heavy',.91]],[43,['zero-limit-saber',.84]],[52,['zero-limit-saber',.9]],
  [64,['zero-limit-saber',.96]],[86,['sword-hit-heavy',.94]],[107,['sword-hit-heavy',1.03]],
  [133,['ice-hit',1]],[156,['zero-limit-saber',1.08]],[177,['zero-limit-saber',1.16]],
  [193,['power',.88]],[216,['zero-limit-ragnarok',1.18]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('zero',ZeroLimitProfile,()=>ZeroLimitVFX);

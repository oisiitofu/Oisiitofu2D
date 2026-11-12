"use strict";

const AstroLimitProfile=(()=>{
 const contactHold=16,cutInHold=22;
 const duration=367+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[106,3],[128,3],[152,4],[185,4],[228,4],[279,3]]);
 const cues=new Map([[1,['impact-heavy',.92]],[58,['astro-limit-spring',.76]],[91,['astro-limit-spring',.92]],
  [106,['astro-limit-impact',1.13]],[128,['astro-limit-impact',1.04]],[152,['astro-limit-impact',1.19]],
  [185,['astro-limit-spring',1.05]],[228,['astro-limit-impact',.89]],[279,['astro-limit-impact',.98]],
  [303,['astro-limit-booster',1]]]);
 const finalStrike={name:'ブルドッグブースター・フルスロットル',type:'limitFinisher',damage:25,launchDamage:36,angle:-.52,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('astro',AstroLimitProfile,()=>AstroLimitVFX);

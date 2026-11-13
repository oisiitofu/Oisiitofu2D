"use strict";

const EstelleLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=376+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'heavy'
 });
 const combo=new Map([[57,2],[96,3],[132,3],[172,4],[213,3],[251,3],[288,3]]);
 const cues=new Map([[1,['impact-heavy',.9]],
  [57,['estelle-limit-staff',1]],
  [96,['estelle-limit-pivot',1]],
  [132,['estelle-limit-pivot',1]],
  [172,['estelle-limit-staff',1]],
  [213,['estelle-limit-land',1]],
  [251,['estelle-limit-staff',1]],
  [288,['estelle-limit-staff',1]],
  [331,['estelle-limit-blossom',1]]
 ]);
 const finalStrike={name:'桜花無双撃',type:'limitFinisher',damage:26,launchDamage:36,angle:-.55,reverseLaunch:true,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('estelle',EstelleLimitProfile,()=>EstelleLimitVFX);

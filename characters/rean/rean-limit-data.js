"use strict";

const ReanLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=376+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[61,3],[101,3],[143,4],[189,3],[237,4],[285,4]]);
 const cues=new Map([[1,['impact-heavy',.9]],
  [61,['rean-limit-parry',1]],
  [101,['rean-limit-parry',1]],
  [143,['rean-limit-awaken',1]],
  [189,['rean-limit-blade',1]],
  [219,['rean-limit-awaken',1]],
  [237,['rean-limit-landing',1]],
  [285,['rean-limit-landing',1]],
  [331,['rean-limit-blade',1]]
 ]);
 const finalStrike={name:'灰の騎神・ヴァリマール',type:'limitFinisher',damage:26,launchDamage:36,angle:-.55,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('rean',ReanLimitProfile,()=>ReanLimitVFX);

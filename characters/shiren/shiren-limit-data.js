"use strict";

const ShirenLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=376+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[62,3],[101,3],[145,3],[187,4],[240,4],[286,4]]);
 const cues=new Map([[1,['impact-heavy',.9]],
  [62,['shiren-limit-staff',1]],
  [101,['shiren-limit-staff',1]],
  [145,['shiren-limit-rice',1]],
  [187,['shiren-limit-stomp',1]],
  [240,['shiren-limit-stomp',1]],
  [286,['shiren-limit-wall',1]],
  [331,['shiren-limit-wall',1]]
 ]);
 const finalStrike={name:'ドスコイ・とぐろ崩し',type:'limitFinisher',damage:26,launchDamage:36,angle:-.55,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('shiren',ShirenLimitProfile,()=>ShirenLimitVFX);

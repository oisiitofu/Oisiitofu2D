"use strict";

const UlgrimLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=394+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[52,3], [87,3], [128,3], [173,3], [212,3], [249,3], [285,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [52,["ulgrim-limit-parry",1]], [87,["ulgrim-limit-edge",1]], [128,["ulgrim-limit-rift",1]], [173,["ulgrim-limit-rift",1]], [212,["ulgrim-limit-edge",1]], [249,["ulgrim-limit-parry",1]], [285,["ulgrim-limit-edge",1]], [337,["ulgrim-limit-finish",1]]]);
 const finalStrike={name:'影渡り・最初の剣',type:'limitFinisher',damage:26,launchDamage:36,reverseLaunch:true,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('ulgrim',UlgrimLimitProfile,()=>UlgrimLimitVFX);

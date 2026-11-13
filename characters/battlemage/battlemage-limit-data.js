"use strict";

const BattleMageLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=394+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'staff'
 });
 const combo=new Map([[51,3], [86,3], [126,3], [161,3], [201,3], [245,3], [287,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [51,["battlemage-limit-spear",1]], [86,["battlemage-limit-spear",1]], [126,["battlemage-limit-chaser",1]], [161,["battlemage-limit-warp",1]], [201,["battlemage-limit-chaser",1]], [245,["battlemage-limit-warp",1]], [287,["battlemage-limit-chaser",1]], [337,["battlemage-limit-finish",1]]]);
 const finalStrike={name:'テアナ・クエーサーエクスプロージョン',type:'limitFinisher',damage:26,launchDamage:36,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('battlemage',BattleMageLimitProfile,()=>BattleMageLimitVFX);

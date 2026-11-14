"use strict";

const MiyabiLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=394+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[51,3], [82,3], [118,3], [154,3], [226,3], [264,3], [303,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [51,["miyabi-limit-draw",1]], [82,["miyabi-limit-draw",1]], [118,["miyabi-limit-frost",1]], [154,["miyabi-limit-frost",1]], [226,["miyabi-limit-draw",1]], [264,["miyabi-limit-draw",1]], [303,["miyabi-limit-shatter",1]], [339,["miyabi-limit-finish",1]]]);
 const finalStrike={name:'落霜・無尾の一閃',type:'limitFinisher',damage:26,launchDamage:36,reverseLaunch:true,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('miyabi',MiyabiLimitProfile,()=>MiyabiLimitVFX);

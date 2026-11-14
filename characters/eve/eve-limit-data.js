"use strict";

const EveLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=394+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[52,3], [86,3], [118,3], [157,3], [206,3], [248,3], [293,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [52,["eve-limit-parry",1]], [86,["eve-limit-blink",1]], [118,["eve-limit-edge",1]], [157,["eve-limit-blink",1]], [194,["eve-limit-tachy",1]], [206,["eve-limit-edge",1]], [248,["eve-limit-edge",1]], [293,["eve-limit-edge",1]], [337,["eve-limit-finish",1]]]);
 const finalStrike={name:'タキモード・バースト',type:'limitFinisher',damage:26,launchDamage:36,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('eve',EveLimitProfile,()=>EveLimitVFX);

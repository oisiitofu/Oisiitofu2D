"use strict";

const SakunaLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=382+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[56,3], [103,3], [146,3], [184,3], [222,3], [253,3], [288,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [56,["sakuna-limit-hoe",1]], [103,["sakuna-limit-silk",1]], [146,["sakuna-limit-hoe",1]], [184,["sakuna-limit-silk",1]], [222,["sakuna-limit-throw",1]], [253,["sakuna-limit-throw",1]], [288,["sakuna-limit-hoe",1]], [333,["sakuna-limit-finish",1]]]);
 const finalStrike={name:'羽衣返し・星魂の一撃',type:'limitFinisher',damage:26,launchDamage:36,angle:-0.6,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('sakuna',SakunaLimitProfile,()=>SakunaLimitVFX);

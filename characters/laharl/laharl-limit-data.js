"use strict";

const LaharlLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=392+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[52,3], [95,3], [144,3], [187,3], [229,3], [270,3], [304,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [52,["laharl-limit-blade",1]], [95,["laharl-limit-lift",1]], [144,["laharl-limit-rock",1]], [187,["laharl-limit-rock",1]], [229,["laharl-limit-rock",1]], [270,["laharl-limit-fist",1]], [304,["laharl-limit-fist",1]], [334,["laharl-limit-impact",1]]]);
 const finalStrike={name:'メテオインパクトEX',type:'limitFinisher',damage:26,launchDamage:36,angle:-0.61,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('laharl',LaharlLimitProfile,()=>LaharlLimitVFX);

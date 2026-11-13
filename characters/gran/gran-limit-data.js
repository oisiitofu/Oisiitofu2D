"use strict";

const GranLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=392+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[54,3], [91,3], [125,3], [171,3], [222,3], [260,3], [298,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [54,["gran-limit-blade",1]], [91,["gran-limit-blade",1]], [125,["gran-limit-wind",1]], [171,["gran-limit-wind",1]], [222,["gran-limit-summon",1]], [260,["gran-limit-blade",1]], [298,["gran-limit-summon",1]], [337,["gran-limit-finish",1]]]);
 const finalStrike={name:'テンペストブレード・カタストロフィ',type:'limitFinisher',damage:26,launchDamage:36,angle:-0.58,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('gran',GranLimitProfile,()=>GranLimitVFX);

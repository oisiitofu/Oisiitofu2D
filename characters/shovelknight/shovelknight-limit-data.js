"use strict";

const ShovelKnightLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=394+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'hammer'
 });
 const combo=new Map([[52,3], [91,3], [129,3], [171,3], [210,3], [257,3], [296,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [52,["shovelknight-limit-shovel",1]], [91,["shovelknight-limit-bounce",1]], [129,["shovelknight-limit-bounce",1]], [171,["shovelknight-limit-break",1]], [210,["shovelknight-limit-break",1]], [257,["shovelknight-limit-shovel",1]], [296,["shovelknight-limit-break",1]], [335,["shovelknight-limit-finish",1]]]);
 const finalStrike={name:'ショベルドロップ・岩盤崩し',type:'limitFinisher',damage:26,launchDamage:36,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('shovelknight',ShovelKnightLimitProfile,()=>ShovelKnightLimitVFX);

"use strict";

const MonoLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=394+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'staff'
 });
 const combo=new Map([[55,3], [96,3], [125,3], [171,3], [208,3], [254,3], [292,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [55,["mono-limit-draw",1]], [96,["mono-limit-slime",1]], [125,["mono-limit-slime",1]], [171,["mono-limit-unicorn",1]], [208,["mono-limit-unicorn",1]], [254,["mono-limit-draw",1]], [292,["mono-limit-unicorn",1]], [333,["mono-limit-finish",1]]]);
 const finalStrike={name:'色彩ラクガキ大行進',type:'limitFinisher',damage:26,launchDamage:36,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('mono',MonoLimitProfile,()=>MonoLimitVFX);

"use strict";

const RagunaLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=392+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[57,3], [100,3], [145,3], [193,3], [232,3], [271,3], [301,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [57,["raguna-limit-shield",1]], [100,["raguna-limit-plant",1]], [145,["raguna-limit-sprout",1]], [193,["raguna-limit-plant",1]], [232,["raguna-limit-sprout",1]], [271,["raguna-limit-fire",1]], [301,["raguna-limit-fire",1]], [337,["raguna-limit-finish",1]]]);
 const finalStrike={name:'双陣・ルーンファイア',type:'limitFinisher',damage:26,launchDamage:36,angle:-0.59,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('raguna',RagunaLimitProfile,()=>RagunaLimitVFX);

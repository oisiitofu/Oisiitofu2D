"use strict";

const MetabeeLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=392+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'gun'
 });
 const combo=new Map([[51,3], [81,3], [118,3], [156,3], [197,3], [243,3], [284,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [51,["metabee-limit-rifle",1]], [81,["metabee-limit-rifle",1]], [118,["metabee-limit-recoil",1]], [156,["metabee-limit-rifle",1]], [197,["metabee-limit-missile",1]], [243,["metabee-limit-charge",1]], [284,["metabee-limit-missile",1]], [333,["metabee-limit-finish",1]]]);
 const finalStrike={name:'メダフォース・一斉射撃',type:'limitFinisher',damage:26,launchDamage:36,angle:-0.55,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('metabee',MetabeeLimitProfile,()=>MetabeeLimitVFX);

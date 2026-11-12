"use strict";

const KittenLimitProfile=(()=>{
 const contactHold=16,cutInHold=22;
 const duration=377+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'wind'
 });
 const combo=new Map([[60,3],[94,3],[141,4],[170,4],[203,3],[251,4]]);
 const cues=new Map([[1,['impact-heavy',.93]],[60,['kitten-limit-kick',.9]],[79,['kitten-limit-shift',1.16]],
  [94,['kitten-limit-kick',1.12]],[141,['kitten-limit-kick',1.02]],[170,['kitten-limit-kick',1.18]],
  [203,['kitten-limit-kick',.96]],[251,['kitten-limit-shift',.78]],[324,['kitten-limit-jupiter',1]]]);
 const finalStrike={name:'ユピトル・グラビティドロップ',type:'limitFinisher',damage:26,launchDamage:36,angle:-.56,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('kitten',KittenLimitProfile,()=>KittenLimitVFX);

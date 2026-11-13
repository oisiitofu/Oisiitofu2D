"use strict";

const C4621LimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=376+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[57,3],[92,3],[128,3],[176,3],[212,3],[261,3],[291,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]],[57,["c4621-limit-rifle",1]],[92,["c4621-limit-missile",1]],[128,["c4621-limit-boost",1]],[176,["c4621-limit-rifle",1]],[212,["c4621-limit-missile",1]],[261,["c4621-limit-boost",1]],[291,["c4621-limit-blade",1]],[331,["c4621-limit-blade",1]]]);
 const finalStrike={name:'スタッガー・ブレード追撃',type:'limitFinisher',damage:26,launchDamage:36,angle:-.55,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('c4621',C4621LimitProfile,()=>C4621LimitVFX);

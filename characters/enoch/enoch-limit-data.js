"use strict";

const EnochLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=394+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[53,3], [92,3], [126,3], [154,3], [183,3], [235,3], [270,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [53,["enoch-limit-arch",1]], [92,["enoch-limit-arch",1]], [126,["enoch-limit-gale",1]], [154,["enoch-limit-gale",1]], [183,["enoch-limit-gale",1]], [235,["enoch-limit-veil",1]], [270,["enoch-limit-veil",1]], [334,["enoch-limit-finish",1]]]);
 const finalStrike={name:'天刃・三神器',type:'limitFinisher',damage:26,launchDamage:36,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('enoch',EnochLimitProfile,()=>EnochLimitVFX);

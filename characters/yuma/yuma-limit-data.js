"use strict";

const YumaLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=376+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[59,3],[105,3],[146,3],[191,4],[234,4],[277,4]]);
 const cues=new Map([
  [1,['impact-heavy',0.9]],
  [59,['yuma-limit-repel',1.1]],
  [105,['yuma-limit-repel',0.91]],
  [146,['yuma-limit-key',1.05]],
  [191,['yuma-limit-solution',0.95]],
  [234,['yuma-limit-solution',1.13]],
  [277,['yuma-limit-wall',0.83]],
  [331,['yuma-limit-wall',1.2]]
 ]);
 const finalStrike={name:'謎迷宮・GOD Shinigami',type:'limitFinisher',damage:26,launchDamage:36,angle:-0.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('yuma',YumaLimitProfile,()=>YumaLimitVFX);

"use strict";

const PiposaruLimitProfile=(()=>{
 const contactHold=15,cutInHold=22;
 const duration=374+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[58,2],[91,3],[131,4],[175,4],[224,3],[268,5]]);
 const cues=new Map([
  [1,['impact-heavy',0.92]],
  [51,['piposaru-limit-radar',1]],
  [86,['piposaru-limit-rotor',0.83]],
  [131,['piposaru-limit-glove',1.09]],
  [175,['piposaru-limit-glove',0.88]],
  [223,['piposaru-limit-rotor',1.18]],
  [268,['piposaru-limit-net',1.12]],
  [324,['piposaru-limit-net',0.78]]
 ]);
 const finalStrike={name:'タイムマシン・ピポサルキャプチャー',type:'limitFinisher',damage:25,launchDamage:36,angle:-0.56,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('piposaru',PiposaruLimitProfile,()=>PiposaruLimitVFX);

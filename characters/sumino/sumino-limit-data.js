"use strict";

const SuminoLimitProfile=(()=>{
 const contactHold=16,cutInHold=22;
 const duration=372+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[63,3],[102,4],[151,3],[194,4],[236,3],[278,4]]);
 const cues=new Map([
  [1,['impact-heavy',0.92]],
  [63,['sumino-limit-guard',1.02]],
  [102,['sumino-limit-blade',1.14]],
  [151,['sumino-limit-line',0.98]],
  [194,['sumino-limit-blade',0.86]],
  [236,['sumino-limit-guard',0.92]],
  [278,['sumino-limit-blade',1.22]],
  [327,['sumino-limit-finale',1.13]]
 ]);
 const finalStrike={name:'最終防衛線・紅の連刃',type:'limitFinisher',damage:26,launchDamage:36,angle:-0.55,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('sumino',SuminoLimitProfile,()=>SuminoLimitVFX);

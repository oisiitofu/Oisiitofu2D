"use strict";

const AloyLimitProfile=(()=>{
 const contactHold=16,cutInHold=23;
 const duration=375+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'heavy'
 });
 const combo=new Map([[58,3],[98,3],[139,4],[171,3],[217,4],[266,4]]);
 const cues=new Map([
  [1,['impact-heavy',0.92]],
  [58,['aloy-limit-arrow',0.99]],
  [91,['aloy-limit-caster',1.08]],
  [139,['aloy-limit-arrow',1.18]],
  [171,['aloy-limit-arrow',0.92]],
  [217,['aloy-limit-override',1]],
  [266,['aloy-limit-tremortusk',0.85]],
  [331,['aloy-limit-tremortusk',1.16]]
 ]);
 const finalStrike={name:'トレマータスク・オーバーライド',type:'limitFinisher',damage:26,launchDamage:36,angle:-0.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy',reverseLaunch:true};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('aloy',AloyLimitProfile,()=>AloyLimitVFX);

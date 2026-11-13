"use strict";

const HaseoLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=394+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[52,3], [84,3], [119,3], [152,3], [190,3], [243,3], [277,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [52,["haseo-limit-scythe",1]], [84,["haseo-limit-scythe",1]], [119,["haseo-limit-lance",1]], [152,["haseo-limit-lance",1]], [190,["haseo-limit-lance",1]], [243,["haseo-limit-hammer",1]], [277,["haseo-limit-hammer",1]], [340,["haseo-limit-judgment",1]]]);
 const finalStrike={name:'八相アーツ・凶つ神の裁き',type:'limitFinisher',damage:26,launchDamage:36,reverseLaunch:true,angle:-0.56,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('haseo',HaseoLimitProfile,()=>HaseoLimitVFX);

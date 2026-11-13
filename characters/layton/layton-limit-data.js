"use strict";

const LaytonLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=378+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[54,3], [93,3], [132,3], [167,4], [218,4], [274,4]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [54,["layton-limit-step",1]], [93,["layton-limit-gear",1]], [132,["layton-limit-gear",1]], [167,["layton-limit-pendulum",1]], [218,["layton-limit-pendulum",1]], [274,["layton-limit-wind",1]], [328,["layton-limit-finish",1]]]);
 const finalStrike={name:'最後の時間旅行・時計仕掛け',type:'limitFinisher',damage:26,launchDamage:36,angle:-0.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('layton',LaytonLimitProfile,()=>LaytonLimitVFX);

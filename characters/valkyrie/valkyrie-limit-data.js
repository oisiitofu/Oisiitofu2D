'use strict';
const ValkyrieLimitProfile=(()=>{
 const contactHold=11,cutInHold=26,duration=256+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:223,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:33,angle:-0.67,baseKnockback:4.35,knockbackGrowth:.075,launchPercentOffset:14,element:'light',projectile:true};
 const cues=new Map([[1,['shield-hit',0.72]],[46,['slash-light',0.92]],[66,['sword-hit',1.04]],[84,['slash-heavy',1.11]],[103,['wing-swing',0.9]],[119,['light-cast',0.9]],[151,['light-cast',1.1]],[165,['wind-cast',0.85]],[179,['spear-hit-heavy',1.18]],[187,['explosion',1.17]],[218,['light-cast',0.62]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.11]};
})();
LimitBreak.define('valkyrie',ValkyrieLimitProfile,()=>ValkyrieLimitVFX);

'use strict';
const NierLimitProfile=(()=>{
 const contactHold=10,cutInHold=23,duration=248+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-16));};
 const opener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,23)],30,22,{
  damage:5,reach:214,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:30,angle:-.56,baseKnockback:4.0,knockbackGrowth:.076,launchPercentOffset:14,soundFamily:'sword',projectile:true};
 const cues=new Map([[1,['parry',.65]],[30,['dark-cast',.85]],[52,['dark-cast',1.08]],[76,['wind-cast',1.1]],[91,['sword-hit-heavy',.95]],[110,['slash-heavy',1]],[127,['sword-hit-heavy',1.1]],[149,['dark-cast',.95]],[168,['explosion',1.02]],[191,['wind-cast',1.1]],[207,['sword-hit-heavy',1.25]],[209,['explosion',1.14]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.15]};
})();
LimitBreak.define('nier',NierLimitProfile,()=>NierLimitVFX);

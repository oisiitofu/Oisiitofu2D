'use strict';
const TwoBLimitProfile=(()=>{
 const contactHold=10,cutInHold=23,duration=249+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,23)],29,21,{
  damage:4,reach:210,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:31,angle:-.55,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'sword',projectile:true};
 const cues=new Map([[1,['parry',.76]],[32,['gun-shot',.7]],[46,['engine',.9]],[71,['rocket',.98]],[91,['gun-shot',.95]],[97,['gun-shot',1]],[103,['gun-shot',.92]],[110,['explosion',1]],[130,['beam-shot',1.2]],[151,['saber-swing',.9]],[176,['slash-heavy',1.2]],[184,['sword-hit-heavy',1.28]],[199,['explosion',1.24]],[228,['engine',.7]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.05]};
})();
LimitBreak.define('twob',TwoBLimitProfile,()=>TwoBLimitVFX);

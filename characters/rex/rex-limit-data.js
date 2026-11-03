'use strict';
const RexLimitProfile=(()=>{
 const contactHold=11,cutInHold=25,duration=258+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:215,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:33,angle:-.57,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'light',projectile:true};
 const cues=new Map([[1,['light-cast',.8]],[31,['saber-swing',.7]],[54,['light-cast',1.1]],[78,['wind-cast',.85]],[103,['shield-on',1.1]],[132,['beam-shot',.8]],[151,['thunder-cast',.85]],[174,['slash-heavy',1.3]],[183,['sword-hit-heavy',1.24]],[197,['explosion',1.36]],[223,['light-cast',.84]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.1]};
})();
LimitBreak.define('rex',RexLimitProfile,()=>RexLimitVFX);

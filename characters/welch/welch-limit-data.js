'use strict';
const WelchLimitProfile=(()=>{
 const contactHold=10,cutInHold=23,duration=246+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,23)],29,21,{
  damage:4,reach:210,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:33,angle:-.56,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'punch',projectile:true};
 const cues=new Map([[1,['menu',.69]],[36,['punch-light',.8]],[51,['punch-light',.9]],[69,['punch-heavy',1]],[91,['boomerang',.92]],[108,['wind-cast',.81]],[134,['menu',.73]],[154,['wind-cast',1.05]],[177,['punch-heavy',1.28]],[187,['explosion',1.28]],[211,['light-cast',.76]],[226,['menu',.65]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['punch-heavy',1.05]};
})();
LimitBreak.define('welch',WelchLimitProfile,()=>WelchLimitVFX);

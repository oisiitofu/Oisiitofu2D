'use strict';
const NoahLimitProfile=(()=>{
 const contactHold=11,cutInHold=25,duration=258+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:226,hitboxSize:1.65,pose:9,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:9,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:35,angle:-0.57,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light',projectile:true};
 const cues=new Map([[1,['shield-hit',0.76]],[41,['saber-swing',0.81]],[58,['light-cast',0.9]],[83,['sword-hit',1]],[103,['slash-heavy',0.99]],[122,['wind-cast',0.96]],[145,['saber-swing',1.02]],[163,['light-cast',1.08]],[180,['sword-hit-heavy',1.2]],[187,['explosion',1.13]],[221,['wind-cast',0.62]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.10]};
})();
LimitBreak.define('noah',NoahLimitProfile,()=>NoahLimitVFX);

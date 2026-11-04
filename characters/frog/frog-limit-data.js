'use strict';
const FrogLimitProfile=(()=>{
 const contactHold=11,cutInHold=25,duration=255+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:215,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:32,angle:-.56,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'sword',projectile:true};
 const cues=new Map([[1,['sword-hit',.77]],[33,['wind-cast',.73]],[59,['light-cast',.87]],[87,['saber-swing',.92]],[106,['slash-heavy',1.14]],[116,['earth-hit-heavy',1.15]],[136,['explosion',1.03]],[156,['wind-cast',.87]],[176,['slash-light',.9]],[190,['sword-hit-heavy',1.27]],[204,['explosion',1.18]],[226,['wind-cast',.65]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.11]};
})();
LimitBreak.define('frog',FrogLimitProfile,()=>FrogLimitVFX);

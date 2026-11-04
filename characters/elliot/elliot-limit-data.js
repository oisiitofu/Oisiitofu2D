'use strict';
const ElliotLimitProfile=(()=>{
 const contactHold=11,cutInHold=24,duration=252+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:215,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:32,angle:-.56,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'light',projectile:true};
 const cues=new Map([[1,['shield-hit',.81]],[34,['light-cast',.77]],[58,['light-cast',.95]],[77,['wind-cast',.85]],[98,['dark-cast',.86]],[118,['slash-heavy',.93]],[139,['sword-hit',.93]],[155,['light-cast',.99]],[174,['saber-swing',1.06]],[189,['sword-hit-heavy',1.22]],[201,['explosion',1.18]],[228,['light-cast',.65]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.10]};
})();
LimitBreak.define('elliot',ElliotLimitProfile,()=>ElliotLimitVFX);

'use strict';
const FioraLimitProfile=(()=>{
 const contactHold=11,cutInHold=24,duration=248+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:222,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:34,angle:-0.64,baseKnockback:4.4,knockbackGrowth:.075,launchPercentOffset:15,element:'light',projectile:true};
 const cues=new Map([[1,['shield-hit',0.76]],[43,['saber-swing',0.9]],[64,['sword-hit',1.02]],[87,['slash-heavy',1]],[109,['wind-cast',0.89]],[128,['saber-swing',1.02]],[143,['sword-hit',1.07]],[166,['slash-heavy',1.15]],[179,['sword-hit-heavy',1.22]],[187,['explosion',1.09]],[219,['land-light',0.72]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.12]};
})();
LimitBreak.define('fiora',FioraLimitProfile,()=>FioraLimitVFX);

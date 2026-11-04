'use strict';
const MarukuLimitProfile=(()=>{
 const contactHold=11,cutInHold=25,duration=257+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'light',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:35,angle:-0.44,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'dark',projectile:true};
 const cues=new Map([[1,['shield-hit',0.76]],[44,['light-cast',0.83]],[66,['light-cast',0.99]],[89,['wind-cast',0.85]],[111,['beam-hit-heavy',1.01]],[135,['dark-cast',0.88]],[154,['dark-cast',1.1]],[170,['wind-cast',0.94]],[188,['dark-hit-heavy',1.22]],[195,['explosion',1.16]],[225,['light-cast',0.64]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['light-hit-heavy',1.11]};
})();
LimitBreak.define('maruku',MarukuLimitProfile,()=>MarukuLimitVFX);

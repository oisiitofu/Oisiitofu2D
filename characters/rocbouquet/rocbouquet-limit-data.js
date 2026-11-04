'use strict';
const RocbouquetLimitProfile=(()=>{
 const contactHold=10,cutInHold=25,duration=253+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,23)],29,21,{
  damage:4,reach:210,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'dark',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:32,angle:-.56,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'thunder',projectile:true};
 const cues=new Map([[1,['dark-cast',.92]],[36,['wing-swing',.86]],[55,['light-cast',.77]],[74,['dark-hit',.97]],[96,['wing-swing',1]],[119,['wind-cast',.87]],[142,['thunder-cast',.95]],[153,['thunder-cast',1.03]],[171,['dark-cast',.83]],[187,['thunder-hit-heavy',1.23]],[198,['explosion',1.29]],[221,['dark-cast',.60]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['dark-hit-heavy',1.1]};
})();
LimitBreak.define('rocbouquet',RocbouquetLimitProfile,()=>RocbouquetLimitVFX);

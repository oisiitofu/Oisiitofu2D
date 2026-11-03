'use strict';

const RoxasLimitProfile=(()=>{
 const contactHold=10,cutInHold=26,duration=226+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,23)],30,22,{
  damage:5,reach:211,hitboxSize:1.65,pose:13,aerial:true,canClank:false,velocityMultiplier:.28,
  intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationEnd:4,anticipationPose:14,accelerationPose:13,followThroughFrames:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={
  name:'リミットブレイク',type:'limitFinisher',damage:29,angle:-.58,baseKnockback:3.95,
  knockbackGrowth:.075,launchPercentOffset:14,element:'light',projectile:true
 };
 const cues=new Map([
  [1,['parry',.82]],[27,['sword-hit-heavy',1.12]],[44,['wind-cast',.82]],
  [68,['light-cast',.84]],[92,['light-cast',1.05]],[112,['light-hit',.77]],
  [127,['light-hit-heavy',.9]],[143,['light-hit-heavy',.96]],[159,['light-cast',1.1]],
  [179,['thunder-cast',1.05]],[186,['explosion',1.27]],[210,['wind-cast',.54]]
 ]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.2]};
})();
LimitBreak.define('roxas',RoxasLimitProfile,()=>RoxasLimitVFX);

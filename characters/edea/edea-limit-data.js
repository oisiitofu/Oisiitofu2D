'use strict';
const EdeaLimitProfile=(()=>{
 const contactHold=10,cutInHold=24,duration=239+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,23)],29,21,{
  damage:4,reach:211,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:32,angle:-.57,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'sword',projectile:true};
 const cues=new Map([[1,['parry',.79]],[32,['shield-on',.86]],[49,['light-cast',.70]],[60,['light-cast',.86]],[71,['light-cast',1.02]],[89,['slash-heavy',.92]],[106,['sword-hit-heavy',1]],[127,['wind-cast',.83]],[147,['saber-swing',1.12]],[165,['sword-hit-heavy',1.17]],[182,['slash-heavy',1.26]],[197,['explosion',1.17]],[216,['light-cast',.68]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.08]};
})();
LimitBreak.define('edea',EdeaLimitProfile,()=>EdeaLimitVFX);

'use strict';
const NekuLimitProfile=(()=>{
 const contactHold=10,cutInHold=24,duration=247+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,23)],29,21,{
  damage:4,reach:210,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'light',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:31,angle:-.56,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'thunder',projectile:true};
 const cues=new Map([[1,['light-cast',.92]],[33,['parry',.75]],[49,['slash-light',.92]],[67,['thunder-cast',.95]],[82,['punch-light',.83]],[101,['punch-heavy',1.06]],[121,['thunder-cast',1.04]],[139,['shield-on',.85]],[157,['dark-cast',.8]],[172,['thunder-cast',1.18]],[184,['punch-heavy',1.29]],[195,['explosion',1.23]],[217,['light-cast',.66]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['light-hit-heavy',1.08]};
})();
LimitBreak.define('neku',NekuLimitProfile,()=>NekuLimitVFX);

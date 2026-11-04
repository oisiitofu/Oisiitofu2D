'use strict';
const TressaLimitProfile=(()=>{
 const contactHold=10,cutInHold=24,duration=250+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,23)],29,21,{
  damage:4,reach:210,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'spear',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:31,angle:-.58,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'light',projectile:true};
 const cues=new Map([[1,['light-cast',.76]],[37,['menu',.68]],[54,['light-cast',.9]],[77,['shield-hit',.94]],[96,['boomerang',.85]],[107,['spear-hit',1.06]],[131,['slash-heavy',1.08]],[148,['light-cast',1]],[165,['wind-cast',.92]],[185,['spear-hit-heavy',1.15]],[193,['light-hit-heavy',1.28]],[207,['explosion',1.08]],[226,['menu',.59]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['spear-hit-heavy',1.08]};
})();
LimitBreak.define('tressa',TressaLimitProfile,()=>TressaLimitVFX);

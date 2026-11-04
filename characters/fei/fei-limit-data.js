'use strict';
const FeiLimitProfile=(()=>{
 const contactHold=11,cutInHold=24,duration=263+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,23)],30,22,{
  damage:5,reach:214,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:34,angle:-0.4,baseKnockback:4.48,knockbackGrowth:.075,launchPercentOffset:15,element:'dark',projectile:true};
 const cues=new Map([[1,['shield-hit',0.8]],[40,['punch-heavy',1.01]],[61,['punch-heavy',0.89]],[81,['wind-cast',0.9]],[101,['thunder-cast',0.83]],[121,['land-heavy',1.1]],[143,['dark-cast',0.95]],[161,['dark-cast',1.12]],[179,['hammer-hit-heavy',1.14]],[188,['dark-hit-heavy',1.25]],[192,['explosion',1.16]],[235,['wind-cast',0.58]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['punch-heavy',1.11]};
})();
LimitBreak.define('fei',FeiLimitProfile,()=>FeiLimitVFX);

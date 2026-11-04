'use strict';
const MallowLimitProfile=(()=>{
 const contactHold=11,cutInHold=24,duration=253+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:214,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:34,angle:-0.69,baseKnockback:4.51,knockbackGrowth:.075,launchPercentOffset:15,element:'light',projectile:true};
 const cues=new Map([[1,['shield-hit',0.71]],[43,['light-cast',0.75]],[65,['thunder-cast',0.89]],[78,['thunder-hit',1.08]],[94,['light-cast',0.88]],[113,['light-hit',0.92]],[133,['light-hit-heavy',0.98]],[154,['light-hit-heavy',1.07]],[179,['light-hit-heavy',1.23]],[186,['explosion',1.05]],[218,['land-light',0.64]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['punch-heavy',1.10]};
})();
LimitBreak.define('mallow',MallowLimitProfile,()=>MallowLimitVFX);

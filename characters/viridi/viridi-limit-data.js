'use strict';
const ViridiLimitProfile=(()=>{
 const contactHold=12,cutInHold=25,duration=278+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-17));
 };
 const opener=CombatData.createMove('リミットブレイク',10,[CombatData.window(10,23)],30,22,{
  damage:5,reach:230,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'staff',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:36,angle:-0.59,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'wind',projectile:true};
 const cues=new Map([[1,['shield-hit',.76]],[40,['wind-cast',.84]],[63,['wind-hit-heavy',1.03]],
  [94,['light-cast',.91]],[118,['thunder-cast',.78]],[144,['wind-cast',1.13]],[170,['explosion',1.14]],
  [181,['wind-hit-heavy',1.25]],[200,['thunder-cast',.76]],[226,['light-cast',.64]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['wind-hit-heavy',1.05]};
})();
LimitBreak.define('viridi',ViridiLimitProfile,()=>ViridiLimitVFX);

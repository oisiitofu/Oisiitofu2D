'use strict';
const RenaLimitProfile=(()=>{
 const contactHold=11,cutInHold=24,duration=247+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,23)],30,22,{
  damage:5,reach:211,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'light',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:32,angle:-.72,baseKnockback:4.2,knockbackGrowth:.075,launchPercentOffset:14,element:'light',projectile:true};
 const cues=new Map([[1,['shield-hit',.78]],[31,['light-cast',.72]],[58,['light-cast',.97]],[83,['wind-cast',.9]],[105,['light-cast',.95]],[118,['light-cast',.87]],[132,['light-cast',.92]],[159,['light-cast',1.1]],[175,['explosion',1.21]],[190,['thunder-hit',.90]],[220,['wind-cast',.59]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['light-cast',1.1]};
})();
LimitBreak.define('rena',RenaLimitProfile,()=>RenaLimitVFX);

'use strict';
const FaytLimitProfile=(()=>{
 const contactHold=11,cutInHold=25,duration=252+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:224,hitboxSize:1.66,pose:8,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:8,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:34,angle:-.39,baseKnockback:4.4,knockbackGrowth:.075,launchPercentOffset:15,element:'light',projectile:true};
 const cues=new Map([[1,['shield-hit',.8]],[33,['saber-swing',.88]],[59,['thunder-cast',.81]],[77,['light-cast',1]],[100,['thunder-cast',.96]],[122,['light-cast',1.05]],[150,['thunder-hit',1.12]],[158,['explosion',1.03]],[184,['explosion',1.2]],[220,['wind-cast',.58]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.12]};
})();
LimitBreak.define('fayt',FaytLimitProfile,()=>FaytLimitVFX);

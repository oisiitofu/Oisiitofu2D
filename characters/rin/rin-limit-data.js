'use strict';
const RinLimitProfile=(()=>{
 const contactHold=11,cutInHold=25,duration=230+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:221,hitboxSize:1.65,pose:9,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:9,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:35,angle:-0.45,baseKnockback:4.55,knockbackGrowth:.075,launchPercentOffset:15,element:'wind',projectile:true};
 const cues=new Map([[1,['shield-hit',0.76]],[42,['slash-light',0.85]],[73,['wind-cast',0.68]],[99,['light-cast',0.88]],[115,['wind-cast',0.96]],[129,['saber-swing',1]],[145,['slash-heavy',1.06]],[154,['sword-hit-heavy',1.27]],[163,['wind-hit-heavy',1.05]],[198,['saber-swing',0.6]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.10]};
})();
LimitBreak.define('rin',RinLimitProfile,()=>RinLimitVFX);

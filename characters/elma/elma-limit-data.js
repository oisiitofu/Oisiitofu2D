'use strict';
const ElmaLimitProfile=(()=>{
 const contactHold=11,cutInHold=24,duration=266+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'bullet',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:34,angle:-0.42,baseKnockback:4.51,knockbackGrowth:.075,launchPercentOffset:15,element:'fire',projectile:true};
 const cues=new Map([[1,['shield-hit',0.76]],[41,['bullet-hit-heavy',0.88]],[54,['bullet-hit-heavy',0.79]],[79,['wind-cast',0.91]],[105,['land-heavy',1.06]],[123,['thunder-cast',0.88]],[146,['bullet-hit-heavy',1.03]],[155,['bullet-hit-heavy',1.06]],[164,['bullet-hit-heavy',1.11]],[177,['hammer-hit-heavy',1.09]],[187,['explosion',1.25]],[225,['wind-cast',0.71]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['bullet-hit-heavy',1.10]};
})();
LimitBreak.define('elma',ElmaLimitProfile,()=>ElmaLimitVFX);

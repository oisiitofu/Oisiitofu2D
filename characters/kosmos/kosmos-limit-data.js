'use strict';
const KosmosLimitProfile=(()=>{
 const contactHold=11,cutInHold=26,duration=260+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:219,hitboxSize:1.65,pose:17,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'light',
  animation:{anticipationPose:0,accelerationPose:17,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:35,angle:-0.37,baseKnockback:4.45,knockbackGrowth:.075,launchPercentOffset:15,element:'light',projectile:true};
 const cues=new Map([[1,['shield-hit',0.81]],[43,['light-cast',0.84]],[66,['thunder-cast',0.79]],[88,['light-cast',1]],[117,['thunder-cast',0.99]],[144,['beam-hit-heavy',1.03]],[155,['beam-hit-heavy',0.98]],[163,['beam-hit-heavy',1]],[184,['explosion',1.23]],[215,['wind-cast',0.57]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['beam-hit-heavy',1.12]};
})();
LimitBreak.define('kosmos',KosmosLimitProfile,()=>KosmosLimitVFX);

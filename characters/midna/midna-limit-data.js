'use strict';
const MidnaLimitProfile=(()=>{
 const contactHold=11,cutInHold=25,duration=247+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:224,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'dark',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:35,angle:-0.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'dark',projectile:true};
 const cues=new Map([[1,['shield-hit',0.76]],[41,['dark-cast',0.88]],[64,['dark-cast',0.86]],[91,['light-cast',0.83]],[103,['dark-hit',1]],[124,['thunder-cast',0.9]],[142,['wind-cast',0.9]],[168,['slash-heavy',1.07]],[177,['dark-hit-heavy',1.22]],[183,['explosion',1.18]],[221,['dark-cast',0.58]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['dark-hit-heavy',1.11]};
})();
LimitBreak.define('midna',MidnaLimitProfile,()=>MidnaLimitVFX);

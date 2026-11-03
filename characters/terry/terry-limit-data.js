'use strict';
const TerryLimitProfile=(()=>{
 const contactHold=10,cutInHold=23,duration=244+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-16));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:215,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:29,angle:-.58,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'thunder',projectile:true};
 const cues=new Map([[1,['parry',.8]],[28,['sword-hit',.8]],[48,['thunder-cast',.75]],[72,['thunder-cast',1.06]],[85,['explosion',.6]],[101,['wind-cast',.7]],[130,['explosion',.85]],[157,['punch-heavy',1.18]],[185,['wind-cast',.95]],[199,['explosion',1.32]],[211,['thunder-cast',1.1]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.1]};
})();
LimitBreak.define('terry',TerryLimitProfile,()=>TerryLimitVFX);

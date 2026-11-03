'use strict';
const Zero3LimitProfile=(()=>{
 const contactHold=11,cutInHold=24,duration=262+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:215,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:32,angle:-.57,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'fire',projectile:true};
 const cues=new Map([[1,['dark-cast',.72]],[33,['wing-swing',.8]],[57,['wing-swing',1.1]],[80,['wind-cast',.9]],[96,['light-cast',.82]],[111,['light-cast',1]],[126,['light-cast',1.18]],[137,['fire-cast',1.2]],[161,['dark-hit-heavy',.94]],[181,['slash-heavy',1.18]],[194,['sword-hit-heavy',1.25]],[206,['explosion',1.28]],[232,['wind-cast',.66]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.12]};
})();
LimitBreak.define('zero3',Zero3LimitProfile,()=>Zero3LimitVFX);

'use strict';
const IsaacLimitProfile=(()=>{
 const contactHold=12,cutInHold=25,duration=283+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-17));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:36,angle:-0.58,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'earth',projectile:true};
 const cues=new Map([[1,['shield-hit',.76]],[42,['slash-heavy',1.04]],[57,['light-cast',.81]],
  [68,['light-cast',.88]],[79,['light-cast',.96]],[90,['light-cast',1.07]],[111,['thunder-cast',.93]],
  [140,['wind-cast',.86]],[163,['light-cast',1.09]],[181,['beam-shot',1.08]],[201,['explosion',1.23]],
  [209,['beam-hit-heavy',1.17]],[243,['wind-cast',.66]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['slash-heavy',1.02]};
})();
LimitBreak.define('isaac',IsaacLimitProfile,()=>IsaacLimitVFX);

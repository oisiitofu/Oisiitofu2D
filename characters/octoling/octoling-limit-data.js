'use strict';
const OctolingLimitProfile=(()=>{
 const contactHold=11,cutInHold=25,duration=265+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-17));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:222,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'shot',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:35,angle:-0.48,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,projectile:true};
 const cues=new Map([[1,['shield-hit',.76]],[45,['beam-shot',.77]],[57,['beam-shot',.91]],
  [71,['beam-hit',.86]],[99,['light-cast',.93]],[112,['light-cast',1.08]],[141,['wind-cast',.85]],
  [158,['beam-hit-heavy',1.04]],[175,['beam-shot',1.10]],[192,['explosion',1.21]],[224,['light-cast',.73]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['beam-hit',1.04]};
})();
LimitBreak.define('octoling',OctolingLimitProfile,()=>OctolingLimitVFX);

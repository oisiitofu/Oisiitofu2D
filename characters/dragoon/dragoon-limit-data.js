'use strict';

const DragoonLimitProfile=(()=>{
 const contactHold=10, cutInHold=20, duration=234+contactHold+cutInHold, name='蒼天のドラゴンダイブ';
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-16));};
 const opener=CombatData.createMove('リミットブレイク・槍の一閃',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:215,hitboxSize:1.65,pose:13,aerial:true,canClank:false,velocityMultiplier:.28,
  intangibleFrames:[[1,23]],
  animation:{anticipationEnd:5,anticipationPose:14,accelerationPose:6,followThroughFrames:5,recoveryPose:0,lean:-.1,lunge:15,impactScale:1.07}
 });
 const finalStrike={name,type:'limitFinisher',damage:28,angle:-.55,baseKnockback:3.8,knockbackGrowth:.075,launchPercentOffset:13,element:'thunder',projectile:true};
 const cues=new Map([[1,['parry',.85]],[29,['spear-thrust',1]],[36,['spear-hit',.9]],[51,['sword-hit',1]],[67,['spear-hit-heavy',1.15]],[78,['jump',.9]],[104,['wind-cast',1.2]],[139,['wind-cast',1.25]],[153,['light-hit-heavy',1.35]],[178,['light-cast',1]],[197,['thunder-cast',1.2]],[204,['explosion',1.2]]]);
 return {duration,contactHold,shotTime,opener,finalStrike,cues,contactCue:['spear-hit-heavy',1.15]};
})();
LimitBreak.define('dragoon',DragoonLimitProfile,()=>DragoonLimitVFX);

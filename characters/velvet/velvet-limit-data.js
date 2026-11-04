'use strict';
const VelvetLimitProfile=(()=>{
 const contactHold=13,cutInHold=23,duration=249+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'dark',projectile:true};
 const combo=new Map([[52,2],[64,2],[79,2],[98,3],[136,2],[162,3]]);
 const cues=new Map([[1,['slash-heavy',.9]],[52,['sword-hit',.92]],[64,['sword-hit',.96]],[79,['sword-hit-heavy',1]],[98,['claw-hit-heavy',1]],[123,['dark-cast',1]],[136,['claw-hit',1.03]],[162,['claw-hit-heavy',1.08]],[188,['dark-hit-heavy',1.2]],[197,['explosion',1.17]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('velvet',VelvetLimitProfile,()=>VelvetLimitVFX);

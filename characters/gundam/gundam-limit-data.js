'use strict';
const GundamLimitProfile=(()=>{
 const contactHold=14,cutInHold=23,duration=257+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'saber'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'beam',projectile:true};
 const combo=new Map([[52,2],[70,2],[89,3],[121,2],[137,2],[158,3]]);
 const cues=new Map([[1,['beam-hit',.86]],[45,['beam-shot',.92]],[52,['beam-hit',.98]],[63,['beam-shot',1]],[70,['beam-hit',1.01]],[75,['rocket',.89]],[89,['explosion',1.03]],[121,['beam-hit',.98]],[137,['beam-hit',1.04]],[158,['beam-hit-heavy',1.08]],[174,['body-slam',.89]],[195,['beam-shot',1.21]],[212,['explosion',1.17]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('gundam',GundamLimitProfile,()=>GundamLimitVFX);

'use strict';
const LukeLimitProfile=(()=>{
 const contactHold=14,cutInHold=23,duration=256+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:21,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'beam',projectile:true};
 const combo=new Map([[53,2],[65,2],[77,2],[89,2],[105,2],[146,2],[171,3]]);
 const cues=new Map([[1,['slash-heavy',.9]],[53,['sword-hit',.92]],[65,['sword-hit',.98]],[77,['sword-hit',1.02]],[89,['sword-hit',1.06]],[105,['sword-hit-heavy',1]],[124,['light-cast',.83]],[146,['sword-hit-heavy',1.05]],[171,['earth-hit-heavy',1.12]],[189,['thunder-cast',1]],[203,['beam-shot',1.22]],[214,['beam-hit-heavy',1.2]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('luke',LukeLimitProfile,()=>LukeLimitVFX);

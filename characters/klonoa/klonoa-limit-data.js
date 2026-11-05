'use strict';
const KlonoaLimitProfile=(()=>{
 const contactHold=13,cutInHold=24,duration=249+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'wind'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'wind',projectile:true};
 const combo=new Map([[48,2],[65,2],[91,2],[115,2],[142,3],[162,3]]);
 const cues=new Map([[1,['wind-hit',.94]],[48,['wind-hit',.92]],[65,['wind-hit',1]],
  [91,['klonoa-limit-catch',.95]],[115,['klonoa-limit-catch',1.02]],[142,['wind-hit-heavy',1.04]],
  [162,['wind-hit-heavy',1.08]],[180,['power',.86]],[212,['klonoa-limit-ring',1.15]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('klonoa',KlonoaLimitProfile,()=>KlonoaLimitVFX);

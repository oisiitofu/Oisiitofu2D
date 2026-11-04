'use strict';
const JudasLimitProfile=(()=>{
 const contactHold=14,cutInHold=23,duration=257+contactHold+cutInHold;
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
 const combo=new Map([[53,2],[69,2],[95,3],[130,2],[149,2],[167,3]]);
 const cues=new Map([[1,['slash-heavy',.88]],[53,['sword-hit',.92]],[69,['sword-hit',1]],[95,['sword-hit-heavy',1]],[112,['shield-break',.97]],[130,['sword-hit',1]],[149,['sword-hit',1.07]],[167,['sword-hit-heavy',1.07]],[186,['wind-cast',1]],[207,['sword-hit-heavy',1.21]],[215,['earth-hit-heavy',1.08]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('judas',JudasLimitProfile,()=>JudasLimitVFX);

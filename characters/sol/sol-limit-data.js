'use strict';
const SolLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=250+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'fire'};
 const combo=new Map([[43,2],[59,2],[76,2],[98,2],[119,2],[141,2],[162,2],[185,3]]);
 const cues=new Map([[1,['sword-hit-heavy',.93]],[43,['sword-hit-heavy',.96]],[59,['sword-hit-heavy',1.06]],
  [76,['punch-heavy',.95]],[98,['punch-heavy',1.07]],[119,['sol-limit-tyrant',.93]],
  [141,['sword-hit-heavy',1.17]],[162,['fire-hit',.96]],[185,['sol-limit-tyrant',1.13]],
  [216,['sol-limit-napalm',1.09]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('sol',SolLimitProfile,()=>SolLimitVFX);

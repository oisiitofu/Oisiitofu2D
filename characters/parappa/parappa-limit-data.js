"use strict";

const ParappaLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=372+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 // The first downbeat is 43. Subdivisions are 16 frames at 112.5 BPM.
 const combo=new Map([[59,2],[75,3],[91,2],[139,3],[171,3],[203,2],[235,2],[251,2],[267,2]]);
 const cues=new Map([[1,['impact-heavy',.91]],[43,['parappa-limit-beat',1]],
  ...[59,75,91,235,251,267].map(time=>[time,['parappa-limit-hit',.99]]),
  ...[139,171,203].map(time=>[time,['parappa-limit-skate',1]]),
  [315,['parappa-limit-hit',.76]]]);
 const finalStrike={name:'COOL フリースタイル',type:'limitFinisher',damage:25,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('parappa',ParappaLimitProfile,()=>ParappaLimitVFX);

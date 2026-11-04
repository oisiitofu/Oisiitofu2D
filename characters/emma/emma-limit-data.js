'use strict';
const EmmaLimitProfile=(()=>{
 const contactHold=13,cutInHold=23,duration=257+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical',projectile:true};
 const combo=new Map([[56,2],[71,3],[98,3],[122,2],[151,2],[171,2]]);
 const cues=new Map([[1,['slash-heavy',.91]],[56,['sword-hit',.92]],[71,['sword-hit-heavy',1]],[84,['wind-cast',.83]],[98,['claw-hit-heavy',1]],[122,['earth-hit-heavy',.99]],[151,['sword-hit',1.03]],[171,['sword-hit-heavy',1.05]],[192,['dark-cast',.89]],[207,['slash-heavy',1.22]],[218,['sword-hit-heavy',1.18]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('emma',EmmaLimitProfile,()=>EmmaLimitVFX);

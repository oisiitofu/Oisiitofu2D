"use strict";

const RatchetLimitProfile=(()=>{
 const contactHold=16,cutInHold=22;
 const duration=374+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'heavy'
 });
 const combo=new Map([[62,3],[97,3],[148,4],[181,4],[220,4],[265,3]]);
 const cues=new Map([[1,['impact-heavy',.94]],[62,['ratchet-limit-wrench',1.08]],[97,['ratchet-limit-wrench',.95]],
  [124,['ratchet-limit-rift',.91]],[148,['ratchet-limit-wrench',1.21]],[181,['ratchet-limit-ryno',1.3]],
  [220,['ratchet-limit-ryno',1.06]],[265,['ratchet-limit-rift',.86]],[325,['ratchet-limit-ryno',.74]]]);
 const finalStrike={name:'RYNO 8 次元落下',type:'limitFinisher',damage:26,launchDamage:36,angle:-.55,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy',reverseLaunch:true};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('ratchet',RatchetLimitProfile,()=>RatchetLimitVFX);

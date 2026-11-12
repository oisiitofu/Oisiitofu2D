"use strict";

const SackboyLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=369+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[80,3],[128,4],[164,3],[207,4],[249,3],[277,4]]);
 const cues=new Map([[1,['impact-heavy',.87]],[48,['sackboy-limit-fold',.91]],[80,['sackboy-limit-fold',1.15]],
  [128,['sackboy-limit-piston',1.1]],[164,['sackboy-limit-piston',.95]],[207,['sackboy-limit-piston',1.21]],
  [249,['sackboy-limit-fold',1.18]],[277,['sackboy-limit-piston',.83]],[321,['sackboy-limit-star',1]]]);
 const finalStrike={name:'ポペット・クリエイトフィナーレ',type:'limitFinisher',damage:25,launchDamage:36,angle:-.56,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('sackboy',SackboyLimitProfile,()=>SackboyLimitVFX);

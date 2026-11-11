"use strict";

const MikuLimitProfile=(()=>{
 const contactHold=15;
 const cutInHold=22;
 const duration=354+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:13,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'wind'
 });
 const combo=new Map([[60,2],[90,2],[120,2],[150,2],[180,2],[210,3],[240,3],[270,3]]);
 const cues=new Map([[1,['impact-heavy',.9]],[30,['miku-limit-performance',.82]],
  ...[60,90,120,150,180,210,240,270].map((time,index)=>[time,['miku-limit-note',.92+index*.035]]),
  [300,['miku-limit-note',.76]]]);
 const finalStrike={name:'バーチャルステージ・フィナーレ',type:'limitFinisher',damage:23,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic',element:'light'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('miku',MikuLimitProfile,()=>MikuLimitVFX);

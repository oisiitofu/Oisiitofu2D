"use strict";

const LeanneLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=351+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:13,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'gun'
 });
 const bursts=[72,85,98,122,135,151];
 const combo=new Map(bursts.map((time,index)=>[time,index<3?2:3]));
 const cues=new Map([[1,['impact-heavy',1.02]],...bursts.map((time,index)=>[time,['leanne-limit-burst',.91+index*.035]]),
  [180,['leanne-limit-burst',.62]],[293,['leanne-limit-confirm',1]]]);
 const finalStrike={name:'インビンシブル・アクション',type:'limitFinisher',damage:27,launchDamage:36,angle:-.5,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'gun',reverseLaunch:true};
 return {contactHold,duration,shotTime,opener,combo,cues,bursts,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('leanne',LeanneLimitProfile,()=>LeanneLimitVFX);

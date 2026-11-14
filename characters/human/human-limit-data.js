'use strict';

const HumanLimitProfile=(()=>{
 const contactHold=12,cutInHold=21,duration=299;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'heavy'
 });
 const combo=new Map([[49,2], [66,3], [84,3], [104,3], [123,3], [143,4], [163,4]]);
 const cues=new Map([[1,['impact-heavy',.9]], [49,['human-limit-grab',1]], [66,['human-limit-swing',1]], [84,['human-limit-crate',1]], [104,['human-limit-swing',1]], [123,['human-limit-crate',1]], [143,['human-limit-grab',1]], [163,['human-limit-swing',1]], [205,['human-limit-drop',1]]]);
 const finalStrike={name:'クレーン・ドロップ',type:'limitFinisher',damage:26,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('human',HumanLimitProfile,()=>HumanLimitVFX);

"use strict";

const RaymanLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=394+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[48,3], [85,3], [119,3], [148,3], [190,3], [235,3], [283,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [48,["rayman-limit-punch",1]], [85,["rayman-limit-bounce",1]], [119,["rayman-limit-punch",1]], [148,["rayman-limit-punch",1]], [190,["rayman-limit-bounce",1]], [235,["rayman-limit-glide",1]], [283,["rayman-limit-punch",1]], [333,["rayman-limit-finish",1]]]);
 const finalStrike={name:'ヘアコプター・テレスコピックフィスト',type:'limitFinisher',damage:26,launchDamage:36,reverseLaunch:true,angle:-0.59,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('rayman',RaymanLimitProfile,()=>RaymanLimitVFX);

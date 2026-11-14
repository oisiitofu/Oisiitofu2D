'use strict';

const ChiikawaLimitProfile=(()=>{
 const contactHold=12,cutInHold=21,duration=295;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:15,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[47,2], [64,3], [82,3], [101,3], [119,3], [138,4], [157,4]]);
 const cues=new Map([[1,['impact-heavy',.9]], [47,['chiikawa-limit-pole',1]], [64,['chiikawa-limit-vault',1]], [82,['chiikawa-limit-pole',1]], [101,['chiikawa-limit-push',1]], [119,['chiikawa-limit-vault',1]], [138,['chiikawa-limit-push',1]], [157,['chiikawa-limit-pole',1]], [203,['chiikawa-limit-finish',1]]]);
 const finalStrike={name:'ふたりで討伐！',type:'limitFinisher',damage:26,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('chiikawa',ChiikawaLimitProfile,()=>ChiikawaLimitVFX);

'use strict';

const MorphieLimitProfile=(()=>{
 const contactHold=12,cutInHold=21,duration=305;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'magic'
 });
 const combo=new Map([[51,2], [68,3], [85,3], [104,3], [123,3], [142,4], [162,4]]);
 const cues=new Map([[1,['impact-heavy',.9]], [51,['morphie-limit-mass',1]], [68,['morphie-limit-mass',1]], [85,['morphie-limit-kick',1]], [104,['morphie-limit-kick',1]], [123,['morphie-limit-mass',1]], [142,['morphie-limit-plant',1]], [162,['morphie-limit-plant',1]], [211,['morphie-limit-avatar',1]]]);
 const finalStrike={name:'アバター・マスストライク',type:'limitFinisher',damage:27,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy',reverseLaunch:true};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('morphie',MorphieLimitProfile,()=>MorphieLimitVFX);

'use strict';

const QuoteLimitProfile=(()=>{
 const contactHold=12,cutInHold=21,duration=293;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'beam'
 });
 const combo=new Map([[48,2], [65,3], [82,3], [100,3], [118,3], [137,4], [157,4]]);
 const cues=new Map([[1,['impact-heavy',.9]], [48,['quote-limit-shot',1]], [65,['quote-limit-shot',1]], [82,['quote-limit-boost',1]], [100,['quote-limit-shot',1]], [118,['quote-limit-boost',1]], [137,['quote-limit-shot',1]], [157,['quote-limit-charge',1]], [202,['quote-limit-spur',1]]]);
 const finalStrike={name:'シュプール MAX',type:'limitFinisher',damage:27,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'beam'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('quote',QuoteLimitProfile,()=>QuoteLimitVFX);

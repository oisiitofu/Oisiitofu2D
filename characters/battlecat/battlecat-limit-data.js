'use strict';

const BattlecatLimitProfile=(()=>{
 const contactHold=12,cutInHold=21,duration=300;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:16,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[48,2], [66,3], [84,3], [102,3], [121,3], [140,4], [160,4]]);
 const cues=new Map([[1,['impact-heavy',.9]], [48,['battlecat-limit-paw',1]], [66,['battlecat-limit-cart',1]], [84,['battlecat-limit-paw',1]], [102,['battlecat-limit-cart',1]], [121,['battlecat-limit-paw',1]], [140,['battlecat-limit-lever',1]], [160,['battlecat-limit-lever',1]], [209,['battlecat-limit-cannon',1]]]);
 const finalStrike={name:'総攻撃！にゃんこ砲',type:'limitFinisher',damage:27,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('battlecat',BattlecatLimitProfile,()=>BattlecatLimitVFX);

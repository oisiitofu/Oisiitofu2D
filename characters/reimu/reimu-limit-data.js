'use strict';

const ReimuLimitProfile=(()=>{
 const contactHold=12,cutInHold=21,duration=302;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'magic'
 });
 const combo=new Map([[48,2], [66,3], [84,3], [102,3], [121,3], [140,4], [160,4]]);
 const cues=new Map([[1,['impact-heavy',.9]], [48,['reimu-limit-charm',1]], [66,['reimu-limit-charm',1]], [84,['reimu-limit-seal',1]], [102,['reimu-limit-charm',1]], [121,['reimu-limit-seal',1]], [140,['reimu-limit-orb',1]], [160,['reimu-limit-orb',1]], [210,['reimu-limit-finish',1]]]);
 const finalStrike={name:'霊符「夢想封印」',type:'limitFinisher',damage:26,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('reimu',ReimuLimitProfile,()=>ReimuLimitVFX);

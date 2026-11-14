'use strict';

const KnightLimitProfile=(()=>{
 const contactHold=12,cutInHold=21,duration=301;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[48,2], [65,3], [83,3], [101,3], [121,3], [141,4], [162,4]]);
 const cues=new Map([[1,['impact-heavy',.9]], [48,['knight-limit-nail',1]], [65,['knight-limit-pogo',1]], [83,['knight-limit-pogo',1]], [101,['knight-limit-nail',1]], [121,['knight-limit-pogo',1]], [141,['knight-limit-nail',1]], [162,['knight-limit-void',1]], [211,['knight-limit-finish',1]]]);
 const finalStrike={name:'虚無の奔流',type:'limitFinisher',damage:27,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('knight',KnightLimitProfile,()=>KnightLimitVFX);

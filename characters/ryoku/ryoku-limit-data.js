'use strict';

const RyokuLimitProfile=(()=>{
 const contactHold=12,cutInHold=21,duration=297;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'magic'
 });
 const combo=new Map([[48,2], [65,3], [83,3], [101,3], [120,3], [140,4], [159,4]]);
 const cues=new Map([[1,['impact-heavy',.9]], [48,['ryoku-limit-tap',1]], [65,['ryoku-limit-tea',1]], [83,['ryoku-limit-tap',1]], [101,['ryoku-limit-steam',1]], [120,['ryoku-limit-tea',1]], [140,['ryoku-limit-tap',1]], [159,['ryoku-limit-steam',1]], [204,['ryoku-limit-finish',1]]]);
 const finalStrike={name:'緑茶の湯けむり大波',type:'limitFinisher',damage:26,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('ryoku',RyokuLimitProfile,()=>RyokuLimitVFX);

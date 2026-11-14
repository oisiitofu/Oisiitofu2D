'use strict';

const CojicojiLimitProfile=(()=>{
 const contactHold=12,cutInHold=21,duration=302;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'magic'
 });
 const combo=new Map([[48,2], [66,3], [85,3], [105,3], [124,3], [143,4], [163,4]]);
 const cues=new Map([[1,['impact-heavy',.9]], [48,['cojicoji-limit-star',1]], [66,['cojicoji-limit-float',1]], [85,['cojicoji-limit-star',1]], [105,['cojicoji-limit-moon',1]], [124,['cojicoji-limit-star',1]], [143,['cojicoji-limit-float',1]], [163,['cojicoji-limit-moon',1]], [210,['cojicoji-limit-finish',1]]]);
 const finalStrike={name:'メルヘンの星降り',type:'limitFinisher',damage:27,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('cojicoji',CojicojiLimitProfile,()=>CojicojiLimitVFX);

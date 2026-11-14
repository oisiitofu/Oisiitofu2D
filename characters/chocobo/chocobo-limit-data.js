'use strict';

const ChocoboLimitProfile=(()=>{
 const contactHold=13,duration=258;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:10,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'kick'
 });
 const combo=new Map([[47, 3], [63, 3], [82, 4], [101, 4], [120, 4], [139, 4]]);
 const cues=new Map([[1,['punch-heavy',1]],...[...combo.keys()].map((time,index)=>[time,['punch-heavy',.86+index*.046]]),
  [191,['chocobo-limit-meteor',1]]]);
 const finalStrike={name:'チョコメテオ',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'kick'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('chocobo',ChocoboLimitProfile,()=>ChocoboLimitVFX);

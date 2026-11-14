"use strict";

const DeemoLimitProfile=(()=>{
 const contactHold=15,cutInHold=23,duration=449;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:221,hitboxSize:1.6,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'magic'
 });
 const combo=new Map([[52,2],[81,2],[115,3],[149,3],[184,3],[252,4],[294,4]]);
 const cues=new Map([[1,['impact-heavy',.9]],[52,['deemo-limit-bass',1]],[81,['deemo-limit-keys',.8]],
  [115,['deemo-limit-keys',1]],[149,['deemo-limit-keys',.9]],[184,['deemo-limit-root',1]],
  [252,['deemo-limit-root',.9]],[294,['deemo-limit-keys',1]],[344,['deemo-limit-finish',1]]]);
 const finalStrike={name:'天窓に届く最後の和音',type:'limitFinisher',damage:26,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('deemo',DeemoLimitProfile,()=>DeemoLimitVFX);

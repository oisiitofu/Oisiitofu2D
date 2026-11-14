"use strict";

const SansLimitProfile=(()=>{
 const contactHold=15,cutInHold=23,duration=449;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:221,hitboxSize:1.6,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'magic'
 });
 const combo=new Map([[56,2],[96,3],[135,3],[173,3],[222,3],[265,4],[302,4]]);
 const cues=new Map([[1,['impact-heavy',.9]],[56,['sans-limit-gravity',1]],[96,['sans-limit-bone',1]],
  [135,['sans-limit-bone',.82]],[173,['sans-limit-gravity',.9]],[222,['sans-limit-blaster',.87]],
  [265,['sans-limit-blaster',1]],[302,['sans-limit-blaster',.94]],[348,['sans-limit-finish',1]]]);
 const finalStrike={name:'ガスターブラスター・クロス',type:'limitFinisher',damage:26,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('sans',SansLimitProfile,()=>SansLimitVFX);

"use strict";

const MegaManExeLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=405+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:211,hitboxSize:1.58,pose:40,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'magic'
 });
 const combo=new Map([[49,2],[78,2],[122,3],[164,3],[207,4],[252,4],[286,3]]);
 const cues=new Map([[1,['impact-heavy',.9]],[49,['exe-limit-buster',1]],[78,['exe-limit-buster',.8]],
  [122,['exe-limit-panel',1]],[164,['exe-limit-sword',.8]],[207,['exe-limit-sword',1]],
  [252,['exe-limit-sword',1]],[286,['exe-limit-panel',.9]],[334,['exe-limit-finish',1]]]);
 const finalStrike={name:'ドリームソード',type:'limitFinisher',damage:27,launchDamage:37,angle:-.48,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('megamanexe',MegaManExeLimitProfile,()=>MegaManExeLimitVFX);

'use strict';
const KingbonbyLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=320+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light'};
 const combo=new Map([[49, 1], [63, 1], [77, 1], [91, 1], [105, 1], [133, 3], [163, 3], [193, 3], [223, 2], [246, 2]]);
 const cues=new Map([[1,['punch-heavy',.94]],[49,['kingbonby-limit-dice',1.04]],[63,['kingbonby-limit-dice',1.04]],[77,['kingbonby-limit-dice',1.04]],[91,['kingbonby-limit-dice',1.04]],[105,['kingbonby-limit-dice',1.04]],[133,['punch-heavy',1.04]],[163,['punch-heavy',1.04]],[193,['punch-heavy',1.04]],[215,['charge',1.04]],[223,['kingbonby-limit-destroy',1.04]],[246,['explosion',1.04]],[283,['kingbonby-limit-destroy',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('kingbonby',KingbonbyLimitProfile,()=>KingbonbyLimitVFX);

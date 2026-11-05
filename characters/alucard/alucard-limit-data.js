'use strict';
const AlucardLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=310+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light'};
 const combo=new Map([[48, 2], [76, 2], [106, 2], [132, 2], [158, 2], [184, 2], [224, 2], [244, 2], [264, 2]]);
 const cues=new Map([[1,['sword-hit-heavy',.94]],[48,['alucard-limit-flurry',1.04]],[76,['alucard-limit-flurry',1.04]],[106,['sword-hit-heavy',1.04]],[132,['alucard-limit-flurry',1.04]],[158,['sword-hit-heavy',1.04]],[184,['alucard-limit-flurry',1.04]],[205,['charge',1.04]],[224,['staff-hit-heavy',1.04]],[244,['staff-hit-heavy',1.04]],[264,['staff-hit-heavy',1.04]],[281,['alucard-limit-soul',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('alucard',AlucardLimitProfile,()=>AlucardLimitVFX);

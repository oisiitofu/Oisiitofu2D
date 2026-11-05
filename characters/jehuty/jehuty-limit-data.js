'use strict';
const JehutyLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=340+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:16,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'electric'};
 const combo=new Map([[53,2],[81,2],[112,2],[141,2],[180,2],[208,2],[225,2],[239,2],[253,2]]);
 const cues=new Map([[1,['sword-hit-heavy',.94]],[40,['jehuty-limit-shift',1.04]],
  [53,['sword-hit-heavy',1.04]],[70,['jehuty-limit-shift',1.04]],[81,['sword-hit-heavy',1.04]],
  [112,['sword-hit-heavy',1.04]],[141,['sword-hit-heavy',1.04]],[158,['charge',1.04]],
  [169,['jehuty-limit-shift',1.04]],[180,['sword-hit-heavy',1.04]],[196,['jehuty-limit-shift',1.04]],
  [208,['sword-hit-heavy',1.04]],[225,['gun-shot',1.04]],[239,['gun-shot',1.04]],[253,['gun-shot',1.04]],
  [267,['charge',1.04]],[302,['jehuty-limit-vector',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('jehuty',JehutyLimitProfile,()=>JehutyLimitVFX);

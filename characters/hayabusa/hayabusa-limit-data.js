'use strict';
const HayabusaLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=272+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'fire'};
 const combo=new Map([[47, 2], [65, 2], [83, 2], [101, 2], [119, 2], [137, 2], [155, 2], [174, 2], [207, 1], [217, 1]]);
 const cues=new Map([[1,['sword-hit-heavy',.94]],[30,['charge',1.04]],[47,['hayabusa-limit-blade',1.04]],[65,['sword-hit-heavy',1.04]],[83,['hayabusa-limit-blade',1.04]],[101,['sword-hit-heavy',1.04]],[119,['hayabusa-limit-blade',1.04]],[137,['sword-hit-heavy',1.04]],[155,['hayabusa-limit-blade',1.04]],[174,['sword-hit-heavy',1.04]],[192,['charge',1.04]],[207,['fire-hit',1.04]],[217,['fire-hit',1.04]],[234,['hayabusa-limit-inferno',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('hayabusa',HayabusaLimitProfile,()=>HayabusaLimitVFX);

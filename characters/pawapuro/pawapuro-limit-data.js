'use strict';
const PawapuroLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=260+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'staff'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical'};
 const combo=new Map([[48,2],[67,2],[85,2],[105,2],[126,2],[147,2],[169,2],[188,3]]);
 const cues=new Map([[1,['staff-hit-heavy',.93]],[48,['pawapuro-limit-pitch',.91]],[67,['pawapuro-limit-pitch',1]],
  [85,['pawapuro-limit-pitch',1.09]],[105,['pawapuro-limit-pitch',1.18]],[126,['staff-hit-heavy',.96]],
  [147,['staff-hit-heavy',1.04]],[169,['staff-hit-heavy',1.12]],[188,['staff-hit-heavy',1.19]],
  [209,['charge',1.05]],[228,['pawapuro-limit-homer',1.12]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('pawapuro',PawapuroLimitProfile,()=>PawapuroLimitVFX);

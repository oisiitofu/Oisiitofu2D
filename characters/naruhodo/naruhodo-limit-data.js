'use strict';
const NaruhodoLimitProfile=(()=>{
 const contactHold=12,cutInHold=24,duration=248+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:9,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical',projectile:true};
 const combo=new Map([[47,2],[69,2],[92,2],[119,2],[143,2],[167,4]]);
 const cues=new Map([[1,['punch-heavy',.9]],[47,['punch-heavy',1]],[69,['staff-swing',.95]],
  [92,['punch-light',1]],[119,['punch-light',1.04]],[143,['naruhodo-limit-gavel',.9]],[167,['naruhodo-limit-gavel',1]],
  [192,['power',.84]],[211,['naruhodo-limit-turnabout',1.16]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('naruhodo',NaruhodoLimitProfile,()=>NaruhodoLimitVFX);

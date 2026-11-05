'use strict';
const ViewtifulJoeLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=250+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical'};
 const combo=new Map([[57,2],[85,1],[91,1],[97,1],[103,1],[111,1],[121,1],[139,2],[164,2],[185,2]]);
 const cues=new Map([[1,['punch-heavy',.91]],[30,['viewtifuljoe-limit-film',.86]],[57,['punch-heavy',.93]],
  [76,['viewtifuljoe-limit-film',1.05]],[85,['punch-light',.9]],[91,['punch-light',.94]],[97,['punch-light',.98]],
  [103,['punch-light',1.03]],[111,['punch-light',1.08]],[121,['punch-light',1.12]],[139,['punch-heavy',1.04]],
  [164,['punch-heavy',1.09]],[185,['punch-heavy',1.14]],[195,['viewtifuljoe-limit-film',1.16]],[216,['viewtifuljoe-limit-kick',1.18]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('viewtifuljoe',ViewtifulJoeLimitProfile,()=>ViewtifulJoeLimitVFX);

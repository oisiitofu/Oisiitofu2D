'use strict';
const HunterLimitProfile=(()=>{
 const contactHold=14,cutInHold=25,duration=254+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:15,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical'};
 const combo=new Map([[43,2],[71,2],[103,3],[126,2],[158,3],[200,2]]);
 const cues=new Map([[1,['punch-heavy',.94]],[43,['body-slam',.9]],[71,['sword-hit-heavy',.91]],
  [91,['hunter-limit-charge',.86]],[103,['sword-hit-heavy',1.01]],[126,['body-slam',1.02]],
  [145,['hunter-limit-charge',1]],[158,['sword-hit-heavy',1.13]],[176,['hunter-limit-charge',1.09]],
  [200,['sword-hit-heavy',.95]],[218,['hunter-limit-truecharge',1.16]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('hunter',HunterLimitProfile,()=>HunterLimitVFX);

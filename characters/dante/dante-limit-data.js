'use strict';
const DanteLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=269+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical'};
 const combo=new Map([[44,2],[59,3],[76,1],[82,1],[88,1],[94,1],[100,1],[157,2],[173,2],[189,2],[205,2]]);
 const cues=new Map([[1,['sword-hit-heavy',.91]],[44,['sword-hit-heavy',.94]],[59,['sword-hit-heavy',1.07]],
  [76,['gun-shot',.91]],[82,['gun-shot',.98]],[88,['gun-shot',1.04]],[94,['gun-shot',1.10]],[100,['gun-shot',1.17]],
  [121,['dante-limit-awaken',.96]],[157,['sword-hit-heavy',.87]],[173,['sword-hit-heavy',.99]],
  [189,['sword-hit-heavy',1.09]],[205,['sword-hit-heavy',1.18]],[236,['dante-limit-judgement',1.12]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('dante',DanteLimitProfile,()=>DanteLimitVFX);

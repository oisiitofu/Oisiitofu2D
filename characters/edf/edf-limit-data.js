'use strict';
const EdfLimitProfile=(()=>{
 const contactHold=13,cutInHold=25,duration=251+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:8,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'gun'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical',projectile:true};
 const combo=new Map([[44,1],[51,1],[59,1],[83,3],[117,2],[132,2],[147,2],[163,2]]);
 const cues=new Map([[1,['bullet-hit-heavy',.94]],[44,['gun-shot',.91]],[51,['gun-shot',.95]],[59,['gun-shot',1]],
  [77,['rocket',1]],[83,['explosion',.9]],[98,['edf-limit-radio',1]],
  [117,['explosion',.82]],[132,['explosion',.91]],[147,['explosion',1]],[163,['explosion',1.07]],
  [182,['engine',.98]],[216,['edf-limit-barga',1.12]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('edf',EdfLimitProfile,()=>EdfLimitVFX);

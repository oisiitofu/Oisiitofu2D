"use strict";

const KiryuLimitProfile=(()=>{
 const contactHold=16,cutInHold=22;
 const duration=346+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'heavy'
 });
 const combo=new Map([[62,3],[81,3],[111,4],[153,2],[193,5],[217,4]]);
 const cues=new Map([[1,['impact-heavy',.96]],[46,['kiryu-limit-rush',.64]],[62,['kiryu-limit-rush',1.12]],
  [81,['kiryu-limit-rush',.94]],[111,['kiryu-limit-rush',.82]],[153,['kiryu-limit-rush',.69]],
  [193,['kiryu-limit-wall',1.17]],[217,['kiryu-limit-wall',1.02]],[288,['kiryu-limit-wall',.79]]]);
 const finalStrike={name:'堂島の龍・絆覚醒',type:'limitFinisher',damage:25,launchDamage:36,angle:-.48,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('kiryu',KiryuLimitProfile,()=>KiryuLimitVFX);

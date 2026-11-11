"use strict";

const AiAiLimitProfile=(()=>{
 const contactHold=16,cutInHold=22;
 const duration=365+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[83,3],[118,4],[161,4],[201,5],[261,4]]);
 const cues=new Map([[1,['impact-heavy',.94]],[60,['aiai-limit-roll',.85]],[83,['aiai-limit-bumper',1.2]],
  [118,['aiai-limit-bumper',.99]],[161,['aiai-limit-bumper',1.1]],[201,['aiai-limit-bumper',.89]],
  [241,['aiai-limit-roll',1.08]],[261,['aiai-limit-bumper',1.28]],[323,['aiai-limit-goal',1]]]);
 const finalStrike={name:'ゴールデン・スピンダッシュ',type:'limitFinisher',damage:26,launchDamage:36,angle:-.56,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('aiai',AiAiLimitProfile,()=>AiAiLimitVFX);

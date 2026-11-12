"use strict";

const SamLimitProfile=(()=>{
 const contactHold=16,cutInHold=23;
 const duration=379+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'heavy'
 });
 const combo=new Map([[68,3],[108,3],[150,4],[190,4],[228,3],[278,4]]);
 const cues=new Map([
  [1,['impact-heavy',0.93]],
  [53,['sam-limit-odradek',1.12]],
  [68,['sam-limit-tar',0.81]],
  [108,['sam-limit-carrier',0.93]],
  [150,['sam-limit-carrier',1.1]],
  [190,['impact-heavy',0.8]],
  [228,['sam-limit-odradek',0.86]],
  [278,['sam-limit-grenade',1.05]],
  [332,['sam-limit-tar',1.13]]
 ]);
 const finalStrike={name:'キャッチャー・タールの波',type:'limitFinisher',damage:26,launchDamage:36,angle:-0.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy',reverseLaunch:true};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('sam',SamLimitProfile,()=>SamLimitVFX);

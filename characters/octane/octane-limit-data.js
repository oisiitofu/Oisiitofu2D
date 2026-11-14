"use strict";

const OctaneLimitProfile=(()=>{
 const contactHold=15,cutInHold=23,duration=441;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:8,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'heavy'
 });
 const combo=new Map([[49,2],[83,3],[114,3],[153,3],[216,3],[254,4],[291,4]]);
 const cues=new Map([[1,['impact-heavy',.9]],[49,['octane-limit-stim',1]],[83,['octane-limit-pad',1]],
  [114,['octane-limit-kick',1]],[153,['octane-limit-kick',.88]],[216,['octane-limit-pad',1]],
  [254,['octane-limit-kick',1]],[291,['octane-limit-kick',1]],[336,['octane-limit-finish',1]]]);
 const finalStrike={name:'ランチパッド・ダブルストンプ',type:'limitFinisher',damage:27,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('octane',OctaneLimitProfile,()=>OctaneLimitVFX);

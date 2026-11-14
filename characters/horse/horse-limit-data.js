"use strict";

const HorseLimitProfile=(()=>{
 const contactHold=15,cutInHold=23,duration=453;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'heavy'
 });
 const combo=new Map([[54,2],[95,3],[137,3],[174,3],[224,3],[266,4],[304,4]]);
 const cues=new Map([[1,['impact-heavy',.9]],[54,['horse-limit-plank',1]],[95,['horse-limit-plank',.85]],
  [137,['horse-limit-spring',1]],[174,['horse-limit-spring',.88]],[224,['horse-limit-spin',1]],
  [266,['horse-limit-spin',.9]],[304,['horse-limit-plank',.92]],[351,['horse-limit-goal',1]]]);
 const finalStrike={name:'ウマの障害物コース',type:'limitFinisher',damage:26,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('horse',HorseLimitProfile,()=>HorseLimitVFX);

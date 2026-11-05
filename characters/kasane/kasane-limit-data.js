'use strict';
const KasaneLimitProfile=(()=>{
 const contactHold=13,cutInHold=23,duration=249+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical',projectile:true};
 const combo=new Map([[51,2],[65,2],[80,2],[107,3],[143,2],[165,3]]);
 const cues=new Map([[1,['slash-heavy',.87]],[51,['sword-hit',.89]],[65,['sword-hit',.94]],[80,['sword-hit',1]],[107,['earth-hit-heavy',1.04]],[123,['dark-cast',1]],[143,['slash-heavy',1.04]],[165,['earth-hit-heavy',1.09]],[188,['dark-hit-heavy',1.14]],[198,['explosion',1.2]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('kasane',KasaneLimitProfile,()=>KasaneLimitVFX);

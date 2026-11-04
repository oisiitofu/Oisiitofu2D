'use strict';
const LloydLimitProfile=(()=>{
 const contactHold=13,cutInHold=22,duration=250+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light',projectile:true};
 const combo=new Map([[52,2],[66,2],[86,3],[112,2],[143,2],[167,3]]);
 const cues=new Map([[1,['slash-heavy',.9]],[52,['sword-hit',.94]],[66,['sword-hit',1]],[86,['sword-hit-heavy',1]],[103,['wind-cast',.9]],[112,['sword-hit',1]],[130,['light-cast',1]],[143,['sword-hit',1.04]],[167,['sword-hit-heavy',1.08]],[194,['slash-heavy',1.23]],[207,['light-hit-heavy',1.16]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('lloyd',LloydLimitProfile,()=>LloydLimitVFX);

'use strict';
const DoshinLimitProfile=(()=>{
 const contactHold=15,cutInHold=21,duration=246+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'earth',projectile:true};
 const combo=new Map([[61,3],[83,3],[143,4],[166,4]]);
 const cues=new Map([[1,['body-slam',1]],[61,['earth-hit-heavy',.9]],[83,['earth-hit-heavy',1]],[104,['dark-cast',1]],[143,['slash-heavy',1]],[166,['body-slam',1.1]],[188,['explosion',1.22]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:['body-slam',1]};
})();
LimitBreak.define('doshin',DoshinLimitProfile,()=>DoshinLimitVFX);

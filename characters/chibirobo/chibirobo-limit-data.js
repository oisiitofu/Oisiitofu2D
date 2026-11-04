'use strict';
const ChibiRoboLimitProfile=(()=>{
 const contactHold=12,cutInHold=22,duration=243+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'hammer'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:23,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'thunder',projectile:true};
 const combo=new Map([[49,2],[62,2],[75,2],[147,3],[168,4]]);
 const cues=new Map([[1,['hammer-hit-heavy',.9]],[41,['gun-shot',.9]],[54,['gun-shot',.98]],[67,['gun-shot',1.05]],[104,['thunder-cast',.9]],[147,['thunder-hit',1]],[168,['thunder-hit-heavy',1.1]],[187,['explosion',1.18]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:['hammer-hit-heavy',1]};
})();
LimitBreak.define('chibirobo',ChibiRoboLimitProfile,()=>ChibiRoboLimitVFX);

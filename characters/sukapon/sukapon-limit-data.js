'use strict';
const SukaponLimitProfile=(()=>{
 const contactHold=14,cutInHold=22,duration=244+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:36,angle:-.48,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical',projectile:true};
 const cues=new Map([[1,['shield-hit',1]],[35,['wind-cast',.8]],[61,['shield-hit',.93]],[83,['wind-cast',.88]],[102,['wind-cast',1]],[130,['shield-hit',1.05]],[160,['punch-heavy',1.14]],[173,['explosion',1.14]],[216,['light-cast',.77]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['shield-hit',1]};
})();
LimitBreak.define('sukapon',SukaponLimitProfile,()=>SukaponLimitVFX);

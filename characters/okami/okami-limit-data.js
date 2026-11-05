'use strict';
const OkamiLimitProfile=(()=>{
 const contactHold=13,cutInHold=24,duration=250+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'claw'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light',projectile:true};
 const combo=new Map([[45,2],[60,2],[78,2],[103,2],[121,2],[145,2],[164,2]]);
 const cues=new Map([[1,['claw-hit-heavy',.9]],[45,['okami-limit-brush',.86]],[60,['okami-limit-brush',.94]],
  [78,['okami-limit-brush',1.05]],[103,['fire-hit',.94]],[121,['fire-hit-heavy',1]],
  [145,['thunder-hit',1.01]],[164,['thunder-hit-heavy',1.08]],[185,['power',.86]],[213,['okami-limit-dawn',1.14]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('okami',OkamiLimitProfile,()=>OkamiLimitVFX);

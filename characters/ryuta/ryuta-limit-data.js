'use strict';
const RyutaLimitProfile=(()=>{
 const contactHold=13,cutInHold=22,duration=239+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:24,launchDamage:36,angle:-.52,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical',projectile:true};
 const combo=new Map([[56,2],[74,2],[92,2],[110,2],[154,4]]);
 const cues=new Map([[1,['punch-heavy',.88]],[38,['menu',.8]],[56,['punch-light',.85]],[74,['punch-heavy',.93]],[92,['punch-heavy',1]],[110,['punch-heavy',1.07]],[132,['wind-cast',1]],[154,['earth-hit-heavy',1.13]],[175,['explosion',1.22]],[213,['menu',.75]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:['punch-heavy',1]};
})();
LimitBreak.define('ryuta',RyutaLimitProfile,()=>RyutaLimitVFX);

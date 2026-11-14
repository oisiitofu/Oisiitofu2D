'use strict';
const BayleefLimitProfile=(()=>{
 const contactHold=13,cutInHold=22,duration=251+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'wing'
 });
 const finalStrike={name:'ソーラービーム',type:'limitFinisher',damage:23,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light',projectile:true};
 const combo=new Map([[54,2],[69,2],[87,3],[107,3],[173,3]]);
 const cues=new Map([[1,['wing-swing',.9]],[54,['wind-hit',.93]],[69,['wind-hit',1]],[87,['staff-hit',.95]],[107,['staff-hit-heavy',1]],[135,['light-cast',1]],[162,['thunder-cast',.95]],[173,['light-hit',.95]],[187,['beam-shot',1.19]],[196,['beam-hit-heavy',1.17]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('bayleef',BayleefLimitProfile,()=>BayleefLimitVFX);

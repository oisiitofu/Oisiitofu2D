'use strict';
const IoLimitProfile=(()=>{
 const contactHold=14,cutInHold=23,duration=255+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'spear'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:23,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light',projectile:true};
 const combo=new Map([[54,2],[72,2],[93,3],[131,3],[157,3]]);
 const cues=new Map([[1,['spear-hit-heavy',.91]],[54,['spear-hit',.93]],[72,['spear-hit',1]],[93,['spear-hit-heavy',1.03]],[115,['dark-cast',.87]],[131,['earth-hit-heavy',1.04]],[157,['light-hit',1]],[174,['light-cast',1]],[197,['light-hit-heavy',1.18]],[214,['wind-cast',.86]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('io',IoLimitProfile,()=>IoLimitVFX);

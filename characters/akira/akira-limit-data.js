'use strict';
const AkiraLimitProfile=(()=>{
 const contactHold=13,cutInHold=25,duration=216+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-14));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:36,angle:-.52,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light',projectile:true};
 const cues=new Map([[1,['shield-hit',.8]],[38,['light-cast',.9]],[57,['shield-hit',.95]],
  [82,['thunder-cast',.8]],[106,['wind-cast',1]],[133,['slash-heavy',1.15]],
  [150,['beam-hit-heavy',1.15]],[155,['explosion',1.18]],[187,['wind-cast',.62]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['shield-hit',1]};
})();
LimitBreak.define('akira',AkiraLimitProfile,()=>AkiraLimitVFX);

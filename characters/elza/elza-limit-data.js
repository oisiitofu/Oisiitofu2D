'use strict';
const ElzaLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=228+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:36,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'sword',projectile:true};
 const cues=new Map([[1,['slash-heavy',.86]],[35,['light-cast',.8]],[60,['light-cast',1.05]],
  [91,['wind-cast',.85]],[117,['wind-cast',1.07]],[150,['slash-heavy',1.18]],
  [160,['explosion',1.15]],[179,['shield-hit',.8]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['slash-heavy',1]};
})();
LimitBreak.define('elza',ElzaLimitProfile,()=>ElzaLimitVFX);

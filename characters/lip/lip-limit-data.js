'use strict';
const LipLimitProfile=(()=>{
 const contactHold=12,cutInHold=23,duration=242+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'light'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:36,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light',projectile:true};
 const cues=new Map([[1,['parry',.82]],[38,['light-cast',.81]],[59,['menu',.85]],[75,['light-hit',.94]],[96,['light-hit',1.04]],[117,['light-hit-heavy',1.1]],[140,['wind-cast',.98]],[165,['earth-hit-heavy',1.18]],[178,['explosion',1.14]],[213,['light-cast',.78]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['light-hit',.94]};
})();
LimitBreak.define('lip',LipLimitProfile,()=>LipLimitVFX);

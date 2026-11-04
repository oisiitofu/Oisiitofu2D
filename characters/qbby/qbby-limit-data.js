'use strict';
const QbbyLimitProfile=(()=>{
 const contactHold=12,cutInHold=23,duration=232+contactHold+cutInHold;
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
 const cues=new Map([[1,['parry',.85]],[38,['menu',.8]],[47,['shield-hit',.86]],[56,['shield-hit',.93]],[65,['shield-hit',1]],[74,['shield-hit',1.05]],[99,['wind-cast',.88]],[122,['light-cast',1]],[148,['beam-shot',1.09]],[171,['earth-hit-heavy',1.12]],[177,['explosion',1.19]],[206,['light-cast',.69]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['shield-hit',1]};
})();
LimitBreak.define('qbby',QbbyLimitProfile,()=>QbbyLimitVFX);

'use strict';
const RingfitLimitProfile=(()=>{
 const contactHold=13,cutInHold=22,duration=242+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'wind'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:36,angle:-.52,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'wind',projectile:true};
 const cues=new Map([[1,['shield-hit',.88]],[40,['dark-cast',.82]],[66,['shield-hit',1.07]],[86,['wind-cast',.86]],[103,['wind-cast',.99]],[120,['wind-cast',1.1]],[154,['beam-shot',1.12]],[170,['wind-hit-heavy',1.18]],[182,['explosion',1.2]],[218,['wind-cast',.65]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['shield-hit',1]};
})();
LimitBreak.define('ringfit',RingfitLimitProfile,()=>RingfitLimitVFX);

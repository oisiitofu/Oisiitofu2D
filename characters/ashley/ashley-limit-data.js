'use strict';
const AshleyLimitProfile=(()=>{
 const contactHold=15,cutInHold=24,duration=250+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'dark'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:36,angle:-.56,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'dark',projectile:true};
 const cues=new Map([[1,['dark-cast',.86]],[43,['wind-cast',.77]],[69,['water-cast',.79]],[93,['dark-cast',1]],[119,['fire-cast',.97]],[144,['thunder-cast',1.06]],[164,['beam-shot',1.08]],[181,['dark-hit-heavy',1.18]],[187,['explosion',1.16]],[220,['wind-cast',.74]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['dark-hit',.94]};
})();
LimitBreak.define('ashley',AshleyLimitProfile,()=>AshleyLimitVFX);

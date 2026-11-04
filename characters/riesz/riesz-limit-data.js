'use strict';
const RieszLimitProfile=(()=>{
 const contactHold=11,cutInHold=24,duration=255+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:215,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'spear',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:31,angle:-.59,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'wind',projectile:true};
 const cues=new Map([[1,['spear-thrust',.92]],[31,['wind-cast',.73]],[53,['wind-cast',1]],[76,['earth-cast',.81]],[96,['wind-hit-heavy',.94]],[114,['light-cast',.85]],[135,['spear-thrust',1.04]],[156,['wind-cast',1.16]],[173,['earth-hit-heavy',.94]],[188,['spear-hit-heavy',1.23]],[199,['explosion',1.28]],[223,['wind-cast',.65]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['spear-hit-heavy',1.1]};
})();
LimitBreak.define('riesz',RieszLimitProfile,()=>RieszLimitVFX);

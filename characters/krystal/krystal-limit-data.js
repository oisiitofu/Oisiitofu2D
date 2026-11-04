'use strict';
const KrystalLimitProfile=(()=>{
 const contactHold=11,cutInHold=25,duration=276+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-17));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:226,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'magic',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:35,angle:-0.47,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'ice',projectile:true};
 const cues=new Map([[1,['shield-hit',.76]],[39,['ice-cast',.83]],[62,['ice-hit-heavy',1.05]],
  [100,['wind-cast',.86]],[122,['wind-hit',1]],[148,['wind-cast',.9]],[176,['beam-shot',1.02]],
  [186,['beam-hit',1.04]],[202,['beam-hit-heavy',1.16]],[207,['explosion',1.22]],[235,['ice-cast',.65]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['ice-hit-heavy',1.04]};
})();
LimitBreak.define('krystal',KrystalLimitProfile,()=>KrystalLimitVFX);

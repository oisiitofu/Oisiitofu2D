'use strict';
const OdioLimitProfile=(()=>{
 const contactHold=11,cutInHold=25,duration=258+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-16));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:215,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword',
  animation:{anticipationPose:0,accelerationPose:6,recoveryPose:0,lean:0,lunge:0,impactScale:1}
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:33,angle:-.57,baseKnockback:4.1,knockbackGrowth:.075,launchPercentOffset:14,element:'dark',projectile:true};
 const cues=new Map([[1,['dark-cast',.85]],[34,['slash-light',.79]],[55,['sword-hit',.96]],[76,['earth-hit-heavy',1.04]],[97,['dark-cast',1.18]],[119,['fire-cast',1.04]],[145,['punch-heavy',1.14]],[161,['earth-hit-heavy',1.17]],[183,['dark-hit-heavy',1.24]],[195,['explosion',1.3]],[214,['fire-cast',.89]],[235,['dark-cast',.72]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['sword-hit-heavy',1.12]};
})();
LimitBreak.define('odio',OdioLimitProfile,()=>OdioLimitVFX);

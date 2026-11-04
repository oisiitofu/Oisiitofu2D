'use strict';
const PokoaLimitProfile=(()=>{
 const contactHold=13,cutInHold=22,duration=246+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'water'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:23,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'water',projectile:true};
 const combo=new Map([[54,2],[68,2],[93,3],[145,2],[166,4]]);
 const cues=new Map([[1,['water-hit',.86]],[54,['wind-hit',.9]],[68,['wind-hit',1]],[84,['water-cast',.9]],[93,['water-hit',1]],[112,['light-cast',1]],[145,['water-hit',.93]],[166,['water-hit-heavy',1.05]],[186,['water-hit-heavy',1.21]],[203,['water-cast',.8]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('pokoa',PokoaLimitProfile,()=>PokoaLimitVFX);

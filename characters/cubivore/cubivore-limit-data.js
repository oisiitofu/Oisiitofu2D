'use strict';
const CubivoreLimitProfile=(()=>{
 const contactHold=14,cutInHold=22,duration=236+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'earth'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:36,angle:-.48,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'earth',projectile:true};
 const cues=new Map([[1,['punch-heavy',.89]],[38,['land-heavy',.86]],[53,['claw-swing',.84]],[71,['punch-light',.94]],[86,['punch-light',1.04]],[101,['punch-heavy',1.09]],[121,['earth-cast',1.03]],[146,['wind-cast',.92]],[166,['claw-hit-heavy',1.11]],[180,['explosion',1.17]],[210,['land-heavy',.65]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['punch-heavy',1]};
})();
LimitBreak.define('cubivore',CubivoreLimitProfile,()=>CubivoreLimitVFX);

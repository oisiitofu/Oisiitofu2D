'use strict';
const KaratekaLimitProfile=(()=>{
 const contactHold=12,cutInHold=22,duration=225+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:36,angle:-.49,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical',projectile:true};
 const cues=new Map([[1,['punch-light',.85]],[39,['menu',.7]],[55,['menu',.81]],[71,['punch-light',.91]],[87,['punch-light',.98]],[103,['punch-heavy',1.03]],[119,['punch-heavy',1.08]],[135,['menu',.88]],[151,['wind-cast',.94]],[167,['punch-heavy',1.23]],[174,['explosion',1.07]],[205,['menu',.66]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['punch-heavy',1]};
})();
LimitBreak.define('karateka',KaratekaLimitProfile,()=>KaratekaLimitVFX);

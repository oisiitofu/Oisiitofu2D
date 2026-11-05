'use strict';
const LeonLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=250+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'fire'};
 const combo=new Map([[45,3],[62,4],[85,2],[110,2],[122,2],[134,2],[146,2]]);
 const cues=new Map([[1,['sword-hit-light',.94]],[45,['sword-hit-light',1.09]],[62,['punch-heavy',1.03]],
  [85,['sword-hit-light',1.17]],[110,['gun-shot',.92]],[122,['gun-shot',1.01]],[134,['gun-shot',1.09]],
  [146,['gun-shot',1.17]],[183,['leon-limit-launch',.98]],[216,['leon-limit-blast',1.12]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('leon',LeonLimitProfile,()=>LeonLimitVFX);

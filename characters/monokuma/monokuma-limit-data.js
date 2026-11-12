"use strict";

const MonokumaLimitProfile=(()=>{
 const contactHold=14,cutInHold=23;
 const duration=376+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[62,2],[98,3],[144,3],[192,4],[236,4],[275,5]]);
 const cues=new Map([
  [1,['impact-heavy',0.89]],
  [62,['monokuma-limit-gavel',1.12]],
  [98,['monokuma-limit-turntable',0.84]],
  [144,['monokuma-limit-lever',1.06]],
  [192,['monokuma-limit-ball',0.96]],
  [236,['monokuma-limit-ball',1.12]],
  [275,['monokuma-limit-ball',1.2]],
  [329,['monokuma-limit-gavel',0.79]]
 ]);
 const finalStrike={name:'学級裁判・モノクマノック',type:'limitFinisher',damage:25,launchDamage:36,angle:-0.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('monokuma',MonokumaLimitProfile,()=>MonokumaLimitVFX);

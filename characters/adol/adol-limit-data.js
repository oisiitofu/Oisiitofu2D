"use strict";

const AdolLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=376+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[55,3],[101,3],[154,3],[194,3],[234,3],[264,3],[291,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]],[55,["adol-limit-sword",1]],[101,["adol-limit-ride",1]],[154,["adol-limit-ride",1]],[194,["adol-limit-sword",1]],[234,["adol-limit-star",1]],[264,["adol-limit-star",1]],[291,["adol-limit-star",1]],[331,["adol-limit-beam",1]]]);
 const finalStrike={name:'カーマインブラスト',type:'limitFinisher',damage:26,launchDamage:36,angle:-.55,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('adol',AdolLimitProfile,()=>AdolLimitVFX);

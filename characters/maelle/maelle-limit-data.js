"use strict";

const MaelleLimitProfile=(()=>{
 const contactHold=15,cutInHold=23,duration=445;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[54,2],[92,3],[134,3],[172,3],[218,4],[254,4],[278,3]]);
 const cues=new Map([[1,['impact-heavy',.9]],[54,['maelle-limit-parry',1]],[92,['maelle-limit-riposte',1]],
  [134,['maelle-limit-riposte',.84]],[172,['maelle-limit-step',1]],[218,['maelle-limit-riposte',.91]],
  [254,['maelle-limit-riposte',1]],[278,['maelle-limit-riposte',1]],[341,['maelle-limit-stendhal',1]]]);
 const finalStrike={name:'スタンダール',type:'limitFinisher',damage:27,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('maelle',MaelleLimitProfile,()=>MaelleLimitVFX);

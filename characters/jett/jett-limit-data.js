"use strict";

const JettLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=401+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,22)],29,20,{
  damage:5,reach:202,hitboxSize:1.58,pose:31,aerial:true,canClank:false,intangibleFrames:[[1,22]],soundFamily:'sword'
 });
 const combo=new Map([[52,2],[105,3],[145,3],[181,3],[223,3],[264,4],[300,4]]);
 const cues=new Map([[1,['impact-heavy',.9]],[52,['jett-limit-knife',1]],[75,['jett-limit-wind',1]],
  [105,['jett-limit-knife',1]],[145,['jett-limit-knife',.85]],[181,['jett-limit-knife',.93]],
  [223,['jett-limit-knife',1]],[264,['jett-limit-knife',.89]],[300,['jett-limit-wind',.86]],
  [337,['jett-limit-fan',1]],[363,['jett-limit-land',1]]]);
 const finalStrike={name:'ブレードストーム',type:'limitFinisher',damage:26,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('jett',JettLimitProfile,()=>JettLimitVFX);

"use strict";

const SakuraLimitProfile=(()=>{
 const contactHold=16,cutInHold=23;
 const duration=369+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:8,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[61,4],[92,4],[217,3],[247,5],[277,4]]);
 const cues=new Map([[1,['impact-heavy',.94]],[61,['sakura-limit-blade',1.1]],[92,['sakura-limit-blade',1.21]],
  [143,['sakura-limit-steam',.76]],[193,['sakura-limit-steam',.92]],[217,['sakura-limit-blade',.99]],
  [247,['sakura-limit-blade',.87]],[277,['sakura-limit-steam',1.12]],[320,['sakura-limit-blade',.73]]]);
 const finalStrike={name:'光武・破邪剣征 桜華放神',type:'limitFinisher',damage:25,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('sakura',SakuraLimitProfile,()=>SakuraLimitVFX);

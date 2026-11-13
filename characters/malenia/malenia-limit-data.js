"use strict";

const MaleniaLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=376+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[61,3],[108,3],[129,3],[164,3],[192,3],[229,3],[268,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]],[61,["malenia-limit-draw",1]],[108,["malenia-limit-dance",1]],[129,["malenia-limit-dance",1]],[164,["malenia-limit-dance",1]],[192,["malenia-limit-dance",1]],[229,["malenia-limit-wings",1]],[268,["malenia-limit-wings",1]],[331,["malenia-limit-bloom",1]]]);
 const finalStrike={name:'水鳥乱舞・緋のエオニア',type:'limitFinisher',damage:26,launchDamage:36,angle:-.55,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('malenia',MaleniaLimitProfile,()=>MaleniaLimitVFX);

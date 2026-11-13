"use strict";

const DanaLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=376+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[58,3],[96,3],[132,3],[178,4],[221,2],[250,2],[273,2],[292,2]]);
 const cues=new Map([[1,["impact-heavy",0.9]],[58,["dana-limit-ice",1]],[96,["dana-limit-ice",1]],[132,["dana-limit-ice",1]],[178,["dana-limit-hammer",1]],[221,["dana-limit-hammer",1]],[250,["dana-limit-katar",1]],[273,["dana-limit-katar",1]],[292,["dana-limit-katar",1]],[331,["dana-limit-light",1]]]);
 const finalStrike={name:'閃煌連牙迅',type:'limitFinisher',damage:26,launchDamage:36,angle:-.55,reverseLaunch:true,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('dana',DanaLimitProfile,()=>DanaLimitVFX);

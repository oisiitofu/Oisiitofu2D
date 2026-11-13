"use strict";

const KisukeLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=382+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[52,3], [93,3], [130,3], [185,4], [225,4], [265,4]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [52,["kisuke-limit-parry",1]], [93,["kisuke-limit-draw",1]], [130,["kisuke-limit-draw",1]], [185,["kisuke-limit-swap",1]], [225,["kisuke-limit-draw",1]], [265,["kisuke-limit-sheath",1]], [332,["kisuke-limit-finish",1]]]);
 const finalStrike={name:'妖刀・納刀一閃',type:'limitFinisher',damage:26,launchDamage:36,angle:-0.55,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('kisuke',KisukeLimitProfile,()=>KisukeLimitVFX);

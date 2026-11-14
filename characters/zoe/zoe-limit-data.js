"use strict";

const ZoeLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=394+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[53,3], [92,3], [132,3], [177,3], [222,3], [260,3], [294,3]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [53,["zoe-limit-stomp",1]], [92,["zoe-limit-claw",1]], [132,["zoe-limit-claw",1]], [177,["zoe-limit-stomp",1]], [222,["zoe-limit-fire",1]], [260,["zoe-limit-fire",1]], [294,["zoe-limit-stomp",1]], [334,["zoe-limit-finish",1]]]);
 const finalStrike={name:'イエロータンク・雷撃放電',type:'limitFinisher',damage:26,launchDamage:36,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('zoe',ZoeLimitProfile,()=>ZoeLimitVFX);

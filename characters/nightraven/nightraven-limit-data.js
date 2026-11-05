'use strict';
const NightravenLimitProfile=(()=>{
 const contactHold=12,cutInHold=22,duration=256+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:40,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'beam'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'beam',projectile:true};
 const combo=new Map([[45,1],[56,1],[68,2],[101,2],[118,2],[137,3],[160,3]]);
 const cues=new Map([[1,['beam-hit',.95]],[45,['beam-shot',.88]],[56,['beam-shot',.94]],[68,['beam-shot',1]],
  [86,['nightraven-limit-lock',1]],[101,['rocket',.93]],[118,['explosion',.91]],[137,['explosion',1]],
  [160,['explosion',1.08]],[183,['power',.83]],[211,['nightraven-limit-tls',1.1]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('nightraven',NightravenLimitProfile,()=>NightravenLimitVFX);

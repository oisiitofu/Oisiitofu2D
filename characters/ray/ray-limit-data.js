'use strict';
const RayLimitProfile=(()=>{
 const contactHold=12,cutInHold=22,duration=249+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'gun'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'beam',projectile:true};
 const combo=new Map([[52,3],[84,3],[104,2],[118,2],[132,2],[162,2]]);
 const cues=new Map([[1,['body-slam',.9]],[38,['rocket',.85]],[52,['explosion',.88]],[70,['rocket',1]],[84,['explosion',.95]],[97,['gun-shot',.9]],[111,['gun-shot',1]],[125,['gun-shot',1.05]],[162,['explosion',1.07]],[182,['beam-shot',1.23]],[191,['beam-hit-heavy',1.2]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('ray',RayLimitProfile,()=>RayLimitVFX);

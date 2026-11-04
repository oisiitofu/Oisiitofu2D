'use strict';
const SakiLimitProfile=(()=>{
 const contactHold=14,cutInHold=24,duration=248+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'saber'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:24,launchDamage:36,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'beam',projectile:true};
 const combo=new Map([[42,2],[54,2],[88,3],[169,2],[193,3]]);
 const cues=new Map([[1,['slash-heavy',.86]],[34,['gun-shot',.88]],[46,['gun-shot',.97]],[72,['parry',1]],[88,['beam-hit-heavy',.89]],[111,['earth-hit-heavy',1.05]],[139,['thunder-cast',1.05]],[158,['beam-shot',1.18]],[169,['beam-hit-heavy',1.2]],[193,['explosion',1.21]],[223,['wind-cast',.7]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:['slash-heavy',1]};
})();
LimitBreak.define('saki',SakiLimitProfile,()=>SakiLimitVFX);

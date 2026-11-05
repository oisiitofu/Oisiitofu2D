'use strict';
const AgumonLimitProfile=(()=>{
 const contactHold=13,cutInHold=24,duration=254+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'claw'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'beam',projectile:true};
 const combo=new Map([[52,2],[69,2],[94,2],[116,3],[158,2],[180,3]]);
 const cues=new Map([[1,['claw-hit-heavy',.91]],[52,['fire-hit',.94]],[69,['fire-hit-heavy',1]],[94,['explosion',.91]],[116,['explosion',1.03]],[137,['power',1]],[158,['agumon-limit-cannon',.94]],[180,['agumon-limit-cannon',1.1]],[209,['slash-heavy',1.13]],[218,['agumon-limit-sword',1.15]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('agumon',AgumonLimitProfile,()=>AgumonLimitVFX);
for(const id of ['greymon','metalgreymon','wargreymon','omegamon']){
 const cues=new Map(AgumonLimitProfile.cues);
 if(id==='metalgreymon')for(const time of [52,69])cues.set(time,['explosion',.92]);
 if(id==='wargreymon')for(const time of [94,116])cues.set(time,['fire-hit-heavy',1]);
 if(id==='omegamon'){
  for(const time of [52,69,94,116])cues.set(time,['agumon-limit-cannon',.87]);
  cues.delete(137);
 }
 LimitBreak.define(id,{...AgumonLimitProfile,cues},()=>AgumonLimitVFX);
}

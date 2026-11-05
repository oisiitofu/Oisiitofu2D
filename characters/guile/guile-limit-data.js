'use strict';
const GuileLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=252+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'wind'};
 const combo=new Map([[44,3],[68,1],[76,1],[84,1],[92,1],[100,1],[111,1],[140,2],[157,2],[184,3]]);
 const cues=new Map([[1,['punch-heavy',.93]],[44,['punch-heavy',1.03]],
  [57,['guile-limit-sonic',.92]],[68,['wind-hit',.89]],[76,['wind-hit',.96]],[84,['wind-hit',1.02]],
  [92,['wind-hit',1.08]],[100,['wind-hit',1.14]],[111,['wind-hit',1.2]],
  [128,['guile-limit-sonic',.81]],[140,['wind-hit',.95]],[157,['wind-hit',1.08]],
  [184,['punch-heavy',1.10]],[216,['guile-limit-crossfire',1.16]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('guile',GuileLimitProfile,()=>GuileLimitVFX);

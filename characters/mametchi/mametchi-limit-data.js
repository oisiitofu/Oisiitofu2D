'use strict';
const MametchiLimitProfile=(()=>{
 const contactHold=12,cutInHold=22,duration=247+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical',projectile:true};
 const combo=new Map([[52,2],[69,2],[107,2],[128,2],[146,3],[169,3]]);
 const cues=new Map([[1,['punch-heavy',.9]],[52,['punch-light',.92]],[69,['punch-light',1]],[85,['power',.8]],[107,['mametchi-limit-spring',.94]],[128,['mametchi-limit-spring',1]],[146,['mametchi-limit-spring',1.06]],[169,['mametchi-limit-spring',1.13]],[186,['thunder-cast',1]],[201,['mametchi-limit-pop',1.13]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('mametchi',MametchiLimitProfile,()=>MametchiLimitVFX);

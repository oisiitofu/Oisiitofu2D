'use strict';
const GoemonLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=266+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light'};
 const combo=new Map([[44,2],[72,2],[88,1],[100,1],[112,1],[124,1],[136,1],[148,1],[160,2],[181,4]]);
 const cues=new Map([[1,['punch-heavy',.94]],[44,['sword-hit-heavy',1.01]],[60,['charge',.88]],
  ...[72,88,100,112,124,136,148,160].map((t,n)=>[t,['goemon-limit-servo',.90+n*.035]]),
  [181,['punch-heavy',.78]],[207,['charge',1.08]],[229,['goemon-limit-laser',1.09]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('goemon',GoemonLimitProfile,()=>GoemonLimitVFX);

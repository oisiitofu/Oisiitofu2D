'use strict';
const AlphenLimitProfile=(()=>{
 const contactHold=14,cutInHold=23,duration=255+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'fire',projectile:true};
 const combo=new Map([[53,2],[69,2],[86,2],[111,3],[146,2],[168,3]]);
 const cues=new Map([[1,['slash-heavy',.9]],[53,['sword-hit',.9]],[69,['sword-hit',.97]],[86,['sword-hit-heavy',1]],[111,['fire-hit-heavy',1.04]],[126,['fire-cast',.9]],[146,['fire-hit',1.02]],[168,['fire-hit-heavy',1.11]],[199,['slash-heavy',1.19]],[207,['fire-hit-heavy',1.21]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('alphen',AlphenLimitProfile,()=>AlphenLimitVFX);

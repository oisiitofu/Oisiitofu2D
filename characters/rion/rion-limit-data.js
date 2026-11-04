'use strict';
const RionLimitProfile=(()=>{
 const contactHold=13,cutInHold=23,duration=245+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'dark',projectile:true};
 const combo=new Map([[53,2],[66,2],[82,2],[97,2],[122,3],[159,3]]);
 const cues=new Map([[1,['slash-heavy',.9]],[53,['sword-hit',.9]],[66,['sword-hit',.96]],[82,['sword-hit',1]],[97,['sword-hit-heavy',1]],[122,['dark-hit',.99]],[140,['dark-cast',.92]],[159,['sword-hit-heavy',1.07]],[177,['dark-hit-heavy',1.15]],[187,['explosion',1.17]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('rion',RionLimitProfile,()=>RionLimitVFX);

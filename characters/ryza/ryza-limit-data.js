'use strict';
const RyzaLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=335+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'staff'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light'};
 const combo=new Map([[82,2],[108,2],[136,2],[169,2],[193,2],[219,2],[239,2],[259,2],[276,2]]);
 const cues=new Map([[1,['staff-hit-heavy',.94]],[65,['charge',.85]],[82,['ryza-limit-chain',1.04]],
  [108,['staff-hit-heavy',1.04]],[136,['staff-hit-heavy',1.04]],[169,['staff-hit-heavy',1.04]],
  [193,['ryza-limit-chain',1.04]],[219,['ryza-limit-chain',1.04]],[239,['ryza-limit-chain',1.04]],
  [259,['staff-hit-heavy',1.04]],[276,['charge',1.04]],[300,['ryza-limit-drive',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('ryza',RyzaLimitProfile,()=>RyzaLimitVFX);

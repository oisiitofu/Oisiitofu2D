'use strict';
const HinakoLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=342+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'staff'});
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'dark'};
 const combo=new Map([[52,2],[82,2],[112,2],[142,2],[178,2],[204,2],[230,2],[252,2],[274,2]]);
 const cues=new Map([[1,['staff-hit-heavy',.94]],[52,['sword-hit-heavy',1.04]],[82,['sword-hit-heavy',1.04]],[112,['sword-hit-heavy',1.04]],[142,['sword-hit-heavy',1.04]],[156,['charge',1.04]],[178,['hinako-limit-claw',1.04]],[204,['hinako-limit-claw',1.04]],[230,['hinako-limit-claw',1.04]],[252,['hinako-limit-claw',1.04]],[274,['staff-hit-heavy',1.04]],[307,['hinako-limit-bloom',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('hinako',HinakoLimitProfile,()=>HinakoLimitVFX);

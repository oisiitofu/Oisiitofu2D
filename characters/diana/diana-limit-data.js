'use strict';
const DianaLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=345+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{damage:5,reach:225,hitboxSize:1.65,pose:24,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'electric'});
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'electric'};
 const combo=new Map([[58,2],[96,2],[125,2],[148,2],[174,2],[208,2],[240,2],[260,2],[278,2]]);
 const cues=new Map([[1,['staff-hit-heavy',.94]],[58,['diana-limit-hack',1.04]],[96,['explosion',1.04]],[125,['gun-shot',1.04]],[148,['gun-shot',1.04]],[174,['gun-shot',1.04]],[208,['gun-shot',1.04]],[240,['diana-limit-hack',1.04]],[260,['explosion',1.04]],[278,['diana-limit-hack',1.04]],[297,['charge',1.04]],[314,['diana-limit-overdrive',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('diana',DianaLimitProfile,()=>DianaLimitVFX);

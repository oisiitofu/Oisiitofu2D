"use strict";
const AlainLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=365+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{damage:5,reach:225,hitboxSize:1.65,pose:16,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'shield'});
 const finalStrike={name:'アストラルブレード',type:'limitFinisher',damage:25,launchDamage:36,angle:-.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic',element:'light'};
 const combo=new Map([[45,4],[76,4],[155,4],[214,4]]);
 const cues=new Map([[1,['impact-heavy',.94]],[45,['alain-limit-cavalier',1.02]],[76,['sword-hit-heavy',1.02]],...[131,155,180,214,238,263].map(t=>[t,['alain-limit-cavalier',1.02]]),[292,['charge',1.02]],[320,['alain-limit-astral',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('alain',AlainLimitProfile,()=>AlainLimitVFX);

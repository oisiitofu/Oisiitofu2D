"use strict";
const NarukamiLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=350+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{damage:5,reach:225,hitboxSize:1.65,pose:9,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'});
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'thunder'};
 const combo=new Map([[52,2],[80,2],[112,2],[143,2],[175,2],[207,2],[238,2],[267,2],[290,2]]);
 const cues=new Map([[1,['sword-hit-heavy',.94]],...[52,80,112,143,175,207,238,267,290].map(t=>[t,['narukami-limit-thunder',1.04]]),[288,['charge',1.04]],[313,['narukami-limit-truth',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('narukami',NarukamiLimitProfile,()=>NarukamiLimitVFX);

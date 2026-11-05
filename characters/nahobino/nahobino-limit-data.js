"use strict";
const NahobinoLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=340+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{damage:5,reach:225,hitboxSize:1.65,pose:16,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'});
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:24,launchDamage:36,angle:-.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic',element:'light'};
 const combo=new Map([[52,2],[77,2],[104,2],[131,2],[161,2],[191,2],[222,2],[253,2]]);
 const cues=new Map([[1,['sword-hit-heavy',.94]],...[52,77,104,131,161,191,222,253].map(t=>[t,['nahobino-limit-tempest',1.04]]),[279,['charge',1.04]],[304,['nahobino-limit-murakumo',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('nahobino',NahobinoLimitProfile,()=>NahobinoLimitVFX);

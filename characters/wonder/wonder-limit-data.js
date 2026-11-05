"use strict";
const WonderLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=350+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'});
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'gun',element:'physical'};
 const combo=new Map([[54,2],[83,2],[116,2],[149,2],[180,2],[210,2],[239,2],[269,2],[292,2]]);
 const cues=new Map([[1,['sword-hit-heavy',.94]],...[54,83,116,149,180,210,239,269,292].map(t=>[t,[t<130?"sword-hit-heavy":'wonder-limit-volley',1.04]]),[290,['charge',1.04]],[315,['wonder-limit-highlight',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('wonder',WonderLimitProfile,()=>WonderLimitVFX);

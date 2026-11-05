'use strict';
const RyofuLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=350+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'});
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'fire'};
 const combo=new Map([[52,2],[79,2],[107,2],[134,2],[162,2],[191,2],[220,2],[247,2],[273,2]]);
 const cues=new Map([[1,['sword-hit-heavy',.94]],[35,['ryofu-limit-ranbu',.86]],...[52,79,107,134,162,191,220,247,273].map(t=>[t,['ryofu-limit-ranbu',1.04]]),[289,['charge',1.04]],[312,['ryofu-limit-earth',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('ryofu',RyofuLimitProfile,()=>RyofuLimitVFX);

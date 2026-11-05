"use strict";
const WillLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=350+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{damage:5,reach:225,hitboxSize:1.65,pose:16,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'});
 const finalStrike={name:'ロイヤルソード',type:'limitFinisher',damage:25,launchDamage:36,angle:-.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword',element:'light'};
 const combo=new Map([[52,3],[90,3],[124,3],[207,3],[249,3]]);
 const cues=new Map([[1,['sword-hit-heavy',.94]],...[52,90,124,207,249].map(t=>[t,['will-limit-royal-cut',1.02]]),[173,['charge',1.02]],[304,['will-limit-sovereign',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('will',WillLimitProfile,()=>WillLimitVFX);

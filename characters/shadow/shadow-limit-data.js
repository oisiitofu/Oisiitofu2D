"use strict";
const ShadowLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=360+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{damage:5,reach:225,hitboxSize:1.65,pose:16,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'});
 const finalStrike={name:'カオスブラスト',type:'limitFinisher',damage:25,launchDamage:36,angle:-.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic',element:'light'};
 const combo=new Map([[54,3],[88,3],[121,3],[241,3],[263,3]]);
 const cues=new Map([[1,['impact-heavy',.94]],[32,['charge',.85]],...[54,88,121,241,263].map(t=>[t,['shadow-limit-chaos-step',1.02]]),[180,['charge',1.02]],[320,['shadow-limit-eclipse',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('shadow',ShadowLimitProfile,()=>ShadowLimitVFX);

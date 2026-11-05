"use strict";
const MakotoLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=360+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{damage:5,reach:225,hitboxSize:1.65,pose:9,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'});
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light'};
 const combo=new Map([[54,2],[82,2],[116,2],[148,2],[180,2],[213,2],[241,2],[269,2],[296,2]]);
 const cues=new Map([[1,['sword-hit-heavy',.94]],...[54,82,116,148,180,213,241,269,296].map(t=>[t,['makoto-limit-cross',1.04]]),[299,['charge',1.04]],[324,['makoto-limit-messiah',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('makoto',MakotoLimitProfile,()=>MakotoLimitVFX);

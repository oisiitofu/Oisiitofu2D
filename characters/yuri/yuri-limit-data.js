'use strict';
const YuriLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=340+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{damage:5,reach:225,hitboxSize:1.65,pose:40,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'magic'});
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light'};
 const combo=new Map([[54,2],[79,2],[104,2],[133,2],[163,2],[190,2],[220,2],[247,2],[271,2]]);
 const cues=new Map([[1,['staff-hit-heavy',.94]],...[54,79,104,133,163,190,220,247,271].map(t=>[t,['yuri-limit-shutter',1.04]]),[287,['charge',1.04]],[303,['yuri-limit-fatal',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('yuri',YuriLimitProfile,()=>YuriLimitVFX);

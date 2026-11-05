'use strict';
const TwinbeeLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=269+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'gun'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light'};
 const combo=new Map([[44, 2], [60, 2], [76, 2], [92, 2], [118, 2], [134, 2], [150, 2], [166, 2], [185, 2]]);
 const cues=new Map([[1,['gun-shot',.94]],[44,['twinbee-limit-volley',1.04]],[60,['twinbee-limit-volley',1.04]],[76,['twinbee-limit-volley',1.04]],[92,['twinbee-limit-volley',1.04]],[118,['twinbee-limit-volley',1.04]],[134,['twinbee-limit-volley',1.04]],[150,['twinbee-limit-volley',1.04]],[166,['twinbee-limit-volley',1.04]],[185,['twinbee-limit-volley',1.04]],[207,['charge',1.04]],[231,['twinbee-limit-bigshot',1.04]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('twinbee',TwinbeeLimitProfile,()=>TwinbeeLimitVFX);

'use strict';
const DjangoLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=268+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'gun'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'light'};
 const combo=new Map([[45,2],[62,2],[79,2],[96,2],[143,2],[160,2],[177,2],[194,2],[211,2]]);
 const cues=new Map([[1,['gun-shot',.92]],...[45,62,79,96].map(t=>[t,['django-limit-solar',1.04]]),
  [119,['charge',.91]],...[143,160,177,194,211].map((t,n)=>[t,['staff-hit-heavy',1.03+n*.045]]),
  [224,['charge',1.12]],[232,['django-limit-purify',1.10]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('django',DjangoLimitProfile,()=>DjangoLimitVFX);

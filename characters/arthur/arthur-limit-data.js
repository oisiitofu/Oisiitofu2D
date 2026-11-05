'use strict';
const ArthurLimitProfile=(()=>{
 const contactHold=13,cutInHold=23,duration=251+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'spear'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'thunder',projectile:true};
 const combo=new Map([[44,2],[62,2],[79,2],[114,2],[137,2],[159,2],[178,2]]);
 const cues=new Map([[1,['spear-hit-heavy',.92]],[44,['spear-hit',.89]],[62,['slash-light',.92]],[79,['slash-light',1]],
  [98,['arthur-limit-gold',.97]],[114,['spear-hit-heavy',.96]],[137,['spear-hit-heavy',1.03]],
  [159,['spear-hit-heavy',1.08]],[178,['thunder-hit',.99]],[192,['thunder-cast',1.03]],[216,['arthur-limit-thunder',1.18]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('arthur',ArthurLimitProfile,()=>ArthurLimitVFX);

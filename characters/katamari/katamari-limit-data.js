'use strict';
const KatamariLimitProfile=(()=>{
 const contactHold=12,cutInHold=23,duration=250+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical',projectile:true};
 const combo=new Map([[44,1],[55,1],[69,2],[88,2],[108,2],[135,2],[159,2],[177,2]]);
 const cues=new Map([[1,['punch-heavy',.91]],[44,['katamari-limit-clack',.82]],[55,['katamari-limit-clack',.87]],
  [69,['katamari-limit-clack',.92]],[88,['katamari-limit-clack',.99]],[108,['katamari-limit-clack',1.03]],
  [135,['katamari-limit-clack',1.08]],[159,['katamari-limit-clack',1.11]],[177,['katamari-limit-clack',1.16]],
  [191,['power',.87]],[215,['katamari-limit-star',1.13]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('katamari',KatamariLimitProfile,()=>KatamariLimitVFX);

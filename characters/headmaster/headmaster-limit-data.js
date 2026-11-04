'use strict';
const HeadmasterLimitProfile=(()=>{
 const contactHold=12,cutInHold=24,duration=232+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'staff'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:36,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'earth',projectile:true};
 const cues=new Map([[1,['shield-hit',.8]],[38,['light-cast',.76]],[49,['light-cast',.84]],[60,['light-cast',.92]],[71,['light-cast',1]],[82,['light-cast',1.08]],[108,['wind-cast',.9]],[144,['punch-heavy',1]],[153,['explosion',1.12]],[187,['light-cast',.82]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,cues,contactCue:['shield-hit',1]};
})();
LimitBreak.define('headmaster',HeadmasterLimitProfile,()=>HeadmasterLimitVFX);

'use strict';
const DonchanLimitProfile=(()=>{
 const contactHold=12,cutInHold=21,duration=245+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'staff'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'physical',projectile:true};
 const combo=new Map([[51,2],[65,2],[79,2],[96,2],[128,1],[137,1],[146,1],[155,1],[167,2]]);
 const cues=new Map([[1,['donchan-limit-don',.9]],[51,['donchan-limit-don',.95]],[65,['donchan-limit-ka',.89]],[79,['donchan-limit-don',1]],[96,['donchan-limit-ka',1]],[128,['donchan-limit-don',.8]],[137,['donchan-limit-ka',.84]],[146,['donchan-limit-don',.88]],[155,['donchan-limit-ka',.94]],[167,['donchan-limit-don',1.08]],[192,['donchan-limit-finale',1.15]],[202,['explosion',.78]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('donchan',DonchanLimitProfile,()=>DonchanLimitVFX);

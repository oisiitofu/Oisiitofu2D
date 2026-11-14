"use strict";

const TerrarianLimitProfile=(()=>{
 const contactHold=15,cutInHold=23,duration=447;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:219,hitboxSize:1.6,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const combo=new Map([[51,2],[86,3],[129,3],[170,3],[212,3],[254,4],[289,4]]);
 const cues=new Map([[1,['impact-heavy',.9]],[51,['terrarian-limit-dig',.9]],[86,['terrarian-limit-dig',1]],
  [129,['terrarian-limit-star',1]],[170,['terrarian-limit-sword',.87]],[212,['terrarian-limit-star',.9]],
  [254,['terrarian-limit-sword',1]],[289,['terrarian-limit-sword',.92]],[344,['terrarian-limit-zenith',1]]]);
 const finalStrike={name:'ゼニス',type:'limitFinisher',damage:27,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('terrarian',TerrarianLimitProfile,()=>TerrarianLimitVFX);

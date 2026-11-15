'use strict';

const VincentLimitProfile=(()=>{
 const contactHold=13,duration=274;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const impacts=[[46, 3, "bullet-hit"], [63, 3, "bullet-hit"], [82, 4, "bullet-hit-heavy"], [102, 4, "wing-swing"], [123, 4, "sword-hit"], [143, 4, "sword-hit-heavy"]];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,[impacts[0][2],1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [92,['light-cast',1]],[205,['vincent-limit-chaos',1]],[232,['light-cast',.62]]]);
 const finalStrike={name:'カオス・デスペナルティ',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('vincent',VincentLimitProfile,()=>VincentLimitVFX);

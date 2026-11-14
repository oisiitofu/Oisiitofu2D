'use strict';

const RikiLimitProfile=(()=>{
 const contactHold=13,duration=267;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:9,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'staff'
 });
 const impacts=[[47, 3, "punch-heavy"], [64, 3, "fire-hit"], [82, 4, "ice-hit"], [102, 4, "staff-hit"], [122, 4, "wind-hit"], [142, 4, "staff-hit-heavy"]];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,[impacts[0][2],1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [198,['riki-limit-heropon',1]]]);
 const finalStrike={name:'勇者の連携',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'staff'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('riki',RikiLimitProfile,()=>RikiLimitVFX);

'use strict';

const GenisLimitProfile=(()=>{
 const contactHold=13,duration=280;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:19,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'staff'
 });
 const impacts=[
  [45,3,'staff-hit'],[62,3,'fire-hit'],[80,4,'ice-hit'],
  [100,4,'dark-hit'],[120,4,'thunder-hit'],[140,4,'thunder-hit-heavy']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['staff-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [182,['light-cast',.65]],[208,['genis-limit-indignation-judgment',1]]]);
 const finalStrike={name:'インディグネイト・ジャッジメント',type:'limitFinisher',damage:26,launchDamage:37,angle:-.56,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('genis',GenisLimitProfile,()=>GenisLimitVFX);

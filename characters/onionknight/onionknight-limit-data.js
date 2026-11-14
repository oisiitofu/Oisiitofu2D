'use strict';

const OnionKnightLimitProfile=(()=>{
 const contactHold=13,duration=266;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:16,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const impacts=[[44, 3, "sword-hit"], [60, 3, "sword-hit"], [77, 3, "sword-hit"], [96, 4, "sword-hit-heavy"], [115, 4, "ice-hit"], [135, 4, "thunder-hit"], [155, 4, "fire-hit"]];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,[impacts[0][2],1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [27,['light-cast',.78]],[70,['light-cast',.88]],[106,['light-cast',1]],[196,['onionknight-limit-magic',1]]]);
 const finalStrike={name:'にんじゅつ・だいまほう',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,reverseLaunch:true,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('onionknight',OnionKnightLimitProfile,()=>OnionKnightLimitVFX);

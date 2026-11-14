'use strict';

const EstarkLimitProfile=(()=>{
 const contactHold=13,duration=278;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:16,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const impacts=[[47, 3, "sword-hit"], [67, 3, "sword-hit-heavy"], [87, 4, "sword-hit"], [108, 4, "ice-hit"], [128, 4, "sword-hit-heavy"], [149, 4, "impact-heavy"]];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,[impacts[0][2],1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [208,['estark-limit-dangokuzan',1]]]);
 const finalStrike={name:'天上天下断獄斬',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('estark',EstarkLimitProfile,()=>EstarkLimitVFX);

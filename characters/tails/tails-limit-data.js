'use strict';

const TailsLimitProfile=(()=>{
 const contactHold=13,duration=253;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:16,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'thunder'
 });
 const impacts=[[48, 3, 'explosion'], [65, 3, 'punch-light'], [83, 4, 'thunder-hit'], [102, 3, 'punch-heavy'], [121, 4, 'thunder-hit'], [141, 4, 'thunder-hit']];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,[impacts[0][2],1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [187,['tails-limit-crossbolt',1]]]);
 const finalStrike={name:'ツインテール・クロスボルト',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'thunder'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('tails',TailsLimitProfile,()=>TailsLimitVFX);

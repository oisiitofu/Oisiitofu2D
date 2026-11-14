'use strict';

const HachiwareLimitProfile=(()=>{
 const contactHold=13,duration=258;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:16,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'staff'
 });
 const impacts=[[48, 3, 'staff-hit'], [65, 3, 'staff-hit'], [83, 4, 'staff-hit-heavy'], [103, 4, 'staff-hit-heavy'], [121, 3, 'light-hit'], [142, 4, 'staff-hit-heavy']];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,[impacts[0][2],1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [192,['hachiware-limit-charge',1]]]);
 const finalStrike={name:'なんとかなれッ!!',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'staff'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('hachiware',HachiwareLimitProfile,()=>HachiwareLimitVFX);

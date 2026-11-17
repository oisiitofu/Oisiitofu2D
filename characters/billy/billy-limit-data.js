'use strict';

const BillyLimitProfile=(()=>{
 const contactHold=13,duration=282;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:23,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'gun'
 });
 const impacts=[
  [46,3,"bullet-hit"],[63,3,"bullet-hit"],[81,4,"punch-heavy"],
  [100,4,"bullet-hit"],[118,4,"bullet-hit"],[138,4,"bullet-hit-heavy"]
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['bullet-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  ...impacts.filter(([,,sound])=>sound.startsWith('bullet')).map(([time])=>[time-2,['gun-shot',.74]]),
  [178,["billy-limit-showtime",0.75]],[211,["billy-limit-starlight",1]]]);
 const finalStrike={name:'スターライト、ここに輝く！',type:'limitFinisher',damage:26,launchDamage:37,angle:-0.61,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'gun'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('billy',BillyLimitProfile,()=>BillyLimitVFX);

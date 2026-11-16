'use strict';

const AshLimitProfile=(()=>{
 const contactHold=13,duration=281;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:41,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const impacts=[
  [45,3,'sword-hit'],[63,3,'sword-hit-heavy'],[81,4,'light-hit'],
  [100,4,'sword-hit'],[119,4,'sword-hit-heavy'],[139,4,'light-hit-heavy']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['sword-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [185,['light-cast',.73]],[211,['ash-limit-rending-saber',1]]]);
 const finalStrike={name:'絞牙鳴衝斬',type:'limitFinisher',damage:26,launchDamage:37,angle:-.58,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('ash',AshLimitProfile,()=>AshLimitVFX);

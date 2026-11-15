'use strict';

const DietrichLimitProfile=(()=>{
 const contactHold=13,duration=279;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const impacts=[
  [45,3,'sword-hit'],[63,3,'sword-hit-heavy'],[82,4,'dark-hit'],
  [102,4,'sword-hit'],[122,4,'dark-hit'],[142,4,'sword-hit-heavy']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['sword-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [201,['dark-hit',.54]],[205,['dark-hit',.68]],[208,['dietrich-limit-black-flame',1]]]);
 const finalStrike={name:'黒翼・黒炎の牢獄',type:'limitFinisher',damage:26,launchDamage:37,angle:-.58,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('dietrich',DietrichLimitProfile,()=>DietrichLimitVFX);

'use strict';

const PreseaLimitProfile=(()=>{
 const contactHold=13,duration=285;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:19,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'hammer'
 });
 const impacts=[
  [46,3,'hammer-hit'],[64,3,'sword-hit-heavy'],[83,4,'earth-hit'],
  [103,4,'sword-hit'],[123,4,'hammer-hit'],[143,4,'earth-hit-heavy']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['hammer-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [174,['earth-hit',.72]],[214,['presea-limit-crimson-devastation',1]]]);
 const finalStrike={name:'緋焔滅焦陣',type:'limitFinisher',damage:26,launchDamage:37,angle:-.68,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'hammer'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('presea',PreseaLimitProfile,()=>PreseaLimitVFX);

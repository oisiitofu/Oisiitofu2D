'use strict';

const NaegiLimitProfile=(()=>{
 const contactHold=13,duration=277;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:9,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'staff'
 });
 const impacts=[
  [46,3,'staff-hit'],[63,3,'light-hit'],[81,4,'staff-hit'],
  [100,4,'light-hit'],[119,4,'staff-hit'],[139,4,'light-hit']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['staff-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [166,['naegi-limit-evidence',.88]],[207,['naegi-limit-rebuttal',1]]]);
 const finalStrike={name:'それは違うよ！',type:'limitFinisher',damage:26,launchDamage:37,angle:-.49,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'light'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('naegi',NaegiLimitProfile,()=>NaegiLimitVFX);

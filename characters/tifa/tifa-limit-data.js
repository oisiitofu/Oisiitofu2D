'use strict';

const TifaLimitProfile=(()=>{
 const contactHold=13,cutInHold=20,duration=263;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',8,[CombatData.window(8,22)],29,21,{
  damage:5,reach:215,hitboxSize:1.6,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,22]],soundFamily:'punch'
 });
 const impacts=[
  [50,3,'punch-light'],[66,3,'punch-light'],[83,3,'punch-heavy'],
  [101,4,'punch-heavy'],[121,4,'punch-heavy'],[141,5,'punch-heavy']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['punch-heavy',1]],[166,['fire-cast',.85]],
  ...impacts.map(([time,,sound])=>[time,[sound,1]]),[194,['tifa-limit-heaven',1]]]);
 const finalStrike={name:'ファイナルヘヴン',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'punch'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('tifa',TifaLimitProfile,()=>TifaLimitVFX);

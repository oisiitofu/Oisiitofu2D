'use strict';

const ViviLimitProfile=(()=>{
 const contactHold=13,cutInHold=20,duration=276;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'magic'
 });
 const impacts=[
  [54,3,'fire-hit'],[71,3,'ice-hit'],[90,4,'thunder-hit'],
  [110,4,'fire-hit'],[129,4,'ice-hit'],[149,5,'thunder-hit']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['staff-hit',1]],[170,['thunder-cast',.8]],
  ...impacts.map(([time,,sound])=>[time,[sound,1]]),[207,['vivi-limit-doomsday',1]]]);
 const finalStrike={name:'ジハード',type:'limitFinisher',damage:27,launchDamage:37,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic',element:'dark',projectile:true};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('vivi',ViviLimitProfile,()=>ViviLimitVFX);

'use strict';

const FelyneLimitProfile=(()=>{
 const contactHold=13,duration=282;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:19,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'claw'
 });
 const impacts=[
  [45,3,'claw-hit'],[62,3,'sword-hit'],[81,4,'claw-hit'],
  [100,4,'thunder-hit'],[120,4,'sword-hit'],[140,4,'hammer-hit']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['claw-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [174,['earth-hit',.62]],[211,['felyne-limit-mega-barrel',1]]]);
 const finalStrike={name:'特大タル爆弾の技',type:'limitFinisher',damage:26,launchDamage:37,angle:-.59,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'claw'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('felyne',FelyneLimitProfile,()=>FelyneLimitVFX);

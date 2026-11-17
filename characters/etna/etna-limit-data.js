'use strict';

const EtnaLimitProfile=(()=>{
 const contactHold=13,duration=287;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:19,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'spear'
 });
 const impacts=[
  [45,3,'sword-hit'],[62,3,'punch-heavy'],[80,4,'sword-hit-heavy'],
  [99,4,'explosion'],[118,4,'sword-hit-heavy'],[138,4,'explosion']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['sword-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [211,['etna-limit-chaos-impact',1]],[220,['etna-limit-prinny-chain',.91]]]);
 const finalStrike={name:'カオスインパクト',type:'limitFinisher',damage:26,launchDamage:37,angle:-.61,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('etna',EtnaLimitProfile,()=>EtnaLimitVFX);

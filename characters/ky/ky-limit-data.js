'use strict';

const KyLimitProfile=(()=>{
 const contactHold=13,duration=281;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:12,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const impacts=[
  [47,3,'thunder-hit'],[63,3,'sword-hit'],[82,4,'punch-heavy'],
  [101,4,'sword-hit-heavy'],[120,4,'thunder-hit'],[140,4,'sword-hit-heavy']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['sword-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [158,['ky-limit-install',1]],[210,['ky-limit-lightning',1]]]);
 const finalStrike={name:'ライド・ザ・ライトニング',type:'limitFinisher',damage:26,launchDamage:37,angle:-.77,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'thunder'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('ky',KyLimitProfile,()=>KyLimitVFX);

'use strict';

const ColetteLimitProfile=(()=>{
 const contactHold=13,duration=275;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:9,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const impacts=[
  [46,3,'sword-hit'],[64,3,'light-hit'],[82,4,'sword-hit'],
  [101,4,'wind-hit'],[120,4,'sword-hit-heavy'],[140,4,'light-hit-heavy']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['sword-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [198,['light-cast',.60]],[204,['colette-limit-holy-judgment',1]],[210,['light-hit',.72]]]);
 const finalStrike={name:'ホーリージャッジメント',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('colette',ColetteLimitProfile,()=>ColetteLimitVFX);

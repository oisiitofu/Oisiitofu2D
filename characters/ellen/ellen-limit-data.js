'use strict';

const EllenLimitProfile=(()=>{
 const contactHold=13,duration=284;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:23,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const impacts=[
  [45,3,"sword-hit"],[62,3,"ice-hit"],[81,4,"sword-hit"],
  [100,4,"punch-heavy"],[120,4,"ice-hit"],[140,4,"sword-hit-heavy"]
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['sword-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [184,["ellen-limit-freeze",0.82]],[212,["ellen-limit-winter",1]]]);
 const finalStrike={name:'終わりなき冬の狂宴',type:'limitFinisher',damage:26,launchDamage:37,angle:-0.64,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword',element:'ice'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('ellen',EllenLimitProfile,()=>EllenLimitVFX);

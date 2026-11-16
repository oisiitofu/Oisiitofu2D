'use strict';

const ShionneLimitProfile=(()=>{
 const contactHold=13,duration=284;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:19,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'magic'
 });
 const impacts=[
  [44,3,'staff-hit'],[61,3,'beam-hit'],[79,4,'beam-hit'],
  [98,4,'fire-hit'],[118,4,'beam-hit'],[138,4,'explosion']
 ];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,['staff-hit',1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [54,['gun-shot',.67]],[72,['gun-shot',.72]],[111,['gun-shot',.7]],
  [184,['fire-cast',.74]],[203,['beam-shot',.84]],[214,['shionne-limit-ferox-sol',1]]]);
 const finalStrike={name:'フェロックスソル',type:'limitFinisher',damage:26,launchDamage:37,angle:-.64,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('shionne',ShionneLimitProfile,()=>ShionneLimitVFX);

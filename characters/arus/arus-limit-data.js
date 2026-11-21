'use strict';

const ArusLimitProfile=(()=>{
 const contactHold=13,duration=260;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(20,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],29,21,{
  damage:5,reach:225,hitboxSize:1.6,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'sword'
 });
 const impacts=[[45, 3, "shield-hit"], [63, 3, "sword-hit"], [82, 4, "sword-hit-heavy"], [102, 4, "sword-hit"], [121, 4, "thunder-hit"], [141, 4, "sword-hit-heavy"]];
 const combo=new Map(impacts.map(([time,damage])=>[time,damage]));
 const cues=new Map([[1,[impacts[0][2],1]],...impacts.map(([time,,sound])=>[time,[sound,1]]),
  [176,['thunder-cast',.76]],[193,['arus-limit-gigaslash',1]]]);
 const finalStrike={name:'ギガスラッシュ',type:'limitFinisher',damage:26,launchDamage:37,angle:-.53,reverseLaunch:true,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'sword'};
 return {contactHold,shotTime,duration,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('arus',ArusLimitProfile,()=>ArusLimitVFX);

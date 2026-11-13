"use strict";

const JibanyanLimitProfile=(()=>{
 const contactHold=15,cutInHold=23;
 const duration=378+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const combo=new Map([[48,3], [91,2], [105,2], [119,2], [133,2], [147,2], [226,4], [270,4]]);
 const cues=new Map([[1,["impact-heavy",0.9]], [48,["jibanyan-limit-paws",1]], [91,["jibanyan-limit-flurry",1]], [105,["jibanyan-limit-flurry",1]], [119,["jibanyan-limit-flurry",1]], [133,["jibanyan-limit-flurry",1]], [147,["jibanyan-limit-flurry",1]], [226,["jibanyan-limit-wall",1]], [270,["jibanyan-limit-paws",1]], [324,["jibanyan-limit-finish",1]]]);
 const finalStrike={name:'ひゃくれつ肉球',type:'limitFinisher',damage:26,launchDamage:36,angle:-0.62,reverseLaunch:true,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('jibanyan',JibanyanLimitProfile,()=>JibanyanLimitVFX);

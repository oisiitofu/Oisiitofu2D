'use strict';
const BombermanLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=261+contactHold+cutInHold;
 const shotTime=time=>{
  const t=time-contactHold;
  return t-Math.min(cutInHold,Math.max(0,t-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:6,aerial:true,canClank:false,
  intangibleFrames:[[1,23]],soundFamily:'punch'
 });
 const finalStrike={name:'リミットブレイク',type:'limitFinisher',damage:22,launchDamage:36,angle:-.54,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,element:'fire'};
 const combo=new Map([[48,2],[71,2],[96,2],[111,1],[126,1],[141,1],[156,1],[171,2],[188,3]]);
 const cues=new Map([[1,['punch-heavy',.94]],[48,['punch-heavy',1.06]],[71,['explosion',.95]],
  [96,['bomberman-limit-chain',.91]],[111,['explosion',.93]],[126,['explosion',1.00]],
  [141,['bomberman-limit-chain',1.04]],[156,['explosion',1.10]],[171,['explosion',1.18]],
  [188,['bomberman-limit-chain',.79]],[208,['charge',1.11]],[224,['bomberman-limit-mega',1.12]]]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('bomberman',BombermanLimitProfile,()=>BombermanLimitVFX);

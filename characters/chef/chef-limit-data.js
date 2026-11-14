'use strict';

const ChefLimitProfile=(()=>{
 const contactHold=12,cutInHold=21,duration=292;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:220,hitboxSize:1.6,pose:6,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'staff'
 });
 const combo=new Map([[48,2], [66,3], [84,3], [102,3], [120,3], [138,4], [157,4]]);
 const cues=new Map([[1,['impact-heavy',.9]], [48,['chef-limit-pan',1]], [66,['chef-limit-throw',1]], [84,['chef-limit-pan',1]], [102,['chef-limit-steam',1]], [120,['chef-limit-pan',1]], [138,['chef-limit-throw',1]], [157,['chef-limit-steam',1]], [198,['chef-limit-serve',1]]]);
 const finalStrike={name:'できたて！フルコース',type:'limitFinisher',damage:26,launchDamage:37,angle:-.57,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'heavy'};
 return {contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('chef',ChefLimitProfile,()=>ChefLimitVFX);

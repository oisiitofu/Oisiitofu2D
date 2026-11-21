'use strict';
const LidLimitProfile=(()=>{
 const contactHold=13,duration=287,shotTime=time=>time-contactHold;
 const opener=CombatData.createMove('エンタープライズ',9,[CombatData.window(9,23,'front',{pose:23,meleeCoverage:true})],30,20,{damage:5,reach:205,pose:23,newcomerHit:true,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'});
 const impacts=[[47,3],[65,3],[84,4],[104,4],[124,4],[144,4]];
 const combo=new Map(impacts),cues=new Map([[1,['punch-heavy',1]],[32,['jump',.75]],[80,['lid-limit-command',.9]],...impacts.map(([t])=>[t,['lid-limit-shell',.8]]),[172,['lid-limit-command',.9]],[215,['lid-limit-enterprise',1]]]);
 const finalStrike={name:'エンタープライズ',type:'limitFinisher',damage:28,launchDamage:39,angle:-.63,baseKnockback:4.4,knockbackGrowth:.075,launchPercentOffset:14,soundFamily:'explosion',projectile:true};
 return{contactHold,duration,shotTime,opener,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('lid',LidLimitProfile,()=>LidLimitVFX);

"use strict";
const KurabeLimitProfile=(()=>{
 const contactHold=15,cutInHold=22,duration=365+contactHold+cutInHold;
 const shotTime=time=>{const t=time-contactHold;return t-Math.min(cutInHold,Math.max(0,t-15));};
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{damage:5,reach:225,hitboxSize:1.65,pose:16,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'punch'});
 const finalStrike={name:'高出力プラズマアーク溶断機',type:'limitFinisher',damage:24,launchDamage:36,angle:-.54,baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic',element:'electric'};
 const combo=new Map([[105,2],[117,2],[129,2],[180,3],[199,3],[258,3],[281,3]]);
 const cues=new Map([[1,['impact-heavy',.94]],[76,['impact-heavy',1]],...[105,117,129,180,199].map(t=>[t,['kurabe-limit-battery',1.02]]),[235,['charge',1.02]],...[258,281,320].map(t=>[t,['kurabe-limit-plasma',1.04]])]);
 return {contactHold,duration,shotTime,opener,finalStrike,combo,cues,contactCue:cues.get(1)};
})();
LimitBreak.define('kurabe',KurabeLimitProfile,()=>KurabeLimitVFX);

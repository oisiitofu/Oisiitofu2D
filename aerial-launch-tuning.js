'use strict';
// Give aerials distinct launch roles without changing their authored damage,
// active windows, linking hits, meteor strikes or animation timing.
const AerialLaunchTuning=(()=>{
 const types=new Set(['fair','bair','dair','dashAttack']);
 const profiles={
  brawler:{fairBase:4.05,fairGrowth:.075,bairBase:4.7,bairGrowth:.095},
  blade:{fairBase:3.9,fairGrowth:.074,bairBase:4.5,bairGrowth:.092},
  polearm:{fairBase:3.8,fairGrowth:.072,bairBase:4.3,bairGrowth:.089},
  magic:{fairBase:3.7,fairGrowth:.073,bairBase:4.1,bairGrowth:.087}
 };
 const typeOf=a=>a.sourceType||a.type||a.launchRoleType;
 const linking=a=>a.damageOnly||a.pull||a.fixedKnockback||a.rehitRate||a.rehitFrames||!a.projectile&&a.cancel?.next||Number.isFinite(a.end)&&a.end<a.activeEnd;
 const meteor=a=>a.isMeteor||a.angle>0&&Math.sin(a.angle)>.45;
 const eligible=a=>a&&types.has(typeOf(a))&&(!a.special||!!a.sourceType)&&!linking(a);
 function knockback(a){
  if(!eligible(a))return a;
  const type=typeOf(a),p=profiles[a.launchRoleFamily]||profiles.blade;
  if(type==='dair'&&!meteor(a))return{...a,baseKnockback:(a.baseKnockback??3.2)*.85,knockbackGrowth:(a.knockbackGrowth??.065)*.8};
  if(type!=='fair'&&type!=='bair')return a;
  const scale=type==='bair'?.9:1;
  return{...a,baseKnockback:Math.max(a.baseKnockback??3.2,p[type+'Base'])*scale,knockbackGrowth:Math.max(a.knockbackGrowth??.065,p[type+'Growth'])*scale};
 }
 function trajectory(a,original){
  if(!eligible(a)||meteor(a)||!Number.isFinite(a.angle))return null;
  const type=typeOf(a);
  const minimum=(type==='dair'?72:type==='dashAttack'?50:37)*Math.PI/180,h=original.horizontalScale;
  const actual=Math.atan2(-Math.sin(a.angle),Math.abs(Math.cos(a.angle)*h));
  if(actual>=minimum)return original;
  let angle=Math.atan2(-Math.sin(minimum)*h,Math.cos(minimum));if(Math.cos(a.angle)<0)angle=-Math.PI-angle;
  const velocityScale=Math.hypot(Math.cos(a.angle)*h,Math.sin(a.angle))/Math.hypot(Math.cos(angle)*h,Math.sin(angle));
  return{angle,horizontalScale:h,velocityScale};
 }
 function strike(f,a){return types.has(typeOf(a))?{...a,launchRoleFamily:UpAttackTuning.family(f)}:a;}
 for(const id of Object.keys(CharacterData))for(const type of types){const a=movesFor({characterId:id})[type];if(a)Object.assign(a,{launchRoleType:type,launchRoleFamily:UpAttackTuning.family({characterId:id})});}
 return{types,profiles,typeOf,linking,meteor,eligible,knockback,trajectory,strike};
})();

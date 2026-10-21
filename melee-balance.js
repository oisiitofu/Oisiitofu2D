'use strict';
// World-space melee calibration, after body/form scaling. Authored weapon
// lines keep their identity; a small surrounding margin also covers smashes
// and direct special strikes. Remote projectiles and grabs stay separate.
const MeleeBalance=(()=>{
 const types=new Set(['jab','jab2','jab3','heavy','up','low','dashAttack','air','fair','bair','uair','dair']);
 const brawlers=new Set(['zoe','chiikawa','monokuma','riki','okami','pokoa','agumon','pawapuro','headmaster','horse','chef','akira','morphie','fei','human','kitten','metabee','jibanyan','tifa','kiryu','crash','mametchi','piposaru','twinbee','maruku','guile','sukapon','shadow','doshin','moogle','greymon','metalgreymon','wargreymon','donchan','hanajs','hanajk']);
 const polearms=new Set(['dragoon','ulgrim','estelle','ryza','haseo','ryofu','tressa','deemo','krystal','aerith','melia']);
 function applies(a){return !!a&&types.has(a.type)&&!a.special&&!a.projectile;}
 function profile(f){if(f.characterId==='cojicoji')return 'brawler';if(f.characterId==='hinako')return hinakoBeast(f)?'brawler':'polearm';return polearms.has(f.characterId)?'polearm':brawlers.has(f.characterId)?'brawler':'blade';}
 function flipPose(f,n){return n===7&&f.attack?.type==='jab2'&&['odio','midna'].includes(f.characterId);}
 function boxes(f,a,raw){
  if(!applies(a))return raw;
  const scale=MorphieRules.scale(f),body=f.character.ecb.radius/scale,
   height=BattleSize.heights[f.characterId]||f.character.ecb.height/scale,
   family=profile(f),bonus=family==='polearm'?24:family==='blade'?12:0;
  return raw.flatMap(b=>{
   if(flipPose(f,b.window?.pose??a.pose))b={...b,x1:2*f.x-b.x1,x2:2*f.x-b.x2};
   if(/^jab/.test(a.type)&&b.window.shape==='back')b={...b,window:{...b.window,shape:'front'}};
   const w=b.window,shape=w.shape,radius=Math.max(b.radius,Math.min(b.radius+7*scale,(a.aerial?19:16)*scale));
   // Blade/punch trails stay on their native hand/weapon segment. Inner
   // coverage is separate and shares the same hit ID; it is not another hit.
   const inner=(x1,y1,x2,y2)=>({...b,x1,y1,x2,y2,radius,meleeInner:true});
   if(shape==='shockwave')return{...b,radius};
   const rootY=f.y-Math.min(34,height*.42)*scale,half=Math.min(18,body*.7)*scale;
   if(shape==='spin'){
    const dx=b.x2-b.x1,dy=b.y2-b.y1,
     t=clamp(((f.x-b.x1)*dx+(rootY-b.y1)*dy)/Math.max(1,dx*dx+dy*dy),0,1),
     x=b.x1+dx*t,y=b.y1+dy*t;
    const innerHalf=(body+12)*scale;
    return[{...b,radius},inner(f.x-innerHalf,rootY,f.x+innerHalf,rootY),inner(f.x,rootY,x,y)];
   }
   let x1=b.x1,y1=b.y1,x2=b.x2,y2=b.y2;
   const horizontal=!['up','down','plunge'].includes(shape),back=shape==='back',sign=f.face*(back?-1:1);
   if(horizontal){
    // Use the outer endpoint in the intended attack direction, even when the
    // isolated pose leans behind its physics origin. Connect the hand/body to
    // the cutting edge so standing inside a weapon does not become immunity.
    if((x1-x2)*sign>0){[x1,x2]=[x2,x1];[y1,y2]=[y2,y1];}
    const low=shape==='low'||a.type==='low',weak=/^jab/.test(a.type),
     floor=(weak?46:low?56:a.type==='dashAttack'?64:68)+bonus+(body-14)*.5;
    x2=f.x+sign*Math.max((x2-f.x)*sign,(floor-radius/scale)*scale);
   }else{
    // Up/down normals keep vertical coverage and their original slant. Their
    // base reaches the shoulder/waist, rather than starting beyond the head.
    const up=shape==='up',dir=up?-1:1;
    if((y1-y2)*dir>0){[x1,x2]=[x2,x1];[y1,y2]=[y2,y1];}
    const floor=up?height*.76+25:36;
    y2=f.y+dir*Math.max((y2-f.y)*dir,(floor-radius/scale)*scale);
   }
   const primary={...b,x1,y1,x2,y2,radius},jab=/^jab/.test(a.type);
   if(horizontal||jab){
    const y=shape==='low'?f.y-18*scale:rootY,
     root=f.x+sign*half,edge=f.x+sign*(body+12)*scale;
    return[primary,inner(root,y,x1,y1),inner(root,y,edge,y)];
   }
   // Vertical aerials retain their direction: no forward lobe is added.
   return[primary,inner(f.x,shape==='up'?f.y-Math.min(46,height*.45)*scale:f.y-28*scale,x1,y1)];
  });
 }
 const margins={brawler:7,blade:9,polearm:11,magic:8};
 function coverageApplies(a,b){
  const w=b?.window;
  return !!a&&a.type!=='grab'&&a.type!=='pummel'&&!a.type?.endsWith('Throw')&&
   (!a.projectile||w?.meleeCoverage===true)&&!a.targetedMeteor&&!w?.helper&&
   !w?.projectile&&!b?.modifiers?.projectile;
 }
 function coverage(f,a,raw){
  if(!raw.length)return raw;
  const scale=MorphieRules.scale(f)*BattleSize.geometry(f),family=UpAttackTuning.family(f),padding=margins[family]*scale;
  const connected=raw.some(b=>b.meleeInner),height=BattleSize.heights[f.characterId]||f.character.ecb.height/MorphieRules.scale(f);
  const rootY=f.y-Math.min(34,height*.42)*scale,body=f.character.ecb.radius/MorphieRules.scale(f);
  return raw.flatMap(b=>{
   if(!coverageApplies(a,b)||b.coveragePadding!==undefined)return[b];
   const outer={...b,radius:b.radius+padding,coveragePadding:padding};
   // Existing normal/up-normal inner coverage shares this same strike. New
   // bridges are only for a nearby direct strike, never a remote field/helper.
   if(connected||b.window?.shape==='shockwave')return[outer];
   const dx=b.x2-b.x1,dy=b.y2-b.y1,t=clamp(((f.x-b.x1)*dx+(rootY-b.y1)*dy)/Math.max(1,dx*dx+dy*dy),0,1),x=b.x1+dx*t,y=b.y1+dy*t;
   if(!b.nativeWorld&&Math.hypot(x-f.x,y-rootY)>Math.min(110,Math.max(70,height*.85))*scale)return[outer];
   const sign=Math.sign(x-f.x)||f.face,rootX=f.x+sign*Math.min(18,body*.7)*scale;
   return[outer,{...outer,x1:rootX,y1:rootY,x2:x,y2:y,radius:Math.min(outer.radius,18*scale),meleeInner:true,coverageBridge:true}];
  });
 }
 return{types,applies,profile,flipPose,boxes,margins,coverageApplies,coverage};
})();

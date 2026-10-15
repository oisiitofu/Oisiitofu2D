'use strict';
// World-space melee calibration, after body/form scaling. Keep projectile,
// special, smash and grab rules authored by their individual characters.
const MeleeBalance=(()=>{
 const types=new Set(['jab','jab2','jab3','heavy','up','low','dashAttack','air','fair','bair','uair','dair']);
 const brawlers=new Set(['chiikawa','monokuma','riki','okami','pokoa','agumon','pawapuro','headmaster','horse','chef','akira','morphie','fei','human','kitten','metabee','jibanyan','tifa','kiryu','crash','mametchi','piposaru','twinbee','maruku','guile','sukapon','shadow','doshin','moogle','greymon','metalgreymon','wargreymon','donchan','hanajs','hanajk']);
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
 return{types,applies,profile,flipPose,boxes};
})();

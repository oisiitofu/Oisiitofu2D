'use strict';
// Native grip/tip tables predate pose/display calibration. Correct them only
// while querying melee boxes; projectile spawns, hurt bodies and other authored
// world coordinates are deliberately outside this adapter.
const NativeStrikes=(()=>{
 let query=null;
 function scale(f,n,authored,includesArt=false){if(!query||query.f!==f)return authored;query.used=true;query.pose=n;return BattleSize.native(f.characterId,n)*(includesArt?1:BattleSize.art(f.characterId));}
 function native(f,n,authored,includesArt=false){return scale(f,n,authored,includesArt);}
 function boxes(f,a,t,read){if(!a||a.type==='grab'||a.type==='pummel'||a.type?.endsWith('Throw')||a.projectile&&!CombatData.activeWindow(a,t)?.meleeCoverage)return read();const previous=query,c={f,used:false,pose:null};query=c;let boxes;try{boxes=read();}finally{query=previous;}if(!c.used)return boxes;const y=BattleSize.baseline(f,c.pose)*BattleSize.native(f.characterId,c.pose)*FIGHTER_SCALE*BattleSize.art(f.characterId);
  return boxes.map(b=>({...b,y1:b.y1+y,y2:b.y2+y,nativeWorld:true}));
 }
 return{scale,native,boxes};
})();

'use strict';
// Up normals share a readable overhead envelope, while weapon reach, damage,
// timing, remote projectiles and linking hits remain character-authored.
const UpAttackTuning=(()=>{
 const types=new Set(['up','upsmash','uair']);
 const magic=new Set(['vivi','nia','colette','emma','ryza','sans','aruru','dietrich','rocbouquet','deemo','aerith','melia','yuri']);
 const profiles={
  brawler:{width:84,growth:.075,base:4.1,airGrowth:.096,smashGrowth:.102,smashBase:6,color:'#fff0c2'},
  blade:{width:108,growth:.073,base:4,airGrowth:.093,smashGrowth:.098,smashBase:5.8,color:'#d5edff'},
  polearm:{width:128,growth:.070,base:3.8,airGrowth:.091,smashGrowth:.092,smashBase:5.7,color:'#bde8ff'},
  magic:{width:118,growth:.071,base:3.8,airGrowth:.092,smashGrowth:.094,smashBase:5.4,color:'#d8ceff'}
 };
 function family(f){return magic.has(f.characterId)?'magic':MeleeBalance.profile(f);}
 const typeOf=a=>a.sourceType||a.type||a.upAttackType;
 function applies(a){return !!a&&types.has(typeOf(a))&&(!a.special||!!a.sourceType);}
 const linking=a=>a.pull||a.fixedKnockback||a.rehitRate||a.rehitFrames||!a.projectile&&a.cancel?.next||Number.isFinite(a.end)&&a.end<a.activeEnd;
 function knockback(a){
  if(!applies(a)||a.damageOnly||linking(a))return a;
  const p=profiles[a.upAttackFamily]||profiles.blade,type=typeOf(a),smash=type==='upsmash';
  // Faster aerials get a smaller base but enough growth to finish a juggle.
  const growth=smash?p.smashGrowth:type==='uair'?p.airGrowth:p.growth,base=smash?p.smashBase:p.base-(type==='uair'?.15:0);
  return{...a,baseKnockback:Math.max(a.baseKnockback??3,base),knockbackGrowth:Math.max(a.knockbackGrowth??.06,growth)};
 }
 function prepare(f){if(applies(f.attack))f.attack.upAttackFamily=family(f);}
 function strike(f,a){
  if(!applies(a))return a;
  // Overhead bullets/blasts inherit projectile templates; their launch must
  // still follow the up normal rather than the template's side-special angle.
  const lift=a.sourceType&&!a.isMeteor&&!linking(a)&&a.angle<=0&&a.angle>-1.22;
  return{...a,upAttackFamily:family(f),...(lift?{angle:-1.22}:{})};
 }
 function boxes(f,a,raw){
  if(!applies(a)||!raw.length||a.projectile||a.targetedMeteor)return raw;
  const ref=raw.find(b=>!b.meleeInner)||raw[0],scale=MorphieRules.scale(f),p=profiles[family(f)],type=a.type;
  const height=BattleSize.heights[f.characterId]||f.character.ecb.height/scale,radius=(type==='upsmash'?20:18)*scale;
  const half=(p.width+(type==='upsmash'?24:type==='uair'?8:0))/2*scale-radius;
  const y=f.y-clamp(height,60,126)*scale;
  // All extra coverage shares the existing strike's hit ID, modifiers and
  // rehit interval. It never becomes a second hit or extends active frames.
  const extra={...ref,x1:f.x-half,y1:y,x2:f.x+half,y2:y,radius,meleeInner:true,upAttackExtra:true};
  const bridge={...ref,x1:f.x,y1:y,x2:f.x,y2:f.y-45*scale,radius:18*scale,meleeInner:true,upAttackBridge:true};
  if(a.aerial)return[...raw,extra,bridge];
  const pickup={...ref,x1:f.x-half*.75,y1:f.y-30*scale,x2:f.x+half*.75,y2:f.y-30*scale,radius:16*scale,meleeInner:true,upAttackPickup:true};
  return[...raw,extra,bridge,pickup];
 }
 function draw(f){
  const a=f.attack;if(!applies(a)||a.projectile)return;
  const b=attackBoxes(f).find(b=>b.upAttackExtra);if(!b)return;
  const p=profiles[family(f)],mid=(b.x1+b.x2)/2,span=b.x2-b.x1;
  ctx.save();ctx.lineCap='round';ctx.strokeStyle=p.color;ctx.globalAlpha*=.27;ctx.lineWidth=a.type==='upsmash'?3:2;
  ctx.beginPath();ctx.moveTo(b.x1-b.radius*.5,b.y1);ctx.quadraticCurveTo(mid,b.y1-b.radius*.85,b.x2+b.radius*.5,b.y1);ctx.stroke();
  ctx.globalAlpha*=.85;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(b.x1,b.y1+5);ctx.quadraticCurveTo(mid,b.y1-b.radius*.5,b.x2,b.y1+5);ctx.stroke();
  if(family(f)==='magic'){ctx.beginPath();ctx.ellipse(mid,b.y1,span*.5+b.radius*.4,b.radius*.35,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
 }
 for(const{id}of Roster.definitions)for(const type of types){const a=movesFor({characterId:id})[type];if(a)Object.assign(a,{upAttackType:type,upAttackFamily:family({characterId:id})});}
 return{types,profiles,family,applies,knockback,prepare,strike,boxes,draw};
})();

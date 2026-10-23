'use strict';
const ReimuVFX=(()=>{
 // Reviewed alpha paint: gohei crescent 0 convex RIGHT, canopy 1 UP;
 // needles 5 RIGHT, paired-comma sweep 2 LEFT+RIGHT, kick 9 UP-RIGHT.
 // Apply source-local rotation, then the fighter-facing mirror, then world
 // translation (Canvas matrices are applied to points right-to-left).
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.reimu?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;if(a.reimuBarrier&&!a.released&&f.timer>12)stamp(10,f.x+f.face*28,f.y-43,45,52,f.face,.55,0,true);
  const b=attackVisualBoxes(f).filter(v=>!v.meleeInner&&!v.upAttackExtra);if(!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  const left=Math.min(...b.flatMap(v=>[v.x1-v.radius,v.x2-v.radius])),right=Math.max(...b.flatMap(v=>[v.x1+v.radius,v.x2+v.radius])),top=Math.min(...b.flatMap(v=>[v.y1-v.radius,v.y2-v.radius])),bottom=Math.max(...b.flatMap(v=>[v.y1+v.radius,v.y2+v.radius])),x=(left+right)/2,y=(top+bottom)/2,w=right-left,h=bottom-top,active=CombatData.activeWindow(a,f.timer);
  if(a.reimuRift){stamp(9,x,y,w,h,f.face,.9,0,true);return;}
  if(a.reimuAscend){if(active?.index===2)stamp(13,x,y,w,h,f.face,.9,0,true);else stamp(9,x,y,w,h,f.face,.9,0,true);return;}
  if(a.type==='air'){stamp(2,x,y,w,h,f.face,.9);return;}
  if(a.type==='fair'||a.type==='jab2'){stamp(12,x,y,w,h,f.face,.95,0,true);return;}
  if(a.type==='low'){stamp(5,x,y,w,h,f.face,.95,0,true);return;}
  if(a.type==='uair'){stamp(5,x,y,h,w,f.face,.95,-Math.PI/2,true);return;}
  if(a.type==='up'){stamp(6,x,top+32,64,64,f.face,.95,0,true);return;}
  if(a.type==='upsmash'){stamp(1,x,top+38,w,76,f.face,.95);return;}
  if(a.type==='downsmash'){stamp(11,f.x,f.y-25,Math.max(180,w*1.3),65,f.face,.9,0,true);return;}
  if(a.type==='dair'){stamp(13,x,y,w,h,f.face,.95,0,true);return;}
  if(['jab3','dashAttack'].includes(a.type)){stamp(9,x,y,w,h,f.face,.9,0,true);return;}
  stamp(0,x,y,w,h,a.type==='bair'?-f.face:f.face,.92);
 }
 function drawObjects(){for(const q of ReimuRules.objects){const age=q.age-(q.delay||0);if(age<0&&q.kind!=='dream')continue;const alpha=Math.min(1,(q.life-q.age)/9);if(q.kind==='rift')stamp(8,q.x,q.y,55,105,1,alpha,0,true);else if(q.kind==='barrier')stamp(q.charged?11:10,q.x,q.y,q.radius*2,q.radius*2,1,alpha*.82,0,true);else if(q.kind==='dream')stamp(6,q.x,q.y,40,40,1,alpha,frame*.025,true);else if(q.kind==='amulet')stamp(4,q.x,q.y,23,33,q.face,alpha,Math.atan2(q.vy,q.vx*q.face),true);else stamp(5,q.x,q.y,q.kind==='needle'?56:69,18,q.face,alpha,Math.atan2(q.vy,q.vx*q.face),true);}}
 function impact(v){stamp(3,v.x,v.y,28+v.power*2,28+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){const v=reimuDream(f);for(let n=0;n<6;n++)stamp(6,x+158+n*17,y+32,15,15,1,n<v?1:.2,0,true);text(v===6?'夢想封印 / 下B':'ドリーム '+v+'/6',x+151,y+16,9,v===6?'#ffc1df':'#f6e9ed');}
 return{stamp,draw,drawObjects,impact,hud};
})();

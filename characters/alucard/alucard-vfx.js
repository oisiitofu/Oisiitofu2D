'use strict';
const AlucardVFX=(()=>{
 // Native crescent's convex leading edge, waves and animals face RIGHT.
 // Apply local orientation correction, rotation, then fighter reflection.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.alucard?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,vx,vy,w,h,alpha=1){const face=vx<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(vy,vx*face));}
 function body(f,alpha=1,scale=1){if(f.respawn)return false;const a=f.attack;
  if(a?.alucardFlight&&f.timer>=8&&a.phase!=='fall'){if(a.phase==='bat')stamp(5,f.x,f.y-32,105*scale,65*scale,f.face,alpha);else stamp(3,f.x,f.y-40,102*scale,76*scale,f.face,alpha*.8);return true;}
  if(alucardWolf(f)){stamp(4,f.x,f.y-29,128*scale,60*scale,f.face,alpha);return true;}return false;
 }
 function draw(f){if(f.respawn)return;const a=f.attack;
  for(const b of attackVisualBoxes(f)){if(['grab','pummel'].includes(a.type))continue;directed(a.wolf?7:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,b.x2-b.x1,b.y2-b.y1,Math.hypot(b.x2-b.x1,b.y2-b.y1)+b.radius*2,b.radius*2+20,.9);}
  if(a?.alucardFlight&&f.timer>=8&&a.phase!=='fall')directed(9,f.x-f.vx*3,f.y-30,f.vx||f.face,f.vy,100,34,.45);
  if(a?.alucardSummon&&f.timer===24&&a.wolf)stamp(10,f.x,f.y-35,125,110,f.face,.8);
  if(f.alucardBlockFlash>0)stamp(8,f.x+f.face*45,f.y-45,90,90,f.face,f.alucardBlockFlash/8);
 }
 function drawObjects(){for(const q of AlucardRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/8);if(q.kind==='shield')stamp(2,q.x,q.y,44,82,q.face,fade*.85);else if(q.kind==='shieldShot')directed(6,q.x,q.y,q.vx,q.vy,95,50,fade);else if(q.kind==='soul')directed(1,q.x,q.y,q.vx,q.vy,105,36,fade);else if(q.kind==='familiar')stamp(q.variant===0?11:q.variant===1?4:3,q.x,q.y,q.variant===1?105:q.variant===2?95:68,q.variant===1?45:q.variant===2?65:45,q.face,fade);}}
 function impact(v){stamp(7,v.x,v.y,38+v.power*2,38+v.power*2,v.face||1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='alucard')return;const wolf=alucardWolf(f);text(wolf?'オオカミ':alucardShield(f)?'盾：再入力で射出':['コウモリ','オオカミ','霧'][f.alucardFamiliar||0],x+240,y+18,9,'#d8c6ff','right');}
 return{stamp,directed,body,draw,drawObjects,impact,hud};
})();

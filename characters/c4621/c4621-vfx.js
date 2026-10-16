'use strict';
const C4621VFX=(()=>{
 // Rifle, blade and boost textures lead RIGHT: local X reflection, then rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.c4621?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,vx,vy,w,h,alpha=1){const face=vx<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(vy,vx*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;
  for(const b of attackVisualBoxes(f)){if(a.type==='grab'||a.type==='pummel')continue;if(a.type==='downsmash')stamp(3,b.x2,b.y2,b.radius*2.2,b.radius*2.2,1,.85);else{const punch=a.c621Boost||['jab','jab2','jab3','up','dashAttack','upsmash'].includes(a.type);if(punch)stamp(8,b.x2,b.y2,b.radius*2.3,b.radius*2.3,1,.8);else directed(a.type==='smash'?5:4,(b.x1+b.x2)/2,(b.y1+b.y2)/2,b.x2-b.x1,b.y2-b.y1,Math.hypot(b.x2-b.x1,b.y2-b.y1)+b.radius*2,b.radius*2+14,.85);}}
  if(a?.c621Rifle&&[10,16,22,28,34].includes(f.timer)&&f.timer<=a.volleyEnd){const muzzle=c4621Muzzle(f);stamp(1,muzzle.x,muzzle.y,42,30,f.face);}
  if(a?.c621Boost&&a.boostAt!=null&&f.timer-a.boostAt<27)directed(6,f.x-f.vx*2,f.y+8,f.vx,f.vy,55,24,.85);
  if(a?.c621Blade&&((f.timer>=6&&f.timer<12)||(a.following&&f.timer>=a.secondAt-3&&f.timer<a.secondAt)))stamp(7,f.x-f.face*40,f.y-45,96,45,f.face,.6);
  if(f.c621Stagger>0)stamp(9,f.x,f.y-56,105,105,1,Math.min(.7,f.c621Stagger/45));
 }
 function drawObjects(){for(const q of C4621Rules.objects){if(q.kind==='rifle'&&(q.x-q.muzzleX)*q.face>=-8)directed(0,q.x,q.y,q.vx,q.vy,32,12);if(q.kind==='missile')directed(2,q.x,q.y,q.vx,q.vy,36,14);if(q.kind==='blast')stamp(3,q.x,q.y,q.radius*2.3,q.radius*2.3,1,1-q.age/q.life);}}
 function impact(v){stamp(8,v.x,v.y,36+v.power*2,36+v.power*2,1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='c4621')return;ctx.fillStyle='#28313b';ctx.fillRect(x+163,y+20,78,6);ctx.fillStyle=f.c621Stagger>0?'#ff4035':'#ffb95d';ctx.fillRect(x+163,y+20,78*(f.c621ACS||0)/100,6);text(f.c621Stagger>0?'ACS OVERLOAD':'ACS',x+240,y+16,8,'#f5d6b1','right');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

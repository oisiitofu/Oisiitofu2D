'use strict';
const BattlemageVFX=(()=>{
 // Both red/gold sweep0 and piercing trail3 have their convex leading edge RIGHT.
 // Source-local correction -> rotation -> fighter reflection -> world translation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const im=characterArt.battlemage?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,vx,vy,w,h,alpha=1){const face=vx<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(vy,vx*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;for(const b of attackVisualBoxes(f)){if(['grab','pummel'].includes(a.type))continue;directed(a.bmFang?3:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,b.x2-b.x1,b.y2-b.y1,Math.hypot(b.x2-b.x1,b.y2-b.y1)+b.radius*2,b.radius*2+23,.85);}
  for(let k=0;k<(f.bmOrbs||0);k++){const t=frame*.035+k*TAU/3;stamp(1,f.x+Math.cos(t)*35,f.y-47+Math.sin(t)*18,17,17,1,.8);}
  if(battlemageTeana(f)){stamp(7,f.x,f.y-42,105,115,1,.38);stamp(6,f.x,f.y-2,112,35,1,.55);}
  if(a?.bmShot&&!a.decided)stamp(1,f.x+a.originFace*52,f.y-44,17+f.timer*.8,17+f.timer*.8,1,.8);
  if(a?.bmTransform&&f.timer<=22){stamp(6,f.x,f.y-2,120,36,1,f.timer/25);stamp(7,f.x,f.y-43,115,135,1,f.timer/30);}
  if(a?.bmTeleport){if(f.timer<8)stamp(5,f.x,f.y-44,85,85,1,.65);else if(a.launchAt!=null&&f.timer-a.launchAt<12)stamp(4,f.x,f.y-47,100,130,1,.65);}
 }
 function drawObjects(){for(const q of BattlemageRules.objects){const fade=Math.min(1,(q.life-q.age)/6);if(q.kind==='chaser')stamp(1,q.x,q.y,q.radius*2.4,q.radius*2.4,q.face,fade);else if(q.kind==='echo'){const armed=q.age>=q.delay;stamp(armed?2:1,q.x,q.y,armed?q.radius*2.5:20,armed?q.radius*2.5:20,1,fade*(armed?.85:.6));}}}
 function impact(v){stamp(8,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='battlemage')return;const active=battlemageTeana(f);ctx.fillStyle='#37202b';ctx.fillRect(x+158,y+20,82,7);ctx.fillStyle=active?'#ffd76d':'#f2648c';ctx.fillRect(x+158,y+20,82*(active?f.bmTeanaTime/600:battlemageGauge(f)/100),7);text(active?'テアナ '+Math.ceil(f.bmTeanaTime/60)+'秒':battlemageGauge(f)>=100?'テアナ 発動可能':'テアナ '+Math.floor(battlemageGauge(f))+'%',x+240,y+15,9,'#ffe3b8','right');text('チェイサー '+(f.bmOrbs||0)+'/3',x+240,y+40,9,'#ffb8ed','right');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

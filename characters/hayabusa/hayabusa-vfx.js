'use strict';
const HayabusaVFX=(()=>{
 // Textures lead RIGHT. Reflect local X first, then rotate in the reflected space.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.hayabusa?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,vx,vy,w,h,alpha=1){const face=vx<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(vy,vx*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;
  if(hayabusaGleam(f))stamp(5,f.x,f.y-48,104,116,1,.32+.08*Math.sin(frame*.14));
  for(const b of attackVisualBoxes(f)){if(['grab','pummel'].includes(a.type))continue;directed(a.hayabusaWind?4:a.hayabusaSwallow?3:hayabusaGleam(f)?10:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,b.x2-b.x1,b.y2-b.y1,Math.hypot(b.x2-b.x1,b.y2-b.y1)+b.radius*2,b.radius*2+18,.9);}
  if(a?.hayabusaSwallow&&f.timer>=8&&f.timer<=20)directed(6,f.x-f.vx*3,f.y-47,f.vx,f.vy,95,38,.45);
  if(a?.hayabusaWind&&a.windAt!=null&&f.timer-a.windAt<27)directed(4,f.x-f.vx*2,f.y+4,f.vx,f.vy,70,35,.65);
  if(a?.hayabusaGleam&&f.timer>=18)stamp(11,f.x,f.y-45,130,130,1,Math.max(0,1-(f.timer-18)/12));
 }
 function drawObjects(){for(const q of HayabusaRules.objects)if(q.kind==='shuriken')stamp(2,q.x,q.y,25,25,q.face,1,q.age*.45);}
 function impact(v){stamp(8,v.x,v.y,36+v.power*2,36+v.power*2,1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='hayabusa')return;const active=hayabusaGleam(f);ctx.fillStyle='#202a45';ctx.fillRect(x+163,y+20,78,6);ctx.fillStyle=active?'#6aaaff':'#7585a8';ctx.fillRect(x+163,y+20,78*(active?f.hayaGleamTime/600:1-(f.hayaGleamCooldown||0)/1080),6);text(active?'闇':f.hayaGleamCooldown?'再充填':'GLEAM',x+240,y+16,8,'#b6ceff','right');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

'use strict';
const MaleniaVFX=(()=>{
 // Native cuts/thrusts travel RIGHT. Reflect local X first, then rotate.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.malenia?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,b,alpha=.85){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;stamp(n,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+b.radius*2,b.radius*2+12,face,alpha,Math.atan2(dy,dx*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;
  for(const b of attackVisualBoxes(f)){if(a.type==='grab')continue;if(a.maleniaTransform)stamp(4,f.x,f.y-45,140,110,1,.8);else if(b.window?.shape==='spin')stamp(2,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.abs(b.x2-b.x1)+b.radius*2,b.radius*2+20,1,.85);else directed(a.type==='smash'?1:0,b);}
  if(a?.maleniaStep&&f.timer>=9&&f.timer<16)stamp(3,f.x-(a.stepFace||f.face)*30,f.y-48,110,45,a.stepFace||f.face,.6);
  if(a?.maleniaAeonia&&f.timer<19)stamp(7,f.x,f.y-50,100,100,1,.55);
  if(f.maleniaHealFlash>0)stamp(11,f.x,f.y-52,75,85,1,f.maleniaHealFlash/22);
 }
 function drawObjects(){for(const q of MaleniaRules.objects){if(q.kind==='petals')stamp(4,q.x,q.y,155,155,1,1-q.age/q.life);if(q.kind==='phantom'){const f=fighters[q.owner],ghost={...f,x:q.x,y:q.y,face:q.face,inv:0,attack:null,state:'idle'};drawSprite(ghost,.45,60);if(q.age>=9&&q.age<=12)directed(1,{x1:q.x-q.face*20,y1:q.y-50,x2:q.x+q.face*100,y2:q.y-50,radius:18},.6);}if(q.kind==='bloom')stamp(6,q.x,q.y,q.radius*2.3,q.radius*1.8,1,1-q.age/q.life);if(q.kind==='rotField')stamp(5,q.x,q.y,q.radius*2.15,q.radius*.7,1,Math.min(.6,(q.life-q.age)/22));}}
 function impact(v){stamp(8,v.x,v.y,38+v.power*2,38+v.power*2,1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='malenia')return;const time=f.maleniaRotTime||0,cd=f.maleniaRotCooldown||0;ctx.fillStyle='#442c36';ctx.fillRect(x+162,y+21,79,5);ctx.fillStyle=time?'#ff6d6e':'#ad7180';ctx.fillRect(x+162,y+21,79*(time?time/720:Math.max(0,1-cd/720)),5);text(time?'ROT '+Math.ceil(time/60)+'s':cd?'ROT WAIT':'ROT READY',x+241,y+17,8,'#f0bcc2','right');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

'use strict';
const KlonoaVFX=(()=>{
 // Wind textures lead RIGHT. Reflect local X, then rotate in that space.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.klonoa?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,vx,vy,w,h,alpha=1){const face=vx<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(vy,vx*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;
  for(const b of attackVisualBoxes(f)){if(['grab','pummel'].includes(a.type))continue;directed(6,(b.x1+b.x2)/2,(b.y1+b.y2)/2,b.x2-b.x1,b.y2-b.y1,Math.hypot(b.x2-b.x1,b.y2-b.y1)+b.radius*2,b.radius*2+15,.82);}
  if(a?.kloHolding&&f.grabbed){const o=f.grabbed;stamp(1,o.x,o.y-o.character.ecb.height*.5,Math.max(64,o.character.ecb.height*1.15),Math.max(64,o.character.ecb.height*1.15),1,.75);}
  if(a?.kloMoo&&!a.fired)stamp(2,f.x,f.y-92,45,45,f.face);
  if(a?.kloRide&&a.rideAt!=null){const dt=f.timer-a.rideAt,detach=a.detachAt??19;if(dt<detach){stamp(4,f.x-f.face*6,f.y+7,58,40,f.face);directed(7,f.x-f.vx*3,f.y+22,f.vx,f.vy,65,27,.6);}else if(dt<detach+18)stamp(7,f.x,f.y+8,95,26,f.face,.5);}
 }
 function drawObjects(){for(const q of KlonoaRules.objects){if(q.kind==='wind')directed(0,q.x,q.y,q.vx,q.vy,43,25);if(q.kind==='moo')stamp(2,q.x,q.y,44,42,q.face,1,q.age*.08);if(q.kind==='bomb')stamp(3,q.x,q.y,34,38,q.face,1,Math.sin(q.age*.1)*.15);if(q.kind==='blast')stamp(8,q.x,q.y,q.radius*2.1,q.radius*2.1,1,1-q.age/q.life);}}
 function impact(v){stamp(11,v.x,v.y,30+v.power*2,30+v.power*2,1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='klonoa')return;text(f.attack?.kloHolding&&!f.attack.released?'捕獲：必殺で投げ／ジャンプで踏み台':'WIND RING',x+240,y+17,8,'#a5efff','right');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

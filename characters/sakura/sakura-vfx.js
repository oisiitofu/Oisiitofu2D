'use strict';
const SakuraVFX=(()=>{
 // Source0 convex RIGHT,1 UP,3 UP-RIGHT. Normalize a stroke before local
 // rotation and final facing. The Nair fan retains its authored open shape.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.sakura?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function extent(b){return{left:Math.min(...b.flatMap(v=>[v.x1-v.radius,v.x2-v.radius])),right:Math.max(...b.flatMap(v=>[v.x1+v.radius,v.x2+v.radius])),top:Math.min(...b.flatMap(v=>[v.y1-v.radius,v.y2-v.radius])),bottom:Math.max(...b.flatMap(v=>[v.y1+v.radius,v.y2+v.radius]))};}
 function fit(n,b,face=1){const im=characterArt.sakura?.effects[n],ink=im&&AttackEffects.bounds(im);if(!ink)return;const sx=(b.right-b.left)/ink.w,sy=(b.bottom-b.top)/ink.h;ctx.save();ctx.translate((b.left+b.right)/2,(b.top+b.bottom)/2);ctx.scale(face,1);AttackEffects.image(im,-(b.right-b.left)/2-ink.x*sx,-(b.bottom-b.top)/2-ink.y*sy,im.width*sx,im.height*sy);ctx.restore();}
 function contact(n,v){const im=characterArt.sakura?.effects[n],c=im&&AttackEffects.normalized(im,AttackEffectData.axes.sakura[n]||[1,0]),ink=c?.bounds;if(!ink)return;const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,w=Math.hypot(dx,dy)+2*v.radius,h=2*v.radius,sx=w/ink.w,sy=h/ink.h;ctx.save();ctx.translate((v.x1+v.x2)/2,(v.y1+v.y2)/2);ctx.scale(face,1);ctx.rotate(Math.atan2(dy,dx*face));AttackEffects.image(c.img,-w/2-ink.x*sx,-h/2-ink.y*sy,c.img.width*sx,c.img.height*sy);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);
  if(a?.sakuraResolve)stamp(7,f.x,f.y-25,95,75,1,Math.min(.7,f.timer/60),0,true);
  if(a?.sakuraWave&&!a.released&&f.timer>20)stamp(14,f.x+f.face*20,f.y-43,55,35,f.face,.6,0,true);
  if(a?.sakuraFan&&!a.released&&f.timer>8)stamp(14,f.x+f.face*40,f.y-43+(a.aim||0)*25,55,26,f.face,.5,0,true);
  if(a?.sakuraAscent&&a.phase==='rise'&&!b.length)stamp(6,f.x-f.face*10,f.y-30,70,120,f.face,.6,0,true);
  if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const outer=b.filter(v=>!v.meleeInner),parts=outer.length?outer:b;
  if(a.type==='air'){fit(3,extent(parts),f.face);return;}
  if(a.type==='up'){fit(11,extent(parts),f.face);return;}
  if(a.sakuraFan){fit(5,extent(parts),f.face);return;}
  if(a.sakuraAscent){fit(parts[0].window?.index===1?3:1,extent(parts),f.face);return;}
  if(['upsmash','uair'].includes(a.type)){const e=extent(parts);stamp(1,(e.left+e.right)/2,e.top+40,e.right-e.left,80,f.face);return;}
  for(const v of parts.flatMap(v=>SlashVFX.outward(f,v))){const n=a.type==='bair'?11:['jab3','fair','dair'].includes(a.type)?10:a.type==='smash'?2:0;if(['bair','fair','dair','smash'].includes(a.type))contact(n,v);else{const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1;stamp(n,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+30,Math.max(42,v.radius*2),face,.95,Math.atan2(dy,dx*face));}}
 }
 function drawObjects(){for(const q of SakuraRules.objects){const alpha=Math.min(1,(q.life-q.age)/7);stamp(q.fx,q.x,q.y,q.kind==='fan'?65:q.radius*3,q.kind==='fan'?27:q.radius*2,q.face,alpha,Math.atan2(q.vy,q.vx*q.face),true);}}
 function impact(v){stamp(9,v.x,v.y,34+v.power*2,34+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){const m=sakuraMorale(f);text(m>=100?'満開・次の必殺強化':'霊力 '+Math.floor(m),x+145,y+14,8,m>=100?'#ffe0ee':'#ffb9d9');ctx.fillStyle='#44283f';ctx.fillRect(x+150,y+25,76,7);ctx.fillStyle=m>=100?'#ffe4ed':'#ff83b7';ctx.fillRect(x+150,y+25,76*m/100,7);stamp(8,x+158,y+47,16,16,1,m>=100?1:.35,0,true);}
 return{stamp,draw,drawObjects,impact,hud};
})();

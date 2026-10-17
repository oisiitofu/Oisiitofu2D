'use strict';
const KurabeVFX=(()=>{
 // Convex leading edge of impact0/plasma2 and the missile nose face RIGHT.
 // Local correction -> rotation -> fighter reflection -> world translation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.kurabe?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,vx,vy,w,h,alpha=1){const face=vx<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(vy,vx*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;for(const b of attackVisualBoxes(f)){if(['grab','pummel'].includes(a.type))continue;directed(a.kurabeMech?2:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,b.x2-b.x1,b.y2-b.y1,Math.hypot(b.x2-b.x1,b.y2-b.y1)+b.radius*2,b.radius*2+18,.85);}
  if(a?.kurabeTerminal&&f.timer>=10&&!a.finished)stamp(7,f.x+f.face*43,f.y-47,85,77,f.face,.85);
  if(a?.kurabeSummon&&f.timer<24){stamp(8,f.x,f.y-3,140,45,1,.65);stamp(6,f.x,f.y-80,135,160,1,f.timer/28);}
  if(a?.kurabeGun&&[12,13,18,19,24,25].includes(f.timer))stamp(1,f.x+a.originFace*92,f.y-82,55,26,a.originFace,.9);
  if(a?.kurabeArtillery&&!a.fired)stamp(9,a.targetX,a.targetY,80,32,1,.5+.25*Math.sin(frame*.3));
  if(a?.kurabeBoost&&a.launchAt!=null&&!a.dropped)stamp(5,f.x,f.y+24,65,80,1,.7);
 }
 function drawObjects(){for(const q of KurabeRules.objects){const fade=Math.min(1,(q.life-q.age)/6);if(q.kind==='shell')stamp(1,q.x,q.y,30,12,q.face,fade);else if(q.kind==='marker'){stamp(9,q.x,q.y,95,35,1,fade*.7);if(q.age>=6)stamp(3,q.x,q.y-180+(q.age-6)*14,24,48,1,fade,Math.PI/2);}else if(q.kind==='blast')stamp(4,q.x,q.y,q.radius*2.2,q.radius*2.2,1,fade);}}
 function impact(v){stamp(11,v.x,v.y,38+v.power*2,38+v.power*2,v.face||1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='kurabe')return;const active=kurabeMech(f);ctx.fillStyle='#172738';ctx.fillRect(x+158,y+20,82,7);ctx.fillStyle=active?'#ffb865':kurabeGauge(f)>=100?'#81f3ff':'#59bfe9';ctx.fillRect(x+158,y+20,82*(active?f.kurabeMechTime/900:kurabeGauge(f)/100),7);text(active?'第13番機兵 '+Math.ceil(f.kurabeMechTime/60)+'秒':kurabeGauge(f)>=100?'機兵 起動可能':'機兵 '+Math.floor(kurabeGauge(f))+'%',x+240,y+15,9,'#cbefff','right');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

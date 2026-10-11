'use strict';
const AdolVFX=(()=>{
 // Native cut sprites point RIGHT: translate, reflect in world X, then rotate locally.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.adol?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function direction(b){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;return{face,rot:Math.atan2(dy,dx*face),x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2,len:Math.hypot(dx,dy)};}
 function draw(f){const a=f.attack;if(!a)return;if(a.forceEdge&&a.hold)stamp(1,f.x+f.face*22,f.y-62,75,55,f.face,.4+.5*a.charge);if(a.pentagram&&a.route){ctx.save();ctx.strokeStyle='#efd98b';ctx.lineWidth=1.5;ctx.globalAlpha*=.3;ctx.beginPath();a.route.forEach((p,n)=>n?ctx.lineTo(p.x,p.y-42):ctx.moveTo(p.x,p.y-42));ctx.stroke();ctx.restore();}const w=CombatData.activeWindow(a,f.timer);if(!w)return;for(const b of attackBoxes(f)){const d=direction(b),fx=w.shape==='shockwave'?6:a.adolEffect??0;stamp(fx,d.x,d.y,d.len+24,w.shape==='shockwave'?60:w.shape==='spin'?90:50,d.face,.95,w.shape==='spin'||w.shape==='shockwave'?0:d.rot);}}
 function drawObjects(){for(const q of AdolRules.objects)stamp(3,q.x,q.y,q.radius*4,q.radius*3,q.face,Math.min(1,(q.life-q.age)/5));}
 function impact(v){stamp(7,v.x,v.y,55+v.power*7,55+v.power*7,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId!=='adol')return;const a=f.attack;const title=a?.pentagram?'PENTAGRAM / B AGAIN: RETURN':a?.skyDrive?(a.rebounded?'SKY DRIVE / REBOUND USED':'SKY DRIVE / CONTACT TO REBOUND'):'FORCE EDGE / PENTAGRAM / SKY DRIVE / EARTH SHAKER';text(title,x+52,y+54,8,'#bfe6ff','left');}
 return{stamp,direction,draw,drawObjects,impact,hud};
})();

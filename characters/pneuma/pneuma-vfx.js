'use strict';
const PneumaVFX=(()=>{
 // FX0 beam / FX1 crescent lead RIGHT, FX4 crescent UP, FX5 jet UP-RIGHT.
 // Explicit transform order: translate -> facing reflection -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.pneuma?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.pneuma?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;if(a.pneumaGenesis||a.type==='downsmash'){if(attackVisualBoxes(f).length)stamp(2,f.x,f.y-55,a.pneumaGenesis&&f.timer<20?130:220,130,f.face,.8);}else for(const b of attackVisualBoxes(f)){const x=(b.x1+b.x2)/2,y=(b.y1+b.y2)/2,angle=Math.atan2(b.y2-b.y1,b.x2-b.x1);if(a.pneumaWings)stamp(2,f.x,f.y-65,115,95,f.face,.5);else directed(['up','uair','upsmash'].includes(a.type)?4:1,x,y,Math.max(45,Math.hypot(b.x2-b.x1,b.y2-b.y1)+28),65,angle,.7,['up','uair','upsmash'].includes(a.type)?-Math.PI/2:0);}
  if(a.hold)stamp(7,f.x+f.face*40,f.y-70,30+40*a.charge,30+40*a.charge,f.face,.7);
  if(a.pneumaFlare&&['aim','path','warp'].includes(a.phase)){ctx.save();ctx.strokeStyle='#75ffe4';ctx.lineWidth=1.5;ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(a.origin.x,a.origin.y-50);for(const p of a.points){ctx.lineTo(p.x,p.y-50);stamp(6,p.x,p.y-50,28,28,1,.8);}ctx.stroke();ctx.restore();if(a.phase==='warp')stamp(6,f.x,f.y-50,80,100,1,.75);}
  if(a.pneumaWings&&a.phase==='ascent'){const angle=Math.atan2(f.vy,f.vx||f.face*.1);directed(5,f.x-f.vx*2,f.y-30-f.vy*1.5,90,65,angle,.65,-.47);}if(a.pneumaWings&&a.phase==='glide')stamp(5,f.x-f.face*50,f.y-40,70,28,f.face,.25);
 }
 function drawObjects(){for(const q of PneumaRules.objects)directed(0,q.x+q.face*q.length/2,q.y,q.length,q.radius*3,q.face>0?0:Math.PI,Math.min(1,(q.life-q.age)/3));}
 function impact(v){stamp(3,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='pneuma')text('↑必殺 上下左右で滑空 / 回避で解除・攻撃へ移行可',x+52,y+54,9,'#9df5e1','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

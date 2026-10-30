'use strict';
const NightsVFX=(()=>{
 const k=CharacterVFXKit.create('nights'),{stamp}=k;
 // Actual extracted paint: 0 convex RIGHT, 2 convex UP, 3 convex DOWN;
 // 1/7/9 advance RIGHT. Local source -> rotation -> facing -> world.
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;const e=k.envelope(f);
  if(e){if(a.type==='air'){stamp(11,e.l+12,e.y,28,28,1,.8,0,true);stamp(11,e.r-12,e.y,28,28,1,.8,0,true);}else if(e.upper)stamp(2,e.x,e.t+Math.min(e.h,35)/2,e.w,Math.min(e.h,35),1,.88);else if(a.type==='dair')stamp(3,e.x,e.y,e.w,Math.min(e.h,40),1,.85);else if(a.type==='downsmash'){stamp(0,e.l+e.w*.25,e.y,e.w*.5,30,-1,.8);stamp(0,e.r-e.w*.25,e.y,e.w*.5,30,1,.8);}else if(['jab','jab2','jab3','fair'].includes(a.type)){const tip=f.face>0?e.r:e.l;stamp(1,tip-f.face*19,e.y,40,23,f.face,.8);}else if(a.nightsNightmare)stamp(9,e.x,e.y,e.w,e.h,f.face,.75);else stamp(0,e.x,e.y,e.w,Math.min(e.h,38),e.back?-f.face:f.face,.82);}
  if(a.nightsRoute&&a.points?.length>1){ctx.save();ctx.strokeStyle='#ffd369aa';ctx.lineWidth=3;ctx.setLineDash([5,7]);ctx.beginPath();a.points.forEach((p,n)=>n?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.restore();if(a.phase==='flight')stamp(7,f.x-f.vx*3,f.y-40,63,24,1,.6,Math.atan2(f.vy,f.vx),true);}
  if(a.nightsOrbit&&a.pivot&&['pull','orbit'].includes(a.phase)){ctx.save();ctx.strokeStyle='#a9ddff77';ctx.lineWidth=1.5;ctx.setLineDash([4,6]);ctx.beginPath();ctx.arc(a.pivot.x,a.pivot.y,a.radius,0,Math.PI*2);ctx.stroke();ctx.restore();if(a.phase==='orbit'){const tx=-Math.sin(a.orbitAngle)*a.spin,ty=Math.cos(a.orbitAngle)*a.spin;stamp(7,f.x+tx*35,f.y-40+ty*35,38,15,1,.75,Math.atan2(ty,tx),true);}}
  if(a.nightsNightmare&&a.phase==='wind')stamp(15,f.x,f.y-35,76,95,1,.4,0,true);
 }
 function drawObjects(){for(const q of NightsRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/12);if(q.kind==='ring'){stamp(6,q.x,q.y,42,24,1,fade*.85,0,true);if(q.nightmare)stamp(10,q.x,q.y,35,28,1,fade*.6,0,true);}else if(q.kind==='ball')stamp(q.charged||q.amplified?5:4,q.x,q.y,q.radius*3,q.radius*3,q.face,fade,0,true);else if(q.kind==='loop'){const points=q.points,cx=points.reduce((v,p)=>v+p.x,0)/points.length,cy=points.reduce((v,p)=>v+p.y,0)/points.length;ctx.save();ctx.strokeStyle='#ffe29b';ctx.fillStyle='#ffd46222';ctx.lineWidth=4*fade;ctx.globalAlpha*=fade;ctx.beginPath();points.forEach((p,n)=>n?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();stamp(8,cx,cy,80,80,1,fade,0,true);}}
 }
 function impact(v){stamp(11,v.x,v.y,34+v.power*2,34+v.power*2,1,v.life/v.max,0,true);}
 function hud(f,x,y){k.bar(nightsFuel(f)/96*100,'FLIGHT',x,y,'#e0b9ff');text('RING '+nightsRings(f).length+(f.nightsNightmareCooldown>0?'  ◷':'  ☾'),x+148,y+43,8,'#ffdc8e','left');}
 return{draw,drawObjects,impact,hud};
})();

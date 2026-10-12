'use strict';
const MoogleVFX=(()=>{
 // Fire, ice, stone and slash point RIGHT. Wind column and crystal point UP.
 // Transform order: translate -> horizontal reflection -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.moogle?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.moogle?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;for(const b of attackVisualBoxes(f))directed(6,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(b.x2-b.x1,b.y2-b.y1)+35,35,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);if(a.hold)stamp(0,f.x+f.face*25,f.y-25,24+a.charge*24,24+a.charge*24,f.face,.65);if(a.moogleCure&&!a.fired)stamp(4,f.x,f.y-30,45,45,1,.35);}
 function drawObjects(){for(const q of MoogleRules.objects){if(['fire','ice','stone','shard'].includes(q.kind))directed(q.kind==='fire'?0:q.kind==='stone'?5:1,q.x,q.y,q.radius*5,q.radius*3,Math.atan2(q.vy,q.vx));if(q.kind==='crystal')stamp(2,q.x,q.y,48,65,1,Math.min(1,(q.life-q.age)/15));if(q.kind==='aero')stamp(3,q.x,q.base-q.height/2,q.radius*2,q.height,1,Math.min(.85,(q.life-q.age)/8));if(q.kind==='heal')stamp(4,q.x,q.y,90,90,1,(q.life-q.age)/q.life);}}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='moogle')text('MP '+Math.floor(moogleMP(f))+(f.moogleCureCooldown>0?' · CURE '+(f.moogleCureCooldown/60).toFixed(1)+'s':''),x+50,y+54,10,'#ffbce7','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

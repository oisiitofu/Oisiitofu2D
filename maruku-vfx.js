'use strict';
const MarukuVFX=(()=>{
 // FX0/1 convex leading edge RIGHT, arrows2/laser5 RIGHT, vine3/ice4 UP.
 // Transform order: world translation → facing reflection → local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.maruku?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;for(const b of attackBoxes(f)){const d=AdolVFX.direction(b),angle=Math.atan2(b.y2-b.y1,b.x2-b.x1);if(a.marukuWarp)stamp(6,f.x,f.y-25,90,80,1,.65);else if(b.window?.shape==='spin')stamp(0,f.x,f.y-33,110,90,f.face,.7,frame*.15);else if(a.type==='upsmash')stamp(3,b.x2,b.y2+25,65,100,f.face,.8);else directed(a.type==='smash'?2:0,d.x,d.y,d.len+22,48,angle,.75);}if(a.marukuCannon&&a.hold)stamp(5,f.x+f.face*25,f.y-32,25+45*a.charge,15+25*a.charge,f.face,.75);if(a.marukuWarp&&a.phase==='aim')stamp(6,f.x+a.warpX*40,f.y-30+a.warpY*40,40,35,1,.5);}
 function drawObjects(){for(const q of MarukuRules.objects){if(q.kind==='laser')stamp(5,q.x+q.face*q.length/2,q.y,q.length,q.radius*5,q.face,Math.min(1,(q.life-q.age)/3));else if(q.kind==='cutter')directed(1,q.x,q.y,45,45,Math.atan2(q.vy,q.vx),.95);else if(q.kind==='shadow')stamp(6,q.x,q.y,80,65,1,1-q.age/q.life);else if(q.kind==='hole'){const size=q.phase==='warning'?40+q.age*4:q.radius*2.2;stamp(7,q.x,q.y,size,size,1,q.phase==='warning'?.55:.9,frame*.035);if(q.phase==='burst')stamp(4,q.x,q.y,110,120,1,Math.max(0,1-(q.age-62)/23));}}}
 function impact(v){stamp(0,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='maruku')text('B 溜めレーザー / →B 往復 / ↑B 影移動 / ↓B 吸引',x+52,y+54,9,'#edd0ff','left');}return{stamp,directed,draw,drawObjects,impact,hud};
})();

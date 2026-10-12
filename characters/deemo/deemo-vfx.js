'use strict';
const DeemoVFX=(()=>{
 // Staff0 and note1 point RIGHT. Falling score2 points DOWN-RIGHT, stair3 UP-RIGHT, roots4 UP.
 // Order: translation -> horizontal reflection -> local rotation, compensating the native axis.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.deemo?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.deemo?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){if(f.respawn)return;if(f.state==='guard')stamp(6,f.x,f.y-58,98,145,1,.6);const a=f.attack;if(!a)return;for(const b of attackVisualBoxes(f)){if(a.type==='smash'){directed(3,(b.x1+b.x2)/2,b.y1,150,65,f.face<0?Math.PI:0,.9,-Math.PI/4);continue;}if(a.type==='upsmash'){stamp(5,b.x1,b.y2+20,42,42,1,.95);continue;}if(a.type==='downsmash'){stamp(4,(b.x1+b.x2)/2,f.y-35,100,80,1,.9);continue;}directed(0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.max(35,Math.hypot(b.x2-b.x1,b.y2-b.y1)+20),35,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);}
  if(a.hold)stamp(1,f.x+f.face*30,f.y-85,30+30*a.charge,30+25*a.charge,f.face,.8);if(a.deemoScore&&!a.fired)stamp(5,a.origin.x+a.originFace*a.range,f.y-18,32,12,1,.5);
 }
 function drawObjects(){for(const q of DeemoRules.objects){if(q.kind==='note')directed(1,q.x,q.y,62,38,Math.atan2(q.vy,q.vx));else if(q.kind==='score'){if(q.phase==='warning')stamp(5,q.targetX,q.targetY-12,28,10,1,.25+.12*Math.sin(q.age));else directed(2,q.x,q.y,45,70,Math.atan2(q.vy,q.vx),.9,Math.PI/5);}else if(q.kind==='key')stamp(3,q.x-q.face*20,q.y+18,65,48,q.face,Math.min(1,(q.life-q.age)/5));else if(q.kind==='roots')stamp(4,q.x,q.y-(q.phase==='warning'?8:42),q.phase==='warning'?130:170,q.phase==='warning'?16:95,1,q.phase==='fade'?(q.life-q.age)/8:.85);else if(q.kind==='rootRay'){const dx=q.targetX-q.x,dy=q.targetY-q.y;directed(4,(q.x+q.targetX)/2,(q.y+q.targetY)/2,35,Math.hypot(dx,dy),Math.atan2(dy,dx),.7,-Math.PI/2);}}}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(){}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

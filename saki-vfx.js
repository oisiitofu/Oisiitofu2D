'use strict';
const SakiVFX=(()=>{
 // Native axes: cannon0/charge1/slash2 RIGHT; vault4 UP-RIGHT; recoil5 DOWN; ring3/spark6 radial.
 // Translate -> facing reflection -> local rotation, compensating the source axis after scaling.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.saki?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.saki?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;for(const b of attackBoxes(f)){const angle=Math.atan2(b.y2-b.y1,b.x2-b.x1),length=Math.hypot(b.x2-b.x1,b.y2-b.y1);if(a.sakiReflect){stamp(3,f.x,f.y-45,132,100,f.face,.65);stamp(2,f.x,f.y-45,140,42,f.face,.85);}else directed(a.type==='smash'?1:2,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.max(50,length+24),42,angle,.85);}if(a.hold){const p=sakiStrike(f,41)[1];stamp(1,p.x,p.y,35+30*a.charge,30,f.face,.8);}if(a.sakiVault&&a.phase==='vault')directed(4,f.x-f.vx*2,f.y-25,95,38,Math.atan2(f.vy,f.vx),.65,-Math.PI/4);if(a.sakiRecoil&&a.shotAt&&f.timer-a.shotAt<=4){const p=sakiStrike(f,44)[1];directed(5,p.x,p.y+20,40,60,Math.PI/2,.8,Math.PI/2);}}
 function drawObjects(){for(const q of SakiRules.objects){directed(q.kind==='charge'?1:0,q.x,q.y,q.kind==='charge'?90:44,q.kind==='charge'?36:18,Math.atan2(q.vy,q.vx));}}
 function impact(v){stamp(6,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(){}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

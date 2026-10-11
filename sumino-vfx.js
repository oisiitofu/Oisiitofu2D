'use strict';
const SuminoVFX=(()=>{
 // Native FX0/5 RIGHT, FX2 LEFT, FX1/3 UP, FX4 UPRIGHT. Translate -> reflection -> rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.sumino?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.sumino?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;for(const b of attackVisualBoxes(f))directed(0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.max(40,Math.hypot(b.x2-b.x1,b.y2-b.y1)+24),55,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);if(a.hold)stamp(7,f.x+f.face*25,f.y-40,25+25*a.charge,25+25*a.charge,f.face,.6);if(a.suminoLift&&a.phase==='recoil')directed(4,f.x-f.vx,f.y-10,65,90,Math.atan2(f.vy,f.vx||f.face*.01),.5,-Math.PI/4);}
 function drawObjects(){for(const q of SuminoRules.objects){if(q.kind==='blade')stamp(1,q.x,q.y-q.height/2,70,q.height,1,.9);if(q.kind==='echo')directed(2,(q.x+q.x2)/2,(q.y+q.y2)/2,Math.hypot(q.x2-q.x,q.y2-q.y)+35,65,Math.atan2(q.y-q.y2,q.x-q.x2),q.phase==='warning'?.15:.85,Math.PI);if(q.kind==='assault')stamp(q.voltage===100?5:3,q.x,q.y-25,q.radius*2+40,130,q.face,.8);}}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='sumino')text('ボルテージ '+Math.round(suminoVoltage(f))+' / ↑必殺 押し直しで斬り上げ',x+52,y+54,9,'#ffa5b5','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

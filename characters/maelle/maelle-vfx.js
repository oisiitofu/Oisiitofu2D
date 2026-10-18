'use strict';
const MaelleVFX=(()=>{
 // FX0/1/5 lead RIGHT, ascent4 UP. Translate -> face reflection -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.maelle?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.maelle?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;for(const b of attackVisualBoxes(f)){if(a.maelleHalo)stamp(2,f.x,f.y-60,95,75,f.face,.55);else if(b.window.shape==='spin')stamp(2,f.x,f.y-45,150,85,f.face,.8);else directed(0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.max(40,Math.hypot(b.x2-b.x1,b.y2-b.y1)+24),55,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);}if(a.hold)stamp(7,f.x+f.face*30,f.y-75,25+25*a.charge,25+25*a.charge,f.face,.6);if(a.maelleWaltz&&a.phase==='orbit')directed(5,f.x-f.vx*2,f.y-45-f.vy,80,45,Math.atan2(f.vy,f.vx),.6);if(a.maelleHalo&&['flight','ricochet'].includes(a.phase))directed(4,f.x-f.vx*1.5,f.y-20,65,90,Math.atan2(f.vy,f.vx||f.face*.01),.5,-Math.PI/2);}
 function drawObjects(){for(const q of MaelleRules.objects){if(q.kind==='ray')directed(1,q.x+q.face*q.length/2,q.y,q.length,q.radius*3,q.face>0?0:Math.PI,Math.min(1,(q.life-q.age)/3));else{stamp(q.phase==='warning'?2:3,q.x,q.y,150,q.phase==='warning'?70:150,1,q.phase==='warning'?.3+.3*q.age/34:.9);}}}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='maelle')text('→必殺 命中後に押し直しで回り込み / ↑必殺 接触で反跳',x+52,y+54,9,'#cbdafa','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

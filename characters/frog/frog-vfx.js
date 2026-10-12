'use strict';
const FrogVFX=(()=>{
 // FX0/1 RIGHT, splash3/4 UP. Translate -> reflection -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.frog?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.frog?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;for(const b of attackVisualBoxes(f)){if(b.window.shape==='spin')stamp(2,f.x,f.y-40,160,85,f.face,.8);else directed(0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.max(40,Math.hypot(b.x2-b.x1,b.y2-b.y1)+24),55,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);}if(a.hold)stamp(7,f.x+f.face*25,f.y-45,25+25*a.charge,25+25*a.charge,f.face,.6);if(a.frogJump&&['leap','bounce'].includes(a.phase))directed(4,f.x,f.y-8,65,85,Math.atan2(f.vy,f.vx||f.face*.01),.5,-Math.PI/2);if(a.frogVeil&&f.timer>=10&&f.timer<=22)stamp(6,f.x,f.y-40,105,100,f.face,.7);}
 function drawObjects(){for(const q of FrogRules.objects){if(q.kind==='water')directed(1,q.x,q.y,85+q.charge*45,45+q.charge*30,Math.atan2(q.vy,q.vx),.85);else if(q.kind==='splash')stamp(3,q.x,q.y-30,90,65,1,.8);}}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='frog')text('↑必殺 押し直しで降下 / 着地で長押しすると一度だけ跳ねる',x+52,y+54,9,'#b6eaff','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

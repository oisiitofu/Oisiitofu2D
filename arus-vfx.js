'use strict';
const ArusVFX=(()=>{
 // FX0,1,2,5 lead RIGHT. FX4 water jet leads UP. FX3 is a nondirectional oval.
 // World translate -> facing reflection -> local rotation. Correct the source axis after scaling.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.arus?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.arus?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;for(const b of attackBoxes(f)){if(a.arusRide||b.window.shape==='spin')stamp(3,f.x,f.y-38,115,65,f.face,.7);else{const angle=Math.atan2(b.y2-b.y1,b.x2-b.x1),n=a.type==='smash'?0:a.arusDance&&a.comboStage===3?2:1;directed(n,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.max(45,Math.hypot(b.x2-b.x1,b.y2-b.y1)+24),55,angle,.75);}}
  if(a.hold)stamp(7,f.x+f.face*40,f.y-50,25+30*a.charge,25+30*a.charge,f.face,.6);
  if(a.arusRide&&a.phase==='ride'){stamp(3,a.anchor.x,f.y-4,130,50,1,.65);stamp(4,f.x,f.y+24,50,85,1,.45);}if(a.arusRide&&a.phase==='burst')directed(5,f.x-f.vx*3,f.y-30,100,45,Math.atan2(f.vy,f.vx),.6);
 }
 function drawObjects(){for(const q of ArusRules.objects)directed(q.kind==='giga'?0:q.kind==='purify'?5:1,q.x,q.y,q.kind==='giga'?85+60*q.charge:70,q.radius*3,Math.atan2(q.vy,q.vx),Math.min(1,(q.life-q.age)/3));}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='arus')text('→必殺 追加入力で4連 / ↑必殺 渦から左右へ離脱',x+52,y+54,9,'#c4e59a','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

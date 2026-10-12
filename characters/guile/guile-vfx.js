'use strict';
const GuileVFX=(()=>{
 // Native FX0/1/4 convex leading edge RIGHT; FX2 convex edge UP.
 // Transform order: translate -> facing reflection -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.guile?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.guile?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;for(const b of attackVisualBoxes(f)){const x=(b.x1+b.x2)/2,y=(b.y1+b.y2)/2,angle=Math.atan2(b.y2-b.y1,b.x2-b.x1);if(a.guileSomersault||['up','uair','upsmash'].includes(a.type))directed(2,x,y,70,55,angle,.8,-Math.PI/2);else directed(a.type.includes('smash')?1:4,x,y,70,30,angle,.55);}if(a.hold)stamp(7,f.x+f.face*20,f.y-54,36+32*a.charge,36+32*a.charge,f.face,.7);}
 function drawObjects(){for(const q of GuileRules.objects){const angle=q.kind==='blade'?Math.atan2(Math.sin(q.angle),Math.cos(q.angle)*q.face):q.face>0?0:Math.PI;directed(q.kind==='blade'?1:0,q.x,q.y,q.radius*3.4,q.radius*2.1,angle,Math.min(1,(q.life-q.age)/10));}}
 function impact(v){stamp(3,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='guile')text('→必殺 上入力で弾道 / ↑必殺 踏切角度',x+52,y+54,9,'#d4eaa8','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

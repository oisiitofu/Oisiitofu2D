'use strict';
const RocbouquetVFX=(()=>{
 // Native slash/wind/bolt RIGHT; return2 LEFT. Translate -> reflection -> rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.rocbouquet?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.rocbouquet?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;for(const b of attackBoxes(f)){if(a.rocbouquetRide||b.window.shape==='spin')stamp(4,f.x,f.y-35,115,60,f.face,.6);else directed(0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.max(40,Math.hypot(b.x2-b.x1,b.y2-b.y1)+24),55,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);}if(a.hold)stamp(7,f.x+f.face*25,f.y-65,25+25*a.charge,25+25*a.charge,f.face,.6);if(a.rocbouquetRide&&a.phase==='ride')stamp(4,f.x,f.y+5,105,40,1,.75);}
 function drawObjects(){for(const q of RocbouquetRules.objects){if(q.kind==='wind')directed(0,q.x,q.y,85,45,Math.atan2(q.vy,q.vx),.8);if(q.kind==='plasma')directed(q.phase==='out'?1:2,q.x,q.y,100,40,Math.atan2(q.vy,q.vx),.8,q.phase==='out'?0:Math.PI);if(q.kind==='hearts')stamp(5,q.x,q.y,q.radius*2,75,q.face,.85);}}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='rocbouquet')text('↑必殺 長押し＋方向で風を操る / 誘惑 '+Math.ceil((f.rocbouquetTemptCooldown||0)/60)+'秒',x+52,y+54,9,'#d6b6ff','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

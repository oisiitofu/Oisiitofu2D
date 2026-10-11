'use strict';
const OdioVFX=(()=>{
 // Native crescent0, dragons1/5 and razor2 point RIGHT; vault3 points UP.
 // Canvas order: translate, horizontal reflection, then local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.odio?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.odio?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;for(const b of attackVisualBoxes(f))directed(0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.max(40,Math.hypot(b.x2-b.x1,b.y2-b.y1)+20),36,Math.atan2(b.y2-b.y1,b.x2-b.x1),.7);if(a.hold)stamp(1,f.x+f.face*30,f.y-45,35+40*a.charge,20+25*a.charge,f.face,.7);if(a.odioVault&&['flight','rebound'].includes(a.phase))directed(3,f.x-f.vx*3,f.y-30-f.vy*2,50,90,Math.atan2(f.vy,f.vx),.6,-Math.PI/2);}
 function drawObjects(){for(const q of OdioRules.objects){if(q.kind.startsWith('dragon'))directed(q.kind==='dragonLarge'?5:1,q.x,q.y,q.kind==='dragonLarge'?130:75,q.kind==='dragonLarge'?65:36,Math.atan2(q.vy,q.vx),.9);else if(q.kind==='razor')directed(2,q.x,q.y,90,70,q.face<0?Math.PI:0,Math.min(1,(q.life-q.age)/3));else if(q.kind==='denial'){const img=characterArt.odio.effects[4],h=q.phase==='warning'?12:125,w=q.phase==='warning'?100:125;stamp(4,q.x,q.y-h/2,w,h,1,q.phase==='warning'?.35:q.phase==='fade'?Math.max(0,(q.life-q.age)/26):.9);}}}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='odio')text(f.odioDenialCooldown>0?'ディナイアル '+(f.odioDenialCooldown/60).toFixed(1)+'s':'ディナイアル READY',x+52,y+54,11,'#e7b4ff','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

'use strict';
const TwinbeeVFX=(()=>{
 // Bullet, laser, missile and bell crescent source lead RIGHT. Translate → facing reflection → local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.twinbee?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}
 function draw(f){if(f.respawn)return;if(f.twinbeeBarrier>0)stamp(13,f.x,f.y-40,90,105,1,.4);const a=f.attack;if(!a)return;for(const b of attackVisualBoxes(f)){if(a.twinbeeFlight)continue;const d=AdolVFX.direction(b);if(b.window?.shape==='spin')stamp(7,f.x,f.y-40,100,90,1,.6);else directed([47,15,19].includes(b.window?.pose)?4:0,d.x,d.y,d.len+24,35,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);}if(a.twinbeeFlight&&['lift','float'].includes(a.phase))stamp(5,f.x,f.y+8,82,60,1,.55);}
 function drawObjects(){for(const q of TwinbeeRules.objects){if(['shot','spread','laser','missile'].includes(q.kind))directed(q.kind==='laser'?2:q.kind==='missile'?3:0,q.x,q.y,q.kind==='laser'?100:q.kind==='missile'?70:30,q.kind==='laser'?25:30,Math.atan2(q.vy,q.vx));if(q.kind==='bomb')stamp(14,q.x,q.y,32,32,1,1,q.age*.08);if(q.kind==='blast')stamp(6,q.x,q.y,q.radius*2.5,q.radius*2.5,1,1-q.age/q.life);if(q.kind==='item')stamp(8+q.itemType,q.x,q.y+Math.sin(q.age*.1)*2,35,35,1,Math.min(1,(q.life-q.age)/30));}}
 function impact(v){stamp(6,v.x,v.y,28+v.power*3,28+v.power*3,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='twinbee')text('ベル '+((f.twinbeeBells||[]).map(t=>['赤','緑','青'][t]).join('→')||'通常')+' / ↓B アイテム',x+52,y+54,9,'#c5f5ff','left');}return{stamp,directed,draw,drawObjects,impact,hud};
})();

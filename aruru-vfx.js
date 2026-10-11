'use strict';
const AruruVFX=(()=>{
 // FX7 opens LEFT / convex leading edge RIGHT. Translate → facing reflection → local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.aruru?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;for(const b of attackBoxes(f)){if(a.aruruRide)continue;const d=AdolVFX.direction(b);if(b.window?.shape==='spin')stamp(6,f.x,f.y-40,105,95,1,.55);else{directed(7,d.x,d.y,d.len+20,42,Math.atan2(b.y2-b.y1,b.x2-b.x1),.65);if(b.window?.pose!==47)stamp(a.type==='bair'?2:0,b.x2,b.y2,32,32,f.face,.9);}}if(a.aruruShot&&a.hold)stamp(Math.min(4,Math.floor(a.chargeFrames/10)),f.x+f.face*32,f.y-43,30+24*a.charge,30+24*a.charge,f.face,.9);}
 function drawObjects(){for(const q of AruruRules.objects){if(q.kind==='pop')stamp(5,q.x,q.y,q.radius*2.6,q.radius*2.6,1,1-q.age/q.life);else if(q.kind==='field'){for(let n=-1;n<=1;n++)stamp(q.color,q.x+n*27,q.y,40,40,1,Math.min(1,(q.life-q.age)/30));stamp(6,q.x,q.y+12,95,30,1,.35);}else{const r=q.radius*(q.kind==='chain'&&q.age<q.delay?1+.08*Math.sin(q.age*.3):1);stamp(q.color,q.x,q.y,r*2.5,r*2.5,q.face,.95);}}}
 function impact(v){stamp(5,v.x,v.y,28+v.power*3,28+v.power*3,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='aruru')text('B 溜めで5色 / →B 配置変更 / ↓B 設置・起爆',x+52,y+54,9,'#c5f5ff','left');}return{stamp,directed,draw,drawObjects,impact,hud};
})();

'use strict';
const VincentVFX=(()=>{
 // FX0/1 lead RIGHT. FX2 convex RIGHT opens LEFT. translate → facing reflection → local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.vincent?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;if(a?.vincentFlight&&a.phase==='startup')stamp(4,f.x,f.y-60,100,135,f.face,.8);if(!a)return;for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b);directed(2,d.x,d.y,d.len+30,48,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);}if(a.vincentGun&&[9,16,23].includes(f.timer))stamp(0,f.x+f.face*67,f.y-64,50,30,f.face);if(a.vincentSlide&&[8,16,24].includes(f.timer))stamp(0,f.x+f.face*72,f.y-34,45,28,f.face);}
 function drawObjects(){for(const q of VincentRules.objects)if(q.kind==='chaos')stamp(5,q.x,q.y,q.radius*2.5,75,1,Math.min(.7,(q.life-q.age)/15));else directed(1,q.x,q.y,42,14,Math.atan2(q.vy,q.vx));}
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,35+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='vincent')text('弾数 '+(f.vincentAmmo??6)+'/6  上B 獣化飛行',x+52,y+54,9,'#ff9da4','left');}return{stamp,directed,draw,drawObjects,impact,hud};
})();

'use strict';
const CrashVFX=(()=>{
 // FX0/1 lead RIGHT. FX2 convex RIGHT opens LEFT. translate → facing reflection → local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.crash?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}

 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;for(const b of attackBoxes(f)){if(a.crashSpin||b.window?.shape==='spin')stamp(0,f.x,f.y-40,145,95,1,.75);else{const d=AdolVFX.direction(b);directed(1,d.x,d.y,d.len+32,45,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);}}if(a.crashRocket&&a.phase==='boost')stamp(2,f.x-f.vx*2,f.y-25-f.vy*2,32,75,1,.85,Math.atan2(f.vy,f.vx)+Math.PI/2);if(a.type==='smash'&&f.timer>=a.activeStart&&f.timer<=a.activeEnd)stamp(6,f.x+f.face*55,f.y-55,48,65,f.face,.8);}
 function drawObjects(){for(const q of CrashRules.objects)stamp(q.kind==='crate'?3:q.kind==='fruit'?4:5,q.x,q.y,q.kind==='crate'?50:q.kind==='fruit'?25:85,q.kind==='crate'?50:q.kind==='fruit'?25:70,1,q.kind==='debris'?(q.life-q.age)/q.life:1);}
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,35+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='crash')text('燃料 '+Math.ceil(f.crashFuel??60)+'/60  果実 '+(f.crashFruitCount||0),x+52,y+54,9,'#ffce8b','left');}return{stamp,directed,draw,drawObjects,impact,hud};
})();

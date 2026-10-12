'use strict';
const ShizunaVFX=(()=>{
 // Native slash sprites point RIGHT. Reflect first, then rotate in local space.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.shizuna?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,b,alpha=.85){const angle=Math.atan2(b.y2-b.y1,b.x2-b.x1),face=Math.cos(angle)<0?-1:1;stamp(n,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(b.x2-b.x1,b.y2-b.y1)+30,48,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}
 function draw(f){if(f.respawn)return;for(const b of attackVisualBoxes(f))directed(f.attack?.shizunaMoon?5:f.attack?.shizunaGale?2:0,b);if(f.attack?.hold)stamp(6,f.x,f.y-58,60,85,1,.5);}
 function drawObjects(){for(const q of ShizunaRules.objects){if(q.kind==='shadow'&&q.age>=11&&q.age<=20){const f=fighters[q.owner],shadow={...f,x:q.x,y:q.y,face:q.face,attack:null,state:'idle'};drawSprite(shadow,.35,41);directed(1,{x1:q.x+q.face*20,y1:q.y-54,x2:q.x+q.face*145,y2:q.y-54},.6);}if(q.kind==='moon')stamp(5,q.x,q.y,180+(q.power||0)*1.5,70,1,1-q.age/q.life);}}
 function impact(v){stamp(4,v.x,v.y,40+v.power*2,40+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='shizuna')text('CP '+Math.floor(f.shizunaCP||0)+' / 100',x+242,y+23,10,'#c6e6ff','right');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

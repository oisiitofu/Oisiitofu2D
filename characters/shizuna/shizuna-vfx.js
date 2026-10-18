'use strict';
const ShizunaVFX=(()=>{
 // Crescent0's convex edge leads LEFT; normalize before local rotation/reflection.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.shizuna?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;SlashVFX.image('shizuna',n,img,-w/2,-h/2,w,h);ctx.restore();}
 function geometry(b){const angle=Math.atan2(b.y2-b.y1,b.x2-b.x1),face=Math.cos(angle)<0?-1:1,r=b.radius??18;return{x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2,w:Math.hypot(b.x2-b.x1,b.y2-b.y1)+r*2,h:r*2+10,face,rot:Math.atan2(Math.sin(angle),Math.cos(angle)*face)};}
 function directed(n,b,alpha=.85){const g=geometry(b);stamp(n,g.x,g.y,g.w,g.h,g.face,alpha,g.rot);}
 function draw(f){if(f.respawn)return;for(const b of attackVisualBoxes(f))directed(b.window?.shape==='spin'?2:f.attack?.shizunaMoon?5:0,b);if(f.attack?.hold)stamp(6,f.x,f.y-58,60,85,1,.5);}
 function drawObjects(){for(const q of ShizunaRules.objects){if(q.kind==='shadow'&&q.age>=11&&q.age<=20){const f=fighters[q.owner],shadow={...f,x:q.x,y:q.y,face:q.face,attack:null,state:'idle'};drawSprite(shadow,.35,41);directed(1,shizunaShadowBox(q),.6);}if(q.kind==='moon'&&q.strike)directed(5,q.strike,(1-q.age/q.life)*.7);}}
 function impact(v){stamp(4,v.x,v.y,40+v.power*2,40+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='shizuna')text('CP '+Math.floor(f.shizunaCP||0)+' / 100',x+242,y+23,10,'#c6e6ff','right');}
 return{stamp,geometry,directed,draw,drawObjects,impact,hud};
})();

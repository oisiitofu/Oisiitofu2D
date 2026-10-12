'use strict';
const BombermanVFX=(()=>{
 // Trails lead RIGHT. Reflect first, then rotate in local space.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.bomberman?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,h,face=1,alpha=1,rot=0){const img=characterArt.bomberman?.frames[40+n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-h*img.width/img.height/2,-h/2,h*img.width/img.height,h);ctx.restore();}
 function direction(b){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;return{face,rotation:Math.atan2(dy,dx*face),x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2,length:Math.hypot(dx,dy)};}
 function drawObjects(){for(const q of BombermanRules.objects){if(q.kind==='bomb'){prop(q.power?1:0,q.x,q.y,q.power?34:27,q.face,1,q.kicked?q.age*.16:0);if(q.kicked)stamp(0,q.x-q.vx,q.y,55,30,q.face,.7);if(q.life-q.age<30)stamp(7,q.x,q.y-17,22,22,1,.5+Math.sin(frame*.8)*.4);continue;}const alpha=Math.min(1,(q.life-q.age)/5);for(const b of BombermanRules.blastBoxes(q)){const d=direction(b);if(d.length>0)stamp(2,d.x,d.y,d.length+28,36,d.face,alpha,d.rotation);}stamp(3,q.x,q.y,70,70,1,alpha);}
 }
 function draw(f){const a=f.attack;if(!a){if(f.grabbed)prop(0,f.grabbed.x,f.grabbed.y-35,30);return;}const t=f.timer;
  if(a.louieSpring&&t<=a.launchFrame+8){const riding=t<a.launchFrame;prop(riding?2:3,a.springPoint.x,a.springPoint.y-25,62,f.face,riding?1:(a.launchFrame+9-t)/9);stamp(6,a.springPoint.x,a.springPoint.y-15,80,60,f.face,.6);}if(a.bombThrow&&t<a.startupFrames)prop(a.charge>=.5?1:0,f.x+f.face*28,f.y-36,32,f.face);if(a.hold)stamp(4,f.x+f.face*22,f.y-35,70+55*a.charge,65, f.face,.65);
  const w=CombatData.activeWindow(a,t);if(!w)return;for(const b of attackVisualBoxes(f)){const d=direction(b);stamp(0,d.x,d.y,d.length+22,42,d.face,.8,d.rotation);if(a.bombGlove)prop(a.type==='smash'?1:0,b.x2,b.y2,a.type==='smash'?48:28,d.face);}
 }
 function impact(v){stamp(7,v.x,v.y,75+v.power*12,75+v.power*12,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId==='bomberman')text('BOMBS '+BombermanRules.bombs(f).length+'/4 / LOUIE',x+52,y+54,8,'#ffd08d','left');}
 return{stamp,prop,direction,drawObjects,draw,impact,hud};
})();

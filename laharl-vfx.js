'use strict';
const LaharlVFX=(()=>{
 // Native sword0, orb1 and fist2 point RIGHT. Flame5 points UP; portal3 is vertical.
 // Order is translate -> horizontal reflection -> local rotation. No double mirroring.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.laharl?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.laharl?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){if(f.respawn)return;if(f.state==='guard')stamp(6,f.x,f.y-35,92,95,1,.6);const a=f.attack;if(!a)return;if(a.laharlDimension&&f.timer<14){stamp(3,f.x,f.y-18,65,30,1,.8);stamp(3,a.exit.x,a.exit.y-38,44,80,1,.25+f.timer*.035);}
  for(const b of attackVisualBoxes(f)){if(a.type==='upsmash'){stamp(5,b.x1,f.y-55,48,115,1,.9);continue;}if(b.window.shape==='shockwave'){stamp(4,f.x,f.y-22,150,65,1,.9);continue;}directed(a.laharlKnuckle||a.laharlMeteorDrop||['dair','jab3','pummel'].includes(a.type)?2:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.max(45,Math.hypot(b.x2-b.x1,b.y2-b.y1)+24),36,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);}
  if(a.hold)stamp(1,f.x+f.face*30,f.y-35,30+35*a.charge,22+25*a.charge,f.face,.8);if(a.laharlDimension&&f.timer>=14&&f.timer<22)stamp(3,f.x-f.face*22,f.y-35,40,80,1,(22-f.timer)/8);
 }
 function drawObjects(){for(const q of LaharlRules.objects){if(q.kind==='orb')directed(1,q.x,q.y,q.radius*5,q.radius*3,Math.atan2(q.vy,q.vx));else if(q.kind==='meteorCross')stamp(4,q.x,q.y-23,175,75,1,(q.life-q.age)/q.life);else if(q.kind==='knuckleBurst')stamp(4,q.x,q.y,85,65,1,(q.life-q.age)/q.life);}}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(){}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

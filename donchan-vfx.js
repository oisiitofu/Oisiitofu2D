'use strict';
const DonchanVFX=(()=>{
 // Native note/beat/slash axes point RIGHT. Balloon, soul aura point UP.
 // Transform order: translate -> horizontal reflection -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.donchan?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.donchan?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 // The soft tails make these source bounds much wider than their solid cores.
 // Anchor the note/balloon core at its actual collision center and scale uniformly.
 const cores={0:[517.5,129,103],1:[514.5,128,167],3:[282,102.5,154]};
 function core(n,x,y,height,angle=0,alpha=1){const img=characterArt.donchan?.effects[n];if(!img)return;const[cx,cy,h]=cores[n],s=height/h,face=Math.cos(angle)<0?-1:1;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(Math.atan2(Math.sin(angle),Math.cos(angle)*face));ctx.globalAlpha*=alpha;ctx.drawImage(img,-cx*s,-cy*s,img.width*s,img.height*s);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(f.donMaxTime>0)stamp(4,f.x,f.y-35,180,90,1,.3+Math.sin(frame*.12)*.08);if(['ShieldStart','ShieldHold'].includes(f.mode))stamp(7,f.x,f.y-38,100,90,1,.25);if(!a)return;for(const b of attackBoxes(f)){directed(5,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(b.x2-b.x1,b.y2-b.y1)+30,38,Math.atan2(b.y2-b.y1,b.x2-b.x1),.85);if(a.type==='upsmash')core(3,b.x2,b.y2,35,0,.7);if(['smash','downsmash','uair'].includes(a.type))core(a.type==='smash'?1:0,b.x2,b.y2,30,f.face===1?0:Math.PI,.75);}if(a.hold)core(0,f.x+f.face*25,f.y-42,25+a.charge*25,f.face===1?0:Math.PI,.6);}
 function drawObjects(){for(const q of DonchanRules.objects){const alpha=Math.min(1,(q.life-q.age)/5);if(q.kind==='balloon')core(3,q.x,q.y,48,0,.95);else if(q.kind==='note')core(q.big?1:0,q.x,q.y,q.radius*2.7,Math.atan2(q.vy,q.vx),alpha);else if(q.kind==='lane')directed(2,q.x+q.face*145,q.y,300,65,q.face===1?0:Math.PI,.3*alpha);else if(q.kind==='laneNote')directed(2,q.x-q.face*14,q.y,85,42,Math.atan2(q.vy,q.vx),alpha);else if(q.kind==='pop')stamp(6,q.x,q.y,q.radius*2,q.radius*2,1,alpha);else if(q.kind==='festival')stamp(4,q.x,q.y,220,110,1,alpha);}}
 function impact(v){stamp(6,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId!=='donchan')return;text(f.donMaxTime>0?'魂MAX '+(f.donMaxTime/60).toFixed(1)+'s':'魂 '+Math.floor(donchanSoul(f))+' / 100'+(donchanSoul(f)>=100?' · 下必殺':''),x+50,y+54,10,'#ffcd80','left');}
 return{stamp,directed,core,draw,drawObjects,impact,hud};
})();

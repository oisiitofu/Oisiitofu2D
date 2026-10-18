'use strict';
const DoshinVFX=(()=>{
 // Native wind travels RIGHT; water and earth burst UP. Translate -> reflect -> rotate.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.doshin?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.doshin?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;for(const b of attackVisualBoxes(f))directed(6,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(b.x2-b.x1,b.y2-b.y1)+35,50,Math.atan2(b.y2-b.y1,b.x2-b.x1),.7);if(a.doshinThrow&&!a.fired){const p=doshinStrike(f,41)[1];stamp(a.prop??0,p.x,p.y,38,38,f.face,.9);}if(a.doshinJump&&['jump','rebound'].includes(a.phase))stamp(7,f.x,f.y+12,70,40,1,.55);}
 function drawObjects(){for(const q of DoshinRules.objects){if(q.kind==='prop')stamp(q.prop,q.x,q.y,q.radius*3,q.radius*3,q.face);if(q.kind==='terrain'){if(q.phase==='warning')stamp(7,q.x,q.base-12,100,30,1,.6);else stamp(2,q.x,q.y+20,110,60,1,Math.min(1,(q.life-q.age)/20));}if(q.kind==='quake')stamp(4,q.x,q.y-20,q.radius*2,70,1,(q.life-q.age)/q.life);if(q.kind==='play')stamp(q.phase==='water'?5:6,q.x,q.y-30,170,100,q.face,(q.life-q.age)/q.life);}}
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,30+v.power,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='doshin'&&f.doshinPlayCooldown>0)text('PLAY '+(f.doshinPlayCooldown/60).toFixed(1)+'s',x+50,y+54,10,'#ffda75','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

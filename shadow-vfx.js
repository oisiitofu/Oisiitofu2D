'use strict';
const ShadowVFX=(()=>{
 // Native axes: spear0, boost1, shoe5 RIGHT; pillar7 UP; rings2/3/4 and spark6 symmetric.
 // Canvas order: translate -> horizontal reflection -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.shadow?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(n===2){ctx.beginPath();ctx.ellipse(0,0,w*.48,h*.48,0,0,Math.PI*2);ctx.clip();}ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.shadow?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){if(f.respawn)return;if(f.state==='run')directed(5,f.x-f.face*20,f.y-5,45,16,f.face<0?Math.PI:0,.65);const a=f.attack;if(!a)return;for(const b of attackBoxes(f)){if(a.type==='upsmash'){stamp(7,f.x,f.y-65,85,150);continue;}const angle=Math.atan2(b.y2-b.y1,b.x2-b.x1);if(a.type==='smash'||a.shadowBoost)directed(a.shadowBoost?1:0,(b.x1+b.x2)/2,b.y1,Math.max(90,Math.abs(b.x2-b.x1)+60),55,f.face<0?Math.PI:0,.9);else directed(4,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.max(40,Math.hypot(b.x2-b.x1,b.y2-b.y1)+20),32,angle,.8);}
  if(a.hold)stamp(a.shadowBlast?3:0,f.x+f.face*25,f.y-40,35+35*a.charge,35+35*a.charge,f.face,.8);if(a.shadowControl){if(a.phase==='flight'){stamp(2,f.x,f.y-40,90,90,1,.55);for(let j=1;j<=2;j++)drawSprite({...f,x:f.x-a.direction.x*j*16,y:f.y-a.direction.y*j*16,attack:null,state:'idle',mode:'Idle',inv:0},.22/j,45);}else if(f.timer<10)stamp(2,f.x,f.y-40,35+f.timer*3,35+f.timer*3,1,.7);}if(a.shadowBoost&&['hit','wall'].includes(a.phase))directed(5,f.x+f.face*15,f.y-10,55,20,Math.atan2(f.vy,f.vx),.8);
 }
 function drawObjects(){for(const q of ShadowRules.objects){if(q.kind==='spear')directed(0,q.x,q.y,60+35*q.charge,24+10*q.charge,Math.atan2(q.vy,q.vx));else if(q.kind==='blast')stamp(3,q.x,q.y,q.radius*2.2,q.radius*2.2,1,(q.life-q.age+1)/q.life);else if(q.kind==='clock'){stamp(2,q.x,q.y,q.radius*2,q.radius*2,1,.25);ctx.save();ctx.strokeStyle='#8bffbd';ctx.lineWidth=1;ctx.setLineDash([5,8]);ctx.beginPath();ctx.arc(q.x,q.y,q.radius,0,Math.PI*2);ctx.stroke();ctx.restore();}}}
 function impact(v){stamp(6,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='shadow')text(f.shadowBlastCooldown>0?'カオスブラスト '+(f.shadowBlastCooldown/60).toFixed(1)+'s':'カオスブラスト READY',x+52,y+54,10,f.shadowBlastCooldown>0?'#d3def0':'#ff809a','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

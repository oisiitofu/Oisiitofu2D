'use strict';
const ZidaneVFX=(()=>{
 // FX0/1/4 lead RIGHT, convex edge RIGHT and opening LEFT.
 // translate -> facing reflection -> local rotation onto the actual segment.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.zidane?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;if(f.zidaneTranceTime>0)stamp(3,f.x,f.y-40,120,145,1,.30);if(a?.zidaneTrance)stamp(3,f.x,f.y-40,125,140,1,.45);if(a?.zidaneRope&&a.tip){const hand={x:f.x+f.face*15,y:f.y-100};ctx.save();ctx.strokeStyle='#b98949';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hand.x,hand.y);if(a.phase==='shoot'&&a.tipRoute){ctx.lineTo(a.tip.x,a.tip.y);}else{if(a.route||a.tipRoute)ctx.lineTo(a.anchor.x,platforms.find(p=>p.main).y+102);ctx.lineTo(a.tip.x,a.tip.y);}ctx.stroke();ctx.restore();stamp(6,a.tip.x,a.tip.y,25,25,1,.6);}if(!a)return;for(const b of attackBoxes(f)){const d=AdolVFX.direction(b);directed(a.zidaneSteal?6:0,d.x,d.y,d.len+30,a.zidaneSteal?30:45,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);}}
 function drawObjects(){for(const q of ZidaneRules.objects){if(q.kind==='silence')stamp(5,q.x,q.y,q.radius*2.3,100,1,Math.min(.7,(q.life-q.age)/15));else if(q.kind==='echo'){if(q.age>=q.delay)directed(4,(q.x+q.x2)/2,(q.y+q.y2)/2,Math.hypot(q.x2-q.x,q.y2-q.y)+35,48,Math.atan2(q.y2-q.y,q.x2-q.x),.85);}else if(q.kind==='knife')directed(1,q.x,q.y,55,20,Math.atan2(q.vy,q.vx),.85);else stamp(6,q.x,q.y,45,45,1,1-q.age/q.life);}for(const f of fighters)if(f.zidaneSilenced>0)stamp(5,f.x,f.y-104,35,18,1,.75);}
 function impact(v){stamp(6,v.x,v.y,35+v.power*2,35+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId!=='zidane')return;text(f.zidaneItem!==null&&f.zidaneItem!==undefined?'盗品: '+ZidaneItems[f.zidaneItem]:f.zidaneTranceTime>0?'トランス '+Math.ceil(f.zidaneTranceTime/60)+'s':f.zidaneTranceCooldown>0?'トランス 再使用 '+Math.ceil(f.zidaneTranceCooldown/60)+'s':'→B トランス',x+52,y+54,9,'#9bdaff','left');if(f.attack?.phase==='swing')text('必殺を押し直して飛び離れる',f.x,f.y-130,11,'#ffd68a');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

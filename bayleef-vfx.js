'use strict';
const BayleefVFX=(()=>{
 // Slash 0 and leaf projectile 1 point RIGHT. Translate -> reflect -> rotate.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.bayleef?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function vine(f,a){const b=attackBoxes(f)[0],start={x:f.x+f.face*12,y:f.y-68},end=f.grabbed?{x:f.grabbed.x,y:f.grabbed.y-45}:b?{x:b.x2,y:b.y2}:null;if(!end)return;ctx.save();ctx.strokeStyle='#345d15';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(start.x,start.y);ctx.quadraticCurveTo((start.x+end.x)/2,start.y-24,end.x,end.y);ctx.stroke();ctx.strokeStyle='#9bc942';ctx.lineWidth=2;ctx.stroke();ctx.restore();}
 function circle(f,alpha=.8){stamp(0,f.x,f.y-52,135,85,f.face,alpha,frame*.11);stamp(0,f.x,f.y-52,135,85,f.face,alpha,frame*.11+Math.PI);}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;if(a.vineWhip&&t>=11&&t<=34)vine(f,a);if(a.leafReflect&&t>=8&&t<=25){circle(f,.35);ctx.save();ctx.strokeStyle='#a6ed7a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(f.x,f.y-52,43,57,0,0,TAU);ctx.stroke();ctx.restore();}if(a.leafStorm&&a.launched&&!a.escapeSide&&a.fuel>0)circle(f,.35);const w=CombatData.activeWindow(a,t);if(!w)return;for(const b of attackBoxes(f)){if(w.shape==='spin'){circle(f);continue;}const d=AdolVFX.direction(b);stamp(0,d.x,d.y,d.len+24,42,d.face,.85,d.rot);}}
 function drawObjects(){for(const q of BayleefRules.objects){const face=Math.sign(q.vx)||q.face;stamp(1,q.x,q.y,40,24,face,1,Math.atan2(q.vy,q.vx*face));}}
 function impact(v){stamp(2,v.x,v.y,47+v.power*4,47+v.power*4,1,(v.life/v.max)**1.6);}
 function hud(f,x,y){if(f.characterId==='bayleef'&&f.attack?.leafStorm)text('LEAF STORM '+Math.max(0,f.attack.fuel)+'F',x+245,y+27,9,'#bded64','right');}
 return{draw,drawObjects,impact,hud,stamp};
})();

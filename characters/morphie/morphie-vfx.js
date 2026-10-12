'use strict';
const MorphieVFX=(()=>{
 // Directional textures lead RIGHT. Translate -> reflect -> rotate in local coordinates.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.morphie?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,w,h,face=1,rot=0){const img=characterArt.morphie?.frames[40+n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){const a=f.attack,s=MorphieRules.scale(f);if(f.morphTime>0)stamp(s<1?7:6,f.x,f.y-42*s,85*s,95*s,1,.18);if(!a)return;const t=f.timer;if(a.inkShot)prop(2,f.x+f.face*30*s,f.y-55*s,65*s,26*s,f.face,Math.atan2(a.aimY||0,1));if(a.sizeShift&&t>=16&&t<24)stamp(a.sizeChoice<1?7:6,f.x,f.y-45*s,120*s,120*s,1,.7);
 if(a.buttRocket&&a.launched&&a.thrusting){const dx=-(a.thrustX||0),dy=-a.thrustY,face=dx<0?-1:1;stamp(4,f.x+dx*2,f.y+dy*2,75,38,face,.9,Math.atan2(dy,dx*face));}
 if(a.buttRocket)return;const w=CombatData.activeWindow(a,t);if(!w)return;for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b);stamp(w.shape==='spin'?12:a.hammer?8:a.type==='downsmash'?9:3,d.x,d.y,d.len+25,48*s,d.face,.85,d.rot);if(a.hammer||a.pipe)prop(a.hammer?0:6,d.x,d.y,d.len+35,40*s,d.face,d.rot);}}
 function drawObjects(){for(const q of MorphieRules.objects){const face=Math.sign(q.vx)||q.face;if(q.kind==='paintFloor'){stamp(11,q.x,q.y-3,q.radius*2,18,1,Math.min(.6,(q.life-q.age)/20));}else if(q.kind==='roller'){prop(1,q.x,q.y,65,42,face);stamp(3,q.x-face*28,q.y+16,75,18,face,.6);}else stamp(0,q.x,q.y,q.radius*3,q.radius*2,face,.95,Math.atan2(q.vy,q.vx*face));}}
 function impact(v){stamp(15,v.x,v.y,50+v.power*4,50+v.power*4,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId==='morphie')text('SIZE '+MorphieRules.scale(f).toFixed(2)+' / →B ROLLER / ↑B FUEL '+(f.attack?.fuel??36),x+52,y+54,8,'#bfe6ff','left');}
 return{stamp,prop,draw,drawObjects,impact,hud};
})();

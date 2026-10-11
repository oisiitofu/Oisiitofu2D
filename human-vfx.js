'use strict';
const HumanVFX=(()=>{
 // FX 0/1/2/4 lead RIGHT. Catapult prop 41 launches LEFT in its source.
 // World translation -> horizontal reflection -> rotation in local coordinates.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.human?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,w,h,face=1,rot=0){const img=characterArt.human?.frames[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;if(a.ropeSwing&&!a.released&&t>=9){ctx.save();ctx.strokeStyle='#a97742';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.anchor.x,a.anchor.y);ctx.lineTo(f.x+f.face*9,f.y-101);ctx.stroke();ctx.strokeStyle='#e8c897';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();prop(42,a.anchor.x,a.anchor.y,20,23);}
  if(a.catapult&&!a.launched)prop(41,f.x,f.y-19,130,80,-(Math.sign(a.aim)||f.face));if(a.catapult&&a.launched&&t<35){const d={x1:f.x-f.vx*4,y1:f.y-f.vy*4,x2:f.x,y2:f.y},v=AdolVFX.direction(d);stamp(2,v.x,v.y,100,42,v.face,.75,v.rot);}
  if(a.crateSmash&&t>=24&&t<33)prop(40,f.x+f.face*30,f.y-20,45,45,f.face);if(a.type==='downsmash'&&t>=16&&t<=30)prop(43,f.x+f.face*26,f.y-(t<22?65:22),70,35,f.face,t<22?-.8:.75);
  const w=CombatData.activeWindow(a,t);if(!w)return;for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b);if(w.shape==='shockwave'){stamp(5,d.x,d.y-15,d.len+35,75,1,.85);continue;}stamp(a.type==='dair'?4:1,d.x,d.y,d.len+30,45,d.face,.85,d.rot);}
 }
 function drawObjects(){for(const q of HumanRules.objects){if(q.kind==='launcher'){prop(41,q.x,q.y-19,130,80,-q.face);continue;}if(q.kind==='crate'){prop(40,q.x,q.y,45,45,q.face,q.age*.07);continue;}if(q.kind==='crash'){stamp(3,q.x,q.y-27,q.radius*2,85,1,Math.min(1,(q.life-q.age)/4));continue;}const face=Math.sign(q.vx)||q.face;stamp(0,q.x,q.y,75,42,face,Math.min(1,(q.life-q.age)/4),Math.atan2(q.vy,q.vx*face));}}
 function impact(v){stamp(7,v.x,v.y,45+v.power*4,45+v.power*4,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId==='human')text('→B ロープ：左右で振る／再入力で離す  ↑B カタパルト：発射前に方向指定',x+52,y+54,8,'#e8f6ff','left');}
 return{stamp,prop,draw,drawObjects,impact,hud};
})();

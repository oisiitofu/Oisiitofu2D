'use strict';
const FeiVFX=(()=>{
 // Textures 0/2/3/4/6 lead RIGHT. Translate -> reflect -> rotate locally.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.fei?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.guidedShot&&a.hold)stamp(3,f.x+f.face*32,f.y-63,28+a.charge*45,28+a.charge*45,f.face,.8);
  if(a.fukei&&a.launched){const face=f.vx<0?-1:1;stamp(4,f.x-f.vx*2,f.y-30,90,35,face,.45,Math.atan2(f.vy,f.vx*face||.01));}
  const w=CombatData.activeWindow(a,t);if(!w)return;for(const b of attackBoxes(f)){const d=AdolVFX.direction(b);if(w.shape==='shockwave'){stamp(5,d.x,d.y-17,d.len+30,72,1,.85);continue;}stamp(a.type==='dair'||a.feiDrop?6:0,d.x,d.y,d.len+30,48,d.face,.85,d.rot);}
 }
 function drawObjects(){for(const q of FeiRules.objects){if(q.kind==='earth'){stamp(5,q.x,q.groundY-35,85,90,1,Math.min(1,(q.life-q.age)/4));continue;}const face=Math.sign(q.vx)||q.face;stamp(q.kind==='wind'?4:q.charge>.5?3:2,q.x,q.y,q.kind==='wind'?75:q.radius*4,q.kind==='wind'?35:q.radius*2.5,face,Math.min(1,(q.life-q.age)/5),Math.atan2(q.vy,q.vx*face));}}
 function impact(v){stamp(1,v.x,v.y,45+v.power*4,45+v.power*4,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId==='fei')text('→B 連烈'+(f.attack?.comboStage?' '+f.attack.comboStage+'/3':'')+' / ↑B 風勁・再入力で軌道変更',x+52,y+54,8,'#bfe6ff','left');}
 return{stamp,draw,drawObjects,impact,hud};
})();

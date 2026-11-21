'use strict';
const LidVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const img=characterArt.lid?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(img,-w/2,-h/2,w,h);else AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){const a=f.attack;if(!a)return;if(a.lidHammer&&!a.release){stamp(2,f.x-f.face*32,f.y-55,58,38,-f.face,.4,0,true);return;}if(a.lidEscape&&f.timer>=8&&!a.exit)stamp(2,f.x-f.vx*3,f.y-18,70,35,-f.face,.7,0,true);
  if(a.special&&!a.lidHammer)return;
  if(!CombatData.activeWindow(a,f.timer))return;
  for(const b of attackVisualBoxes(f)){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;if(a.type==='downsmash'){stamp(1,f.x,f.y-48,210,125,1,.95);continue;}stamp(0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+32,b.radius*2.5,face,.95,Math.atan2(dy,dx*face));}
 }
 function drawObjects(){for(const q of LidRules.objects){if(q.kind==='bot')stamp(4,q.x,q.y,87,83,q.phase==='return'?-q.face:q.face,1,0,true);else if(q.kind==='ore')stamp(1,q.x,q.y,35,47,q.face,1,.3,true);else if(q.kind==='stone'){if(q.age<q.warning){ctx.save();ctx.strokeStyle='#eabf68';ctx.lineWidth=3;ctx.setLineDash([6,5]);ctx.beginPath();ctx.ellipse(q.x,q.y-3,q.radius+8,7,0,0,Math.PI*2);ctx.stroke();ctx.restore();}else stamp(1,q.x,q.y-51,110,130,q.face,Math.min(1,(q.life-q.age)/8),0,true);}}}
 function impact(v){stamp(0,v.x,v.y,46+v.power*2,42+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){if(f.characterId!=='lid')return;const level=Math.min(2,Math.floor((f.lidInvent||0)/35));text('発明 '+level+' / 2',x+150,y+15,10,'#ffd783');ctx.fillStyle='#614f32';ctx.fillRect(x+150,y+23,78,4);ctx.fillStyle='#ffc34c';ctx.fillRect(x+150,y+23,78*Math.min(1,(f.lidInvent||0)/70),4);if(lidBot(f))text('メカボ連携',x+150,y+40,9,'#94e8ff');}
 return{stamp,draw,drawObjects,impact,hud};
})();

'use strict';
const DanteVFX=(()=>{
 // Bullet and Stinger assets lead RIGHT; sword crescent has its convex edge
 // on RIGHT and hollow opening on LEFT. Hell Breaker is authored UP.
 // Canvas order: translate -> facing reflection -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.dante?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const source=n===2?-Math.PI/2:0,face=Math.cos(angle)<0?-1:1,rot=Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source;stamp(n,x,y,w,h,face,alpha,rot);}
 function draw(f){if(f.respawn)return;const a=f.attack;if(f.danteDevilTime>0)stamp(4,f.x,f.y-52,145,115,f.face,.20+.06*Math.sin(frame*.15));if(!a)return;if(a.devilTrigger&&f.timer>=18&&f.timer<=30)stamp(4,f.x,f.y-60,190,150,f.face,.85);if(a.styleIndex===3&&a.counterWindow&&f.timer>=6&&f.timer<=23)stamp(5,f.x+f.face*12,f.y-48,95,100,f.face,.65);if(a.styleIndex===2&&f.timer>=7&&f.timer<=17)stamp(5,f.x,f.y-45,105,50,f.face,.25);if(a.gunVolley||a.styleIndex===1){const t=f.timer;if([9,10,15,16,21,22,27,33,39].includes(t))directed(0,f.x+f.face*61,f.y-61,55,25,f.face>0?0:Math.PI,.8);return;}
  for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b),angle=Math.atan2(b.y2-b.y1,b.x2-b.x1);if(a.airStinger)directed(3,d.x,d.y,d.len+55,55,angle,.85);else if(a.devilTrigger)stamp(4,f.x,f.y-45,155,125,f.face,.7);else if(a.type==='upsmash')directed(2,d.x,d.y,60,d.len+35,angle,.85);else if([6,7,12,13].includes(b.window.pose??a.pose))directed(0,d.x,d.y,55,24,angle,.65);else directed(1,d.x,d.y,d.len+30,60,angle,.7);}
 }
 function drawObjects(){for(const q of DanteRules.objects)directed(0,q.x,q.y,44,16,Math.atan2(q.vy,q.vx),Math.min(1,(q.life-q.age)/6));}
 function impact(v){stamp(6,v.x,v.y,50+v.power*3,50+v.power*3,1,(v.life/v.max)**1.6);}
 function hud(f,x,y){if(f.characterId!=='dante')return;text('→B '+DanteStyles[f.danteStyle||0],x+245,y+27,9,'#ffc0bb','right');text(f.danteDevilTime>0?'DEVIL '+Math.ceil(f.danteDevilTime/60)+'s':f.danteDevilCooldown>0?'魔人化 '+Math.ceil(f.danteDevilCooldown/60)+'s':'↓B デビルトリガー',x+52,y+54,9,f.danteDevilTime>0?'#ff5d6e':'#b9c9dc','left');if(f.attack?.airStinger&&f.attack.phase==='hover')text('必殺を押し直して方向転換',f.x,f.y-125,11,'#ffe4e0');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

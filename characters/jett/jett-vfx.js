'use strict';
const JettVFX=(()=>{
 // Actual extracted paint reviewed in previews/effects.png: 0 convex RIGHT,
 // 1 convex UP, 2 two outward arcs LEFT and RIGHT; 4/5/6 point RIGHT,
 // 7 rises UP and 13 points DOWN. Local rotation, facing mirror, translation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.jett?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(a?.jettKnives&&!a.finished){for(let n=0;n<(f.jettKnives??5);n++){const angle=-2.7+n*.52;stamp(4,f.x+Math.cos(angle)*41,f.y-57+Math.sin(angle)*30,23,9,f.face,.8,0,true);}}
  if(f.jettSmokeExit>0)stamp(10,f.x-f.face*24,f.y-40,85,55,f.face,f.jettSmokeExit/32,0,true);
  if(!a||a.special||a.type==='grab'||a.type==='pummel'||a.type.endsWith('Throw'))return;
  const boxes=attackVisualBoxes(f).filter(b=>!b.meleeInner&&!b.upAttackExtra);if(!boxes.length)return;const left=Math.min(...boxes.flatMap(b=>[b.x1-b.radius,b.x2-b.radius])),right=Math.max(...boxes.flatMap(b=>[b.x1+b.radius,b.x2+b.radius])),top=Math.min(...boxes.flatMap(b=>[b.y1-b.radius,b.y2-b.radius])),bottom=Math.max(...boxes.flatMap(b=>[b.y1+b.radius,b.y2+b.radius])),x=(left+right)/2,y=(top+bottom)/2,w=right-left,h=bottom-top;
  if(['up','upsmash','uair'].includes(a.type)){stamp(1,x,y,Math.max(50,w),Math.max(30,Math.min(65,h)),f.face,.9);return;}
  if(a.type==='air'){stamp(2,x,y,w,Math.max(38,h),f.face,.9);return;}
  if(a.type==='dair'){stamp(13,x,y,w,h,f.face,.9);return;}
  if(['fair','smash'].includes(a.type)){stamp(5,x,y,w,h,f.face,.9);return;}
  stamp(0,x,y,w,h,a.type==='bair'||a.type==='downsmash'&&CombatData.activeWindow(a,f.timer)?.index===1?-f.face:f.face,.9);
 }
 function drawObjects(){for(const q of JettRules.objects){const alpha=Math.min(1,q.age/6,(q.life-q.age)/14);if(q.kind==='knife')stamp(4,q.x,q.y,q.last?58:40,q.last?18:13,q.face,1,Math.atan2(q.vy,q.vx*q.face),true);else if(q.kind==='smokeBall')stamp(8,q.x,q.y,33,24,q.face,.8,0,true);else if(q.kind==='smoke'){// Translucent smoke overlays every fighter equally: no intangible/hidden flags.
    stamp(9,q.x,q.y,q.radius*2.4,q.radius*2.05,1,alpha*.82,0,true);
   }else if(q.kind==='updraft')stamp(7,q.x,q.y-38,90,165,1,alpha*.75,0,true);else stamp(q.kind==='exit'?10:6,q.x,q.y,115,39,Math.sign(q.dx)||1,alpha*.75,Math.atan2(q.dy||0,Math.abs(q.dx||1)),true);}}
 function impact(v){stamp(3,v.x,v.y,25+v.power*2,25+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){for(let n=0;n<5;n++)stamp(4,x+156+n*22,y+28,21,9,1,n<(f.jettKnives??5)?1:.18,0,true);text('ナイフ '+(f.jettKnives??5)+'/5  風 '+Math.max(0,2-(f.jettDashUsed||0))+'/2',x+151,y+14,9,'#cff5ff');if(f.jettReload>0)text('補充 '+Math.floor(f.jettReload/90*100)+'%',x+151,y+43,8,'#8bdcf1');}
 return{stamp,draw,drawObjects,impact,hud};
})();

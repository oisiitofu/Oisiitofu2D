'use strict';
const OctaneVFX=(()=>{
 // Reviewed alpha paint: 9 convex RIGHT; 1 is the dedicated convex-UP
 // octane-upper.png canopy, replacing the dusty source U. 2 is two
 // separate short blade streaks. Rotation in local space, then facing mirror.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.octane?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(f.octaneStim>0&&Math.abs(f.vx)>3)stamp(12,f.x-f.face*30,f.y-45,100,30,f.face,.6,0,true);if(f.octanePadGlow>0)stamp(14,f.x,f.y+3,70,35,f.face,Math.min(1,f.octanePadGlow/12),0,true);
  if(!a||a.type==='grab'||a.type==='pummel'||a.type.endsWith('Throw')||a.special&&!a.octaneSlide)return;const boxes=attackVisualBoxes(f).filter(b=>!b.meleeInner&&!b.upAttackExtra);if(!boxes.length)return;const left=Math.min(...boxes.flatMap(b=>[b.x1-b.radius,b.x2-b.radius])),right=Math.max(...boxes.flatMap(b=>[b.x1+b.radius,b.x2+b.radius])),top=Math.min(...boxes.flatMap(b=>[b.y1-b.radius,b.y2-b.radius])),bottom=Math.max(...boxes.flatMap(b=>[b.y1+b.radius,b.y2+b.radius])),x=(left+right)/2,y=(top+bottom)/2,w=right-left,h=bottom-top;
  if(['up','upsmash','uair'].includes(a.type)){stamp(1,x,y,Math.max(50,w),Math.max(32,Math.min(70,h)),f.face,.9);return;}
  if(a.type==='air'){stamp(2,x,y,w,h,f.face,.9);return;}
  if(a.type==='dair'){stamp(10,x,y,w,h,f.face,.92);return;}
  if(['jab3','dashAttack'].includes(a.type)){stamp(3,x,y,w,h,f.face,.8);return;}
  stamp(9,x,y,w,h,a.type==='bair'||a.type==='downsmash'&&CombatData.activeWindow(a,f.timer)?.index===1?-f.face:f.face,.9);
  if(a.octaneSlide&&f.grounded)stamp(8,f.x-f.face*38,f.y,90,22,f.face,.7,0,true);
 }
 function drawObjects(){for(const q of OctaneRules.objects){const fade=Math.min(1,(q.life-q.age)/12);if(q.kind==='frag'){stamp(4,q.x,q.y,15,23,q.face,fade,frame*.08,true);if(q.age>14)stamp(15,q.x,q.y,15+(q.age%4)*3,15,1,.75,0,true);}else if(q.kind==='blast')stamp(5,q.x,q.y,q.radius*2.25,q.radius*2.25,1,fade,0,true);else if(q.kind==='pad'){stamp(6,q.x,q.y-9,q.radius*2+14,29,1,fade,0,true);}else if(q.kind==='launchGlow')stamp(11,q.x,q.y-29,70,85,1,fade*.8,0,true);else if(q.kind==='stimGlow')stamp(13,q.x,q.y,50,50,1,fade*.7,0,true);}}
 function impact(v){stamp(3,v.x,v.y,25+v.power*2,25+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){stamp(7,x+158,y+27,15,23,1,f.octaneStim>0?1:.3,0,true);text(f.octaneStim>0?'STIM '+(f.octaneStim/60).toFixed(1)+'s':'STIM / 下B',x+171,y+18,9,'#d5f99b');text('自己負担 '+(f.octaneSelfDebt||0).toFixed(1)+'%',x+151,y+37,9,'#d2dcbd');if(f.octaneAirPadUsed)text('PAD 着地で再使用',x+151,y+50,8,'#b7c0c6');}
 return{stamp,draw,drawObjects,impact,hud};
})();

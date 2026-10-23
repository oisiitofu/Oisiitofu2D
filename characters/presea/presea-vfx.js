'use strict';
const PreseaVFX=(()=>{
 // Actual paint: 0/2/10/15 convex RIGHT, 1 convex UP, 3 impact point
 // LEFT, 8 rising UP-RIGHT, 11 convex DOWN, 12 falling DOWN-RIGHT.
 // Source-local rotations precede the character's facing mirror.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.presea?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;if(a.preseaBrace&&preseaBraceReduction(f)<1)stamp(14,f.x,f.y-36,78,88,f.face,.65,0,true);if(a.preseaNB&&!a.released&&f.timer>30)stamp(14,f.x,f.y-37,68,76,f.face,.6,0,true);
  const b=attackVisualBoxes(f).filter(v=>!v.meleeInner&&!v.upAttackExtra);if(!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const left=Math.min(...b.flatMap(v=>[v.x1-v.radius,v.x2-v.radius])),right=Math.max(...b.flatMap(v=>[v.x1+v.radius,v.x2+v.radius])),top=Math.min(...b.flatMap(v=>[v.y1-v.radius,v.y2-v.radius])),bottom=Math.max(...b.flatMap(v=>[v.y1+v.radius,v.y2+v.radius])),x=(left+right)/2,y=(top+bottom)/2,w=right-left,h=bottom-top,active=CombatData.activeWindow(a,f.timer);
  if(a.preseaNB){stamp(4,x,y,w,h,f.face,.95,0,true);return;}if(a.preseaSide){if(active?.index===1)stamp(12,x,y,w,h,f.face,.95,0,true);else if(active?.index===0){stamp(2,f.x+f.face*45,y,w*.55,h,f.face,.9);stamp(2,f.x-f.face*45,y,w*.55,h,-f.face,.9);}else stamp(15,x,y,w,h,f.face,.95);return;}
  if(a.preseaRise||['up','upsmash','uair'].includes(a.type)){stamp(1,x,top+40,Math.max(112,w),80,f.face,.95);return;}
  if(a.type==='air'){stamp(2,f.x+f.face*42,y,w*.57,h,f.face,.9);stamp(2,f.x-f.face*42,y,w*.57,h,-f.face,.9);return;}
  if(['fair','dair'].includes(a.type)){stamp(12,x,y,w,h,f.face,.95,0,true);return;}
  const back=a.type==='bair'||a.type==='downsmash'&&active?.index===1;stamp(a.type==='smash'?15:0,x,y,w,h,back?-f.face:f.face,.95);
 }
 function drawObjects(){for(const q of PreseaRules.objects){if(q.age<q.delay)continue;const age=q.age-q.delay,alpha=Math.min(1,(q.life-q.age)/7);stamp(5+q.level,q.x,q.y,q.radius*2.5,q.radius*3,q.face,alpha,0,true);}}
 function impact(v){stamp(3,v.x,v.y,30+v.power*2,30+v.power*2,-(v.face||1),v.life/v.max,0,true);}
 function hud(){}
 return{stamp,draw,drawObjects,impact,hud};
})();

'use strict';
const HachiwareVFX=(()=>{
 // Extracted paint reviewed: 0 convex RIGHT, 1 convex UP, 2 paired commas,
 // 3 impact point LEFT (flopped locally), 12 thrust DOWN-RIGHT.
 // Rotate source-local art first, then mirror the fighter facing.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.hachiware?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;
  if(a.hachiPoke&&!a.released&&f.timer>=32)stamp(10,f.x+f.face*26,f.y-40,34,30,f.face,.55,0,true);
  if(a.hachiRise&&a.phase==='arc')stamp(8,f.x-f.face*20,f.y-30,72,80,f.face,.45,0,true);
  const b=attackVisualBoxes(f).filter(v=>!v.meleeInner&&!v.upAttackExtra);if(!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  const left=Math.min(...b.flatMap(v=>[v.x1-v.radius,v.x2-v.radius])),right=Math.max(...b.flatMap(v=>[v.x1+v.radius,v.x2+v.radius])),top=Math.min(...b.flatMap(v=>[v.y1-v.radius,v.y2-v.radius])),bottom=Math.max(...b.flatMap(v=>[v.y1+v.radius,v.y2+v.radius])),x=(left+right)/2,y=(top+bottom)/2,w=right-left,h=bottom-top,active=CombatData.activeWindow(a,f.timer);
  if(a.hachiPoke){stamp(a.charged?15:5,x,y,w,h,f.face,.95,0,true);return;}
  if(a.hachiSide){if(active?.index===1)stamp(12,x,y,w,h,f.face,.95,0,true);else stamp(3,x,y,w,h,-f.face,.95,0,true);return;}
  if(a.hachiRise){stamp(active?.index===2?8:1,x,top+Math.min(h,72)/2,w,Math.min(h,72),f.face,.9);return;}
  if(a.type==='air'){stamp(2,x,y,w,h,f.face,.95);return;}
  if(['up','jab3','upsmash','uair'].includes(a.type)){stamp(1,x,top+38,Math.max(95,w),76,f.face,.9);return;}
  if(a.type==='dair'){stamp(12,x,y,w,h,f.face,.9,0,true);return;}
  if(a.type==='dashAttack'||a.type==='low'){stamp(3,x,y,w,h,-f.face,.95,0,true);return;}
  const back=a.type==='bair'||a.type==='downsmash'&&active?.index===1;
  if(['jab','fair','bair'].includes(a.type))stamp(5,x,y,w,h,back?-f.face:f.face,.95,0,true);else stamp(0,x,y,w,h,back?-f.face:f.face,.9);
 }
 function drawObjects(){for(const q of HachiwareRules.objects)stamp(q.charged?7:6,q.x,q.y,q.radius*2,q.radius*2,q.face,Math.min(1,(q.life-q.age)/3),0,true);}
 function impact(v){stamp(3,v.x,v.y,26+v.power*2,26+v.power*2,-(v.face||1),v.life/v.max,0,true);}
 function hud(){}
 return{stamp,draw,drawObjects,impact,hud};
})();

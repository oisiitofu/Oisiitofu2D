'use strict';
const GranVFX=(()=>{
 // Transparent source inspected:0/2 convex RIGHT,1 UP,13 DOWN.
 // Normalize the directional source, rotate locally, then mirror for facing.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.gran?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);if(a?.granRaise)stamp(8,f.x,f.y-45,106,116,1,.35,0,true);if(a?.granWave&&!a.releaseAt&&f.timer>15)stamp(11,f.x+f.face*50,f.y-44,25+Math.min(30,f.timer),46,1,.7,0,true);if(a?.granRise&&a.fold)stamp(7,f.x,f.y-47,130,88,f.face,.4,0,true);if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(b.some(v=>v.window?.shape==='up')){stamp(1,f.x,f.y-119,180,100,f.face,.95);return;}
  if(b.some(v=>v.window?.shape==='spin')){stamp(3,f.x,f.y-44,210,92,1,.95);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,n=a.type==='smash'?2:0;stamp(n,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+32,Math.max(47,v.radius*2),face,.95,Math.atan2(dy,dx*face));}}
 function drawObjects(){for(const q of GranRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/5);if(q.kind==='wave')stamp(q.charged?5:4,q.x,q.y,q.charged?139:98,q.charged?67:45,q.face,fade,0,true);}}
 function impact(v){stamp(9,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){const lv=granLevel(f);text('ADEPT Lv'+lv,x+151,y+13,8,'#b4dfff');for(let n=0;n<4;n++){stamp(10,x+158+n*17,y+28,13,20,1,n<lv?1:.18,0,true);}ctx.fillStyle='#22405a';ctx.fillRect(x+151,y+42,76,3);ctx.fillStyle='#75cbff';ctx.fillRect(x+151,y+42,76*(granAdept(f)%25)/25,3);}
 return{stamp,draw,drawObjects,impact,hud};
})();

'use strict';
const RenaVFX=(()=>{
 // Inspected source: effect1 is U-shaped, convex DOWN. Rotate PI before facing.
 // 0/2 point RIGHT, 13 points down-right. 6/7 are beams/bursts, never curved slashes.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.rena?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);if(f.renaBuff>0)stamp(15,f.x,f.y-40,68,96,1,.25,0,true);if(a?.renaHeal)stamp(11,f.x,f.y-42,92,115,1,Math.min(.8,f.timer/35),0,true);if(a?.renaCross&&!a.releaseAt&&f.timer>15)stamp(4,f.x+f.face*40,f.y-52,30+Math.min(24,f.timer),70,1,.7,0,true);
  if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(a.type==='upsmash'||a.renaTractor){const outer=b.filter(v=>!v.meleeInner);const left=Math.min(...outer.map(v=>Math.min(v.x1,v.x2)-v.radius)),right=Math.max(...outer.map(v=>Math.max(v.x1,v.x2)+v.radius)),top=Math.min(...outer.map(v=>Math.min(v.y1,v.y2)-v.radius)),bottom=Math.max(...outer.map(v=>Math.max(v.y1,v.y2)+v.radius));stamp(a.renaTractor?10:6,(left+right)/2,(top+bottom)/2,right-left,bottom-top,1,.95,0,true);return;}
  if(a.type==='downsmash'){stamp(7,f.x,f.y-15,230,100,1,.95);return;}
  if(a.type==='up'){const v=b.find(v=>!v.meleeInner)||b[0];stamp(12,v.x2,v.y2,62,62,1,.95);return;}
  if(b.some(v=>v.window?.shape==='up')){stamp(1,f.x,f.y-121,155,94,f.face,.95,Math.PI);return;}
  if(b.some(v=>v.window?.shape==='spin')){stamp(3,f.x,f.y-44,172,90,1,.95);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,n=a.type==='smash'?2:a.type==='dair'?13:0;stamp(n,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+24,Math.max(40,v.radius*2),face,.95,Math.atan2(dy,dx*face)-(n===13?Math.PI/4:0));}}
 function drawObjects(){for(const q of RenaRules.objects){if(q.dead||q.kind==='tractor')continue;const fade=Math.min(1,(q.life-q.age)/5);if(q.kind==='cross')stamp(4,q.x,q.y,q.charged?62:70,q.charged?98:108,1,fade*Math.min(1,q.age/3),0,true);else if(q.kind==='gravity'){stamp(q.age<22?8:9,q.x,q.y,q.radius*2+20,q.age<22?95:150,1,fade,0,true);}else stamp(11,q.x,q.y,120,130,1,fade,0,true);}}
 function impact(v){stamp(12,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){text('MP '+Math.floor(renaMP(f))+(f.renaBuff>0?' FAIRY':''),x+151,y+13,8,'#b4f5ff');ctx.fillStyle='#12384c';ctx.fillRect(x+152,y+24,78,4);ctx.fillStyle='#74e7ff';ctx.fillRect(x+152,y+24,78*renaMP(f)/100,4);}
 return{stamp,draw,drawObjects,impact,hud};
})();

'use strict';
const AlphenVFX=(()=>{
 // Reviewed on transparent source: 0/2/4/5/6/11 RIGHT, 1/7 UP, 13 DOWN.
 // Rotate in character-local coordinates first, then mirror for facing.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.alphen?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);if(a?.alphenWind&&a.launchAt!=null&&f.timer-a.launchAt>=13&&f.timer-a.launchAt<23)stamp(7,f.x,f.y-70,140,165,1,.8,0,true);if(a?.alphenFlame&&!a.releaseAt)stamp(14,f.x,f.y-45,70,100,1,.7,0,true);
  if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(a.alphenFlame){const v=b.find(v=>!v.meleeInner)||b[0];stamp(a.level===2?10:2,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.abs(v.x2-v.x1)+v.radius*2,v.radius*2,f.face,.95);return;}
  if(b.some(v=>v.window?.shape==='up')){stamp(1,f.x,f.y-118,172,98,f.face,.95);return;}
  if(b.some(v=>v.window?.shape==='spin')){stamp(3,f.x,f.y-44,218,96,1,.95);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,n=a.type==='smash'?2:a.type==='dair'?13:0;stamp(n,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+30,Math.max(45,v.radius*2),face,.95,Math.atan2(dy,dx*face));}}
 function drawObjects(){for(const q of AlphenRules.objects){if(q.dead)continue;stamp(q.part?5:4,q.x,q.y-7,q.part?95:85,75,q.face,Math.min(1,(q.life-q.age)/8),0,true);}}
 function impact(v){stamp(9,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){if(!f.attack?.alphenFlame)return;const t=f.attack.releaseAt||f.timer,level=t>=48?2:t>=24?1:0;text('炎剣 Lv'+(level+1),x+151,y+13,9,'#ffc275');ctx.fillStyle='#4b2921';ctx.fillRect(x+152,y+24,78,4);ctx.fillStyle='#ff813d';ctx.fillRect(x+152,y+24,78*Math.min(1,t/70),4);}
 return{stamp,draw,drawObjects,impact,hud};
})();

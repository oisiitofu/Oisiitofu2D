'use strict';
const KaratekaVFX=(()=>{
 // Punch0 leads RIGHT; swoosh6's convex edge leads LEFT (SlashVFX normalizes it).
 // Source-local rotation is
 // applied before fighter reflection, then translated into world coordinates.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const im=characterArt.karateka?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;SlashVFX.image('karateka',n,im,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,vx,vy,w,h,alpha=1){const face=vx<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(vy,vx*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;for(const b of attackVisualBoxes(f)){if(['grab','pummel'].includes(a.type))continue;const kick=['heavy','low','smash','fair','bair','uair','dair'].includes(a.type),strong=a.type.includes('smash')||a.karateCounter||a.karateRush&&a.stage===3;directed(strong?1:kick?2:0,b.x2,b.y2,b.x2-b.x1,b.y2-b.y1,strong?54:40,strong?54:40,.92);if(kick)directed(6,(b.x1+b.x2)/2,(b.y1+b.y2)/2,b.x2-b.x1,b.y2-b.y1,Math.hypot(b.x2-b.x1,b.y2-b.y1),28,.5);}
  if(a?.karateRush){const t=f.timer,beat=(a.stage===1&&t>=13&&t<=19)||(a.stage===2&&t>=25&&t<=31);for(let k=0;k<3;k++)ellipse(f.x+(k-1)*12,f.y-112,3.5,3.5,k<a.stage?'#ffe956':'#71717c');if(beat)stamp(9,f.x,f.y-111,48,23,1,.85);}
  if(a?.karateStep&&f.timer>=4&&f.timer<=11)stamp(6,f.x-a.originFace*17,f.y-47,56,38,-a.originFace,.65);
  if(a?.karateLeap&&a.kickAt!=null&&f.timer-a.kickAt<8)stamp(8,f.x-f.face*18,f.y-12,50,50,1,.8);
  if(karatekaKi(f)){stamp(4,f.x,f.y-41,110,115,1,.2+.05*Math.sin(frame*.18));stamp(9,f.x,f.y-94,36,25,1,.7);}
  if(a?.karateKi&&f.timer>=12&&f.timer<=20)stamp(4,f.x,f.y-40,145,145,1,.65);
 }
 function drawObjects(){}
 function impact(v){stamp(v.power>10?1:0,v.x,v.y,30+v.power*1.7,30+v.power*1.7,v.face||1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='karateka')return;const active=karatekaKi(f),ready=!(f.karateKiCooldown>0);ctx.fillStyle='#353543';ctx.fillRect(x+158,y+20,82,7);ctx.fillStyle=active?'#ffe34d':ready?'#f5f5ff':'#9999ac';ctx.fillRect(x+158,y+20,82*(active?f.karateKiTime/240:ready?1:1-f.karateKiCooldown/600),7);text(active?'きあい '+Math.ceil(f.karateKiTime/60)+'秒':ready?'きあい 準備OK':'きあい あと'+Math.ceil(f.karateKiCooldown/60)+'秒',x+240,y+15,9,'#fff7c4','right');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

'use strict';
const KyVFX=(()=>{
 // Source convex edges: 0/2 RIGHT, 1 UP, 13 DOWN. Ring7 is a prop,
 // not a directional slash. Rotate locally, then mirror for facing.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.ky?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);if(f.kyInstallTime>0)stamp(10,f.x,f.y-48,86,118,1,.3,0,true);if(a?.kyInstall)stamp(10,f.x,f.y-48,100,124,1,Math.min(.65,f.timer/22),0,true);
  if(a?.kyEdge&&!a.releaseAt&&f.timer>15)stamp(11,f.x+f.face*46,f.y-52,30+Math.min(30,f.timer),46,1,.7,0,true);
  if(a?.kyRide&&a.launchAt!=null&&f.timer-a.launchAt<33)stamp(7,f.x,f.y-48,142,100,f.face,.55,0,true);
  if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(['jab','up','dashAttack'].includes(a.type)){const v=b.find(v=>!v.meleeInner)||b[0];stamp(12,v.x2,v.y2,55,55,1,.95);return;}
  if(b.some(v=>v.window?.shape==='up')){stamp(1,f.x,f.y-118,172,98,f.face,.95);return;}
  if(b.some(v=>v.window?.shape==='spin')){stamp(3,f.x,f.y-44,205,92,1,.95);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,n=a.type==='smash'?2:a.type==='dair'?13:0;stamp(n,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+30,Math.max(45,v.radius*2),face,.95,Math.atan2(dy,dx*face));}}
 function drawObjects(){for(const q of KyRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/5);if(q.kind==='edge')stamp(q.charged?5:4,q.x,q.y,q.charged?130:95,q.charged?65:44,q.face,fade,0,true);else if(q.kind==='bolt')stamp(6,q.x,q.y-23,q.radius*2+20,150,1,fade,0,true);else if(q.kind==='trace'){const dx=q.toX-q.x,dy=q.toY-q.y;stamp(14,(q.x+q.toX)/2,(q.y+q.toY)/2,Math.hypot(dx,dy),40,1,fade,Math.atan2(dy,dx),true);}else stamp(q.kind==='shock'?11:10,q.x,q.y,q.kind==='shock'?105:110,120,1,fade,0,true);}
  for(const f of fighters)if(f.kyShockTime>0&&!f.respawn){stamp(8,f.x,f.y-f.character.ecb.height-25,22,30,1,.85+.15*Math.sin(frame*.2),0,true);}}
 function impact(v){stamp(9,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){text(f.kyInstallTime>0?'DRAGON '+(f.kyInstallTime/60).toFixed(1)+'s':'TENSION '+Math.floor(kyTension(f))+'%',x+151,y+13,8,'#b4dfff');ctx.fillStyle='#142f52';ctx.fillRect(x+152,y+24,78,4);ctx.fillStyle=f.kyInstallTime>0?'#e7f7ff':'#5bb8ff';ctx.fillRect(x+152,y+24,78*(f.kyInstallTime>0?f.kyInstallTime/600:kyTension(f)/100),4);}
 return{stamp,draw,drawObjects,impact,hud};
})();

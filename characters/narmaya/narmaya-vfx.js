'use strict';
const NarmayaVFX=(()=>{
 // Reviewed actual source: 0/4 convex RIGHT, 1 UP, 13 DOWN.
 // Curves are normalized locally, rotated, then mirrored for fighter facing.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.narmaya?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);if(a?.narmayaNB&&!a.kagura&&!a.releaseAt&&f.timer>15)stamp(9,f.x+f.face*20,f.y-49,35,35,1,.5,0,true);if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(b.some(v=>v.window?.shape==='up')){stamp(1,f.x,f.y-120,177,96,f.face,.95);return;}
  if(b.some(v=>v.window?.shape==='spin')){stamp(3,f.x,f.y-43,208,88,1,.9);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1;stamp(a.narmayaNB&&!a.kagura?2:a.kagura?4:0,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+30,Math.max(47,v.radius*2),face,.95,Math.atan2(dy,dx*face));}
 }
 function drawObjects(){for(const q of NarmayaRules.objects){if(!q.dead)stamp(q.kind==='mist'?8:7,q.x,q.y,q.kind==='mist'?110:80,90,1,Math.min(1,(q.life-q.age)/7),0,true);}}
 function impact(v){stamp(12,v.x,v.y,35+v.power*2,35+v.power*2,1,v.life/v.max,0,true);}
 function hud(f,x,y){text(narmayaKagura(f)?'神楽 KAGURA':'居合い GENJI',x+151,y+14,8,narmayaKagura(f)?'#ffb8f0':'#d9c8ff');}
 return{stamp,draw,drawObjects,impact,hud};
})();

'use strict';
const AshVFX=(()=>{
 // Reviewed on transparent source: 0/4/5/6 RIGHT, 1/7 UP, 13 DOWN. FX2 is a symmetric X.
 // Rotate in character-local coordinates first, then mirror for facing.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.ash?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);
  if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(a.ashLight&&f.timer>=a.launchAt+20){for(const v of b)stamp(7,f.x,f.y-110,85,210,1,.95);return;}if(a.ashRupture){stamp(10,f.x+f.face*100,f.y-30,205,90,f.face,.95);return;}
  if(b.some(v=>v.window?.shape==='up')){stamp(1,f.x,f.y-118,172,98,f.face,.95);return;}
  if(b.some(v=>v.window?.shape==='spin')){stamp(3,f.x,f.y-44,218,96,1,.95);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,n=a.type==='smash'?2:a.type==='dair'?13:0;stamp(n,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+30,Math.max(45,v.radius*2),face,.95,Math.atan2(dy,dx*face));}}
 function drawObjects(){for(const q of AshRules.objects){if(q.dead)continue;stamp(q.part?5:4,q.x,q.y-7,q.part?95:85,75,q.face,Math.min(1,(q.life-q.age)/8),0,true);}}
 function impact(v){stamp(9,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(){}
 return{stamp,draw,drawObjects,impact,hud};
})();

'use strict';
const RionVFX=(()=>{
 // Visible convex axes: 0/2/4/5 RIGHT, 1 UP, 7/13 DOWN. Rotate locally then mirror.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.rion?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);if(a?.rionGuard&&f.timer>=6)stamp(10,f.x,f.y-48,85,100,1,.8,0,true);else if(f.rionGuardTime>0)stamp(14,f.x,f.y-45,55,75,1,.5,0,true);
  if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(b.some(v=>v.window?.shape==='up')){stamp(a.rionIllusion?7:1,f.x,f.y-116,165,94,f.face,.95);return;}
  if(b.some(v=>v.window?.shape==='spin')){stamp(3,f.x,f.y-44,210,90,1,.95);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,n=a.type==='smash'?2:a.type==='jab3'?11:a.type==='dair'?13:0;stamp(n,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+30,Math.max(45,v.radius*2),face,.95,Math.atan2(dy,dx*face));}
 }
 function drawObjects(){for(const q of RionRules.objects){if(q.dead)continue;const alpha=Math.min(1,(q.life-q.age)/8);if(q.kind==='wave')stamp(q.part?5:4,q.x,q.y-7,85+(q.part?10:0),75,q.face,alpha,0,true);else if(q.kind==='illusion')stamp(6,q.x,q.y,145,55,q.face,alpha,0,true);else if(q.kind==='sigil')stamp(10,q.x,q.y,90+q.age,100+q.age,1,alpha*.75,0,true);}}
 function impact(v){stamp(9,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){if(f.characterId!=='rion')return;const cc=Math.floor(rionCC(f));text('CC '+cc+'/4',x+150,y+13,9,'#b1d7ff');for(let k=0;k<4;k++)stamp(8,x+160+k*18,y+27,16,19,1,k<cc?1:.2,0,true);ctx.fillStyle='#253d5c';ctx.fillRect(x+152,y+39,72,2);ctx.fillStyle='#9cd3ff';ctx.fillRect(x+152,y+39,cc>=4?72:72*(f.rionCCClock||0)/90,2);if(f.rionGuardTime>0)text('獣哮雷',x+150,y+52,8,'#a4efff');}
 return{stamp,draw,drawObjects,impact,hud};
})();

'use strict';
const DanaVFX=(()=>{
 // Source 0/2 are convex RIGHT; source 1 is convex UP. Local rotation, then world facing.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const im=characterArt.dana?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,boxes=attackVisualBoxes(f);
  if(a&&boxes.length&&!['grab','pummel'].includes(a.type)&&!a.type.endsWith('Throw')){
   if(boxes.some(b=>b.window?.shape==='up'))stamp(1,f.x,f.y-105,145,84,f.face,.92);
   else if(boxes.some(b=>b.window?.shape==='spin'))stamp(8,f.x,f.y-45,162,100,f.face,.9);
   else for(const b of boxes.flatMap(b=>SlashVFX.outward(f,b))){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;stamp(a.type==='smash'?2:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+28,Math.max(40,b.radius*2),face,.92,Math.atan2(dy,dx*face));}
  }
  if(a?.danaPass&&f.timer>=8&&f.timer<20)stamp(11,f.x-f.face*38,f.y-43,115,48,f.face,.45);
  if(a?.danaRise&&a.launchAt!==undefined&&f.timer-a.launchAt<28)stamp(3,f.x,f.y-45,145,140,f.face,.45);
  if(a?.danaPrayer&&f.timer>8){stamp(5,f.x,f.y-50,86,115,f.face,.62);stamp(4,f.x,f.y-3,100,45,1,.7);}
  if(f.danaMoonTime>0&&!a?.danaPrayer)stamp(6,f.x,f.y-40,95,110,1,.16+.05*Math.sin(frame*.08));
 }
 function drawObjects(){}
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='dana'||!f.danaMoonTime)return;text('古代の祈り',x+154,y+19,10,'#c3ecff');ctx.fillStyle='#82d6ff';ctx.fillRect(x+154,y+24,75*f.danaMoonTime/480,4);}
 return{stamp,draw,drawObjects,impact,hud};
})();

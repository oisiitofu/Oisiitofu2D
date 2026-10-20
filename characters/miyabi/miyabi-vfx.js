'use strict';
const MiyabiVFX=(()=>{
 // Source 0/2/5/6/7 cut to the RIGHT, source 1 convex UP; rotate locally, then mirror.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.miyabi?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,boxes=attackVisualBoxes(f);if(a?.miyabiIaido&&f.timer<a.releaseAt)stamp(14,f.x,f.y-40,65+a.level*15,85,1,.5,0,true);
  if(!a||!boxes.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  const n=a.activeFrames.find(w=>f.timer>=w.start&&f.timer<=w.end)?.index;
  if(a.miyabiChain&&n===4){stamp(4,f.x,f.y-45,330,125,1,.95);return;}
  if(a.miyabiChain&&n===3){stamp(3,f.x+f.face*72,f.y-44,190,145,f.face,.95);return;}
  if(boxes.some(b=>b.window?.shape==='up')){stamp(1,f.x,f.y-110,155,93,f.face,.95);return;}
  if(boxes.some(b=>b.window?.shape==='spin')){stamp(4,f.x,f.y-44,190,90,1,.9);return;}
  for(const b of boxes.flatMap(b=>SlashVFX.outward(f,b))){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1,index=a.miyabiIaido?4+a.level:a.ex?2:0;stamp(index,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+28,Math.max(44,b.radius*2),face,.95,Math.atan2(dy,dx*face));}
 }
 function drawObjects(){}
 function impact(v){stamp(9,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='miyabi')return;const n=Math.floor(f.miyabiFrost||0);text('落霜 '+n+'/6',x+150,y+14,9,'#a7e5ff');for(let k=0;k<6;k++)stamp(8,x+158+k*13,y+27,11,16,1,k<n?1:.22,0,true);ctx.fillStyle='#31576a';ctx.fillRect(x+151,y+38,78,2);ctx.fillStyle='#a9e9ff';ctx.fillRect(x+151,y+38,n>=6?78:78*(f.miyabiClock||0)/600,2);}
 return{stamp,draw,drawObjects,impact,hud};
})();

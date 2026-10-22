'use strict';
const ShionneVFX=(()=>{
 // Source0 bulges right. The upward effect1 is three bullets; it is NOT an
 // upper slash and must never be reshaped into the shared upper canopy.
 // Source8 is a DOWNWARD muzzle blast. Local rotation precedes face mirroring.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.shionne?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function extent(boxes){return{left:Math.min(...boxes.flatMap(b=>[b.x1-b.radius,b.x2-b.radius])),right:Math.max(...boxes.flatMap(b=>[b.x1+b.radius,b.x2+b.radius])),top:Math.min(...boxes.flatMap(b=>[b.y1-b.radius,b.y2-b.radius])),bottom:Math.max(...boxes.flatMap(b=>[b.y1+b.radius,b.y2+b.radius]))};}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);
  if(a?.shionneBomb&&!a.released&&f.timer>22)stamp(12,f.x+f.face*30,f.y-60,20,20,1,.7,0,true);
  if(a?.shionneHeal)stamp(10,f.x,f.y-36,80,100,1,Math.min(.6,f.timer/45),0,true);
  if(f.shionneThorns>0)stamp(11,f.x+f.face*85,f.y-40,60,78,f.face,f.shionneThorns/12,0,true);
  if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  const all=b.filter(v=>!v.meleeInner),box=extent(all.length?all:b),x=(box.left+box.right)/2,y=(box.top+box.bottom)/2,width=box.right-box.left,height=box.bottom-box.top;
  if(a.type==='air'){stamp(13,f.x+f.face*66,f.y-55,88,40,f.face,.9,-.15,true);stamp(14,f.x+f.face*118,f.y-55,25,28,f.face,.8,0,true);return;}
  if(['upsmash','uair'].includes(a.type)){stamp(1,x,y,width,height,f.face,.95,0,true);return;}
  if(a.type==='downsmash'){stamp(7,x,y,width,height,1,.9,0,true);return;}
  if(a.type==='dair'||a.shionneRecoil){stamp(8,x,y,width,height,f.face,.95,0,true);return;}
  if(a.type==='smash'){stamp(3,x,y,width,height,f.face,.95,0,true);return;}
  if(['jab3','bair'].includes(a.type)){stamp(2,x,y,width,height,a.type==='bair'?-f.face:f.face,.95,0,true);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1;stamp(0,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+30,Math.max(34,v.radius*2),face,.9,Math.atan2(dy,dx*face));}
 }
 function drawObjects(){for(const q of ShionneRules.objects){if(q.age<=(q.delay||0))continue;const alpha=Math.min(1,(q.life-q.age)/5);if(q.kind==='bomb')stamp(4,q.x,q.y,22,25,q.face,alpha,0,true);else if(q.kind==='explosion')stamp(5,q.x,q.y,q.radius*2,q.radius*2,1,alpha,0,true);else if(q.kind==='heal')stamp(9,q.x,q.y-31,q.radius*2,76,1,alpha*.65,0,true);else if(q.kind==='recoil')stamp(8,q.x,q.y,42,64,q.face,alpha,0,true);else stamp(q.fx,q.x,q.y,q.kind==='snipe'?130:58,q.kind==='snipe'?22:18,q.face,alpha,0,true);}}
 function impact(v){stamp(14,v.x,v.y,32+v.power*2,32+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){text('BLAST '+Math.floor(shionneBlast(f))+'/3',x+149,y+14,9,'#ffc8e8');for(let n=0;n<3;n++){ctx.fillStyle=n<Math.floor(shionneBlast(f))?'#ffc2e9':'#3c2f49';ctx.fillRect(x+151+n*24,y+24,18,8);}text('HEAL '+Math.max(0,15-(f.shionneHealed||0)).toFixed(0),x+149,y+48,8,'#b6efd7');}
 return{stamp,draw,drawObjects,impact,hud};
})();

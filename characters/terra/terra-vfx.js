'use strict';
const TerraVFX=(()=>{
 // Sources were inspected as painted: crescents 0/1/30 convex RIGHT,
 // canopy3 convex UP, ice7 DOWN-RIGHT. Local rotation precedes facing mirror.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.terra?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function extent(b){return{left:Math.min(...b.flatMap(v=>[v.x1-v.radius,v.x2-v.radius])),right:Math.max(...b.flatMap(v=>[v.x1+v.radius,v.x2+v.radius])),top:Math.min(...b.flatMap(v=>[v.y1-v.radius,v.y2-v.radius])),bottom:Math.max(...b.flatMap(v=>[v.y1+v.radius,v.y2+v.radius]))};}
 function draw(f){if(f.respawn)return;const a=f.attack;
  if(terraTrans(f))stamp(22,f.x,f.y-47,85,115,1,.16,0,true);
  if(a?.terraMeltdown&&!a.released&&f.timer>12){const r=14+Math.min(55,f.timer)*.3;stamp(a.powered?16:8,f.x+f.face*38,f.y-46,r*2,r*1.5,f.face,.8,0,true);}
  if(a?.terraTornado&&['spiral','merge'].includes(a.phase))stamp((a.phase==='merge'?13:12)+(a.powered?8:0),f.x,f.y-65,a.phase==='merge'?160:120,150,f.face,.85,0,true);
  const b=attackVisualBoxes(f);if(!a||!b.length||a.terraTornado||['grab','pummel','downsmash'].includes(a.type)||a.type.endsWith('Throw'))return;
  const outer=b.filter(v=>!v.meleeInner&&!v.upAttackExtra),box=extent(outer.length?outer:b),x=(box.left+box.right)/2,y=(box.top+box.bottom)/2,w=box.right-box.left,h=box.bottom-box.top;
  if(a.type==='air'){stamp(4,x,y,w,h,f.face,.95);stamp(0,f.x+f.face*48,y,88,h,f.face,.85);return;}
  if(a.type==='up'){stamp(3,x,box.top+Math.min(h,76)/2,Math.max(124,w),Math.min(76,h),f.face,.95);return;}
  if(a.type==='upsmash'){stamp(29,x,y,Math.max(50,w),h,f.face,.95,0,true);return;}
  if(a.type==='uair'){stamp(6,x,y,w,h,f.face,.95,0,true);return;}
  if(a.type==='dair'){stamp(7,x,y,w,h,f.face,.95,0,true);return;}
  if(a.type==='fair'){if(!a.terraSpawned?.has('holy'))stamp(5,x,y,w,h,f.face,.95,0,true);return;}
  const face=a.type==='bair'?-f.face:f.face,n=({jab:0,jab2:1,jab3:2,heavy:1,low:0,dashAttack:1,smash:30,bair:0})[a.type];if(n!==undefined)stamp(n,x,y,w,h,face,.95);
 }
 function drawObjects(){for(const q of TerraRules.objects){if(q.age<=(q.delay||0))continue;const alpha=Math.min(1,(q.life-q.age)/5);
  if(q.kind==='flood'){const stage=Math.min(q.path.length-1,Math.floor((q.age-1)/6)),p=q.columns[q.path[stage]],h=q.powered?184:160;stamp(q.powered?19:11,p.x,p.y-h/2,64,h,q.face,alpha,0,true);}
  else if(q.kind==='meltdown')stamp((q.powered?16:8)+(q.stage||1)-1,q.x,q.y,q.radius*3.2,q.radius*2,q.face,alpha,0,true);
  else if(q.kind==='holy')stamp(25,q.x,q.y,38,30,q.face,alpha,0,true);
  else if(q.kind==='gravity')stamp(14,q.x,q.y,q.radius*2,q.radius*2,1,alpha*(q.age<7?.65:1),0,true);
  else if(q.kind==='ultima')stamp(15,q.x,q.y,q.radius*2,q.radius*2,1,alpha,0,true);
  else if(q.kind==='transform')stamp(23,q.x,q.y,120,120,1,alpha,0,true);
  else if(q.kind==='icepop')stamp(28,q.x,q.y,85,75,1,alpha,0,true);
 }}
 function impact(v){stamp(26,v.x,v.y,28+v.power*2,28+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){const active=terraTrans(f),v=active?f.terraTrance/540:terraGauge(f)/100;ctx.save();ctx.fillStyle='#24142e';ctx.fillRect(x+152,y+27,105,10);ctx.fillStyle=active?'#ff75db':'#b5e8c8';ctx.fillRect(x+153,y+28,103*v,8);ctx.restore();stamp(24,x+268,y+31,20,24,1,active?1:.65,0,true);text(active?'TRANCE '+(f.terraTrance/60).toFixed(1)+'s':'トランス '+Math.floor(v*100)+'%',x+151,y+18,10,active?'#ffb6ec':'#d5f9e5');text(active?'下B アルテマ・解除':'100%で下B',x+151,y+51,8,'#f2d7ed');}
 return{stamp,draw,drawObjects,impact,hud};
})();

'use strict';
const MagusLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('magus',['cutin','effects']);
 const shots=[
  [0,420,672,1090,671,760,430,.94,0,0],[35,709,672,1090,671,900,436,.96,0,2],
  [47,899,671,1114,657,1006,432,1,.02,18],[65,1011,590,1159,610,1085,397,.94,-.019,8],
  [84,1164,374,1173,554,1168,313,.89,.026,23],[104,951,402,1229,555,1090,350,.87,-.023,33],
  [124,961,433,1270,552,1115,355,.92,.02,44],[145,815,457,1299,607,1057,383,.88,-.019,43],
  [168,756,423,1334,654,1043,390,.84,0,14],[190,764,359,1337,628,1050,344,.83,-.013,31],
  [209,788,361,1337,621,1063,345,.94,.024,33],[245,793,672,1835,322,1243,398,.76,0,0]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function draw({attacker,target:opponent,face,time}){
  const t=MagusLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...MagusLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,209,6,25),charge=pulse(t,190,25,21);
  frameClip();
  const sky=ctx.createRadialGradient(W*.56,H*.34,14,W*.56,H*.34,W*.77);
  sky.addColorStop(0,'#603979');sky.addColorStop(.59,'#321f55');sky.addColorStop(1,'#151027');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.53,finish));
  for(let i=0;i<13;i++){
   const px=i*346-1100,py=196+i%4*48;
   ctx.fillStyle=i%2?'#2e1d44':'#3b2452';ctx.beginPath();ctx.moveTo(px,676);
   ctx.lineTo(px,py+67);ctx.lineTo(px+77,py);ctx.lineTo(px+172,py+67);ctx.lineTo(px+172,676);ctx.fill();
  }
  ctx.fillStyle='#2d203f';ctx.fillRect(-1900,675,6300,620);
  art.glow(3,tx,ty-142,690,463,charge*.66,t*.022);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.12);
  target(opponent,tx,ty-hit*14,-.11-hit*.37-ease((t-210)/29)*1.36,2.56);
  for(const [i,h] of hits.entries())art.strike([0,0,0,1,0,2][i],tx-11,ty-118,413+i*13,338,pulse(t,h,4,9),[.3,-.62,1.02,.09,-.72,.51][i]);
  const radius=123+ease((t-207)/15)*344;
  ctx.save();ctx.globalAlpha=finish*.88;ctx.strokeStyle='#cc7eff';ctx.lineWidth=5;
  ctx.beginPath();ctx.ellipse(tx,ty-142,radius,radius*.71,-.2,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<13;i++){
   const a=i*2.4+t*.06;
   const px=tx+Math.cos(a)*radius,py=ty-141+Math.sin(a)*radius*.71;
   ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+Math.cos(a)*59,py+Math.sin(a)*45);ctx.stroke();
  }
  ctx.restore();
  art.strike(3,tx,ty-140,483+ease((t-208)/19)*421,517,finish,.22);
  const fracture=pulse(t,213,4,13);
  ctx.save();ctx.globalAlpha=fracture*.84;ctx.strokeStyle='#ebc0ff';ctx.lineWidth=5;
  for(const angle of [-2.47,-1.3,.24,1.39,2.49]){
   ctx.save();ctx.translate(tx,ty-140);ctx.rotate(angle);
   const reach=98+ease((t-210)/13)*394;
   ctx.beginPath();ctx.moveTo(reach*.36,0);ctx.lineTo(reach*.58,-22);ctx.lineTo(reach*.7,12);
   ctx.lineTo(reach,0);ctx.stroke();ctx.restore();
  }
  ctx.restore();
  ctx.restore();flash('192,153,255',Math.max(hit*.1,finish*.22));bands(t,'#190e2e');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,169+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

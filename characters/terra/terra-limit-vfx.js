'use strict';

const TerraLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('terra',['cutin','effects']);
 const shots=[
  [0,440,673,1059,674,770,420,.93,0,1],[32,669,673,1059,674,861,433,.98,-.011,22],
  [46,862,673,1068,661,963,438,1,.023,17],[63,833,673,1078,623,953,412,.97,-.021,36],
  [83,725,666,1098,552,914,366,.88,.016,25],[98,691,567,1107,565,908,362,.87,0,39],
  [104,833,468,1122,545,979,333,.9,.022,42],[123,1011,363,1175,528,1095,306,.86,-.027,30],
  [144,1268,428,1157,566,1210,350,.87,.026,-28],[162,1421,502,1174,620,1289,380,.84,-.017,-38],
  [185,1381,608,1164,646,1293,393,.81,0,-32],[206,1374,596,1136,636,1249,402,.84,.019,-34],
  [224,1365,645,772,390,1070,404,.78,-.008,-41],[238,1352,673,572,307,1060,427,.76,0,-1]
 ];
 const hits=[46,63,83,104,123,144];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=TerraLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9)));
  const flare=pulse(t,206,7,23),shift=pulse(t,95,11,12),returnGlow=pulse(t,229,6,8);
  frameClip();
  const sky=ctx.createRadialGradient(W*.53,H*.42,30,W*.53,H*.42,W*.72);
  sky.addColorStop(0,t>=95?'#733457':'#343f61');sky.addColorStop(.63,'#282444');sky.addColorStop(1,'#111223');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.6,flare));
  for(let i=0;i<15;i++){
   const bx=i*284-1120,by=345-i%4*73;
   ctx.fillStyle=i%2===0?'#221b35':'#302641';
   ctx.beginPath();ctx.moveTo(bx-76,671);ctx.lineTo(bx+13,by+103);ctx.lineTo(bx+69,by);
   ctx.lineTo(bx+154,by+79);ctx.lineTo(bx+183,671);ctx.fill();
  }
  ctx.fillStyle='#33283d';ctx.fillRect(-1700,675,5900,520);
  ctx.strokeStyle='#a55567';ctx.lineWidth=4;
  ctx.beginPath();ctx.moveTo(-1700,675);ctx.lineTo(4100,675);ctx.stroke();
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,
   inv:0,intangible:0,terraTrance:t<95?attacker.terraTrance:t<229?1:attacker.terraTrance};
  art.glow(3,x,y-120,530,454,Math.max(shift,returnGlow)*.9);
  drawSprite(sprite,1,Math.abs(pose)-1,3.1);
  target(opponent,tx,ty-impact*18,-.08-impact*.31+ease((t-207)/27)*1.39,2.6);
  for(const [i,hit] of hits.entries()){
   const slot=[0,1,2,3,0,3][i],power=pulse(t,hit,slot===1?6:4,10);
   art.strike(slot,tx-6,ty-(slot===2?281:118),slot===2?285:385,slot===2?570:295,power,slot===0?-.35:0);
  }
  const fromX=x-95,fromY=y-142,dx=tx-fromX,dy=ty-122-fromY;
  art.strike(3,fromX+dx*.5,fromY+dy*.5,Math.hypot(dx,dy)+230,371,flare,Math.atan2(dy,dx));
  const burn=ease((t-205)/5)*(1-ease((t-209)/19));
  art.strike(3,tx-133,ty-129,670+220*ease((t-207)/14),302,burn,Math.PI+.08);
  const wave=135+ease((t-204)/21)*620;
  ctx.save();ctx.globalAlpha=flare*.84;ctx.strokeStyle='#ffc389';ctx.lineWidth=7;
  ctx.beginPath();ctx.ellipse(tx,ty-77,wave,wave*.39,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  ctx.restore();flash('255,175,175',Math.max(impact*.1,shift*.25,flare*.23,returnGlow*.18));bands(t,'#161328');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,155+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

"use strict";

const NightsLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('nights',['cutin','court','poses','motion','effects']);
 const shots=[
  [0,590,660,1100,600,855,410,.95,0,0],
  [35,650,620,1100,600,870,385,.94,0,0],
  [56,820,370,1100,565,1000,375,.92,.014,0],
  [70,760,505,1100,555,1060,420,.74,0,1],
  [135,760,505,1110,555,1130,415,.71,0,4],
  [197,760,505,1100,555,1080,420,.72,.013,4],
  [214,830,390,1080,550,1090,395,.77,0,1],
  [231,1110,255,1065,545,1100,375,.76,0,2],
  [252,1410,250,1070,540,1190,375,.75,0,2],
  [280,1540,260,1070,540,1270,390,.77,0,4],
  [299,1480,265,1070,540,1250,390,.76,0,5],
  [310,1240,390,1060,540,1140,405,.73,-.016,5],
  [328,900,560,1280,430,1090,400,.76,0,6],
  [349,925,575,1590,285,1240,380,.74,0,7],
  [365,945,575,1810,195,1340,365,.74,0,7]
 ];
 const pulse=(time,start,peak,hold,end)=>ease((time-start)/(peak-start))*(1-ease((time-hold)/(end-hold)));

 function loopPosition(time){
  const phase=Math.PI+2*Math.PI*Math.max(0,Math.min(1,(time-70)/127));
  return {x:1100+340*Math.cos(phase),y:505+215*Math.sin(phase),phase};
 }

 function drawTrail(time){
  if(time<70||time>238)return;
  const fade=1-ease((time-197)/41);
  ctx.save();
  ctx.beginPath();
  for(let frame=70;frame<=Math.min(time,197);frame+=2){
   const p=loopPosition(frame);
   if(frame===70)ctx.moveTo(p.x,p.y);
   else ctx.lineTo(p.x,p.y);
  }
  if(time>=197)ctx.closePath();
  ctx.globalAlpha=fade*.24;
  ctx.strokeStyle='#a16aff';
  ctx.lineWidth=18;
  ctx.stroke();
  ctx.globalAlpha=fade*.9;
  ctx.strokeStyle='#dfd3ff';
  ctx.lineWidth=5;
  ctx.stroke();
  ctx.fillStyle='#ffdf87';
  for(let frame=70;frame<=Math.min(time,197);frame+=8){
   const p=loopPosition(frame);
   const size=4+2*Math.sin(frame*.73);
   ctx.beginPath();
   ctx.moveTo(p.x,p.y-size*2);
   ctx.lineTo(p.x+size,p.y);
   ctx.lineTo(p.x,p.y+size*2);
   ctx.lineTo(p.x-size,p.y);
   ctx.closePath();
   ctx.fill();
  }
  ctx.restore();
 }

 function drawActor(time){
  const shot=camera(shots,time);
  let [x,y,,,,,,,pose]=shot;
  let direction=time>=280&&time<329?-1:1;
  if(time>=70&&time<=197){
   const flight=loopPosition(time);
   x=flight.x;
   y=flight.y;
   const horizontal=-Math.sin(flight.phase);
   const vertical=Math.cos(flight.phase);
   direction=horizontal>=0?1:-1;
   pose=Math.abs(horizontal)<.23?4:vertical<-.34?1:vertical>.34?3:2;
  }
  art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,515,{face:direction,anchorY:.70});
 }

 function draw({target:opponent,face,time}){
  const t=NightsLimitProfile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll]=camera(shots,t);
  const first=pulse(t,50,56,58,67);
  const closure=Math.max(...[197,214,231,252].map(hit=>pulse(t,hit-3,hit,hit+2,hit+12)));
  const finish=pulse(t,305,310,317,337);
  frameClip();
  ctx.fillStyle='#14112d';
  ctx.fillRect(0,0,W,H);
  art.image('court',-65,-55,W+130,H+110);
  world(cx,cy,zoom,roll,face,t,Math.max(first*.4,closure*.5,finish));
  drawTrail(t);
  art.strike(0,tx-95,ty-100,520,420,first);
  art.strike(1,tx,ty-115,690-140*ease((t-197)/55),550-90*ease((t-197)/55),closure);
  art.glow(2,x,y-105,310,272,pulse(t,253,278,300,310)*.55);
  art.strike(0,tx+105,ty-155,680,490,finish,-.62,-1);
  art.strike(3,tx,ty-95,1040,910,finish);
  target(opponent,tx,ty,-.12-closure*.22-ease((t-312)/32)*1.3,2.1);
  drawActor(t);
  ctx.restore();
  flash('229,208,255',Math.max(first*.07,closure*.08,finish*.18));
  bands(t,'#120d22');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/11)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,180+time*5,158,1-time/NightsLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

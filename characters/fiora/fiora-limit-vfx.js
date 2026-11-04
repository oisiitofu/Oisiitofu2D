'use strict';
const FioraLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('fiora',['cutin','court','poses','drones','effects']);
 const shots=[
  [0,511,656,852,617,683,456,1.17,-.031,0],
  [43,688,640,899,586,757,442,1.11,.037,0],
  [65,744,587,960,559,833,402,1.12,-.057,1],
  [88,1098,500,987,563,946,395,1.02,.049,2],
  [106,1174,578,990,565,967,432,.95,.017,2],
  [126,1075,577,985,556,945,419,1.08,-.039,1],
  [145,680,495,976,535,815,378,.98,-.046,3],
  [163,681,427,982,551,810,371,.91,.039,3],
  [177,787,517,994,564,872,402,1.06,.042,4],
  [193,801,549,1121,435,890,398,1.02,-.043,4],
  [222,775,640,1438,220,933,434,.95,.017,5],
  [248,778,652,1646,160,959,442,.92,0,5]
 ];
 function drones(t,x,y){
  const show=ease((t-78)/17)*(1-ease((t-184)/21));
  if(!show)return;
  const pass=unit((t-107)/68);
  for(let i=0;i<2;i++){
   const theta=pass*TAU+i*Math.PI;
   const px=x+Math.cos(theta)*257,py=y-118+Math.sin(theta)*164;
   const heading=Math.atan2(Math.cos(theta)*164,-Math.sin(theta)*257);
   const flare=ease((t-119)/14)*(1-ease((t-171)/13));
   art.effect(2,px-38*Math.cos(heading),py-38*Math.sin(heading),316,107,flare*show*.70,heading);
   ctx.save();ctx.translate(px,py);ctx.rotate(heading);
   art.image('drones',-72,-44,144,88,show);ctx.restore();
  }
 }
 function cutin(t,time){
  const s=1.04+time*.001,opacity=ease(t/4)*(1-ease((t-22)/10));
  if(!opacity)return;
  ctx.save();ctx.beginPath();ctx.moveTo(0,151);ctx.lineTo(W,73);ctx.lineTo(W,655);ctx.lineTo(0,733);ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=FioraLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const finish=ease((t-176)/6)*(1-ease((t-189)/32));
  frameClip();ctx.fillStyle='#33271f';ctx.fillRect(0,0,W,H);
  art.image('court',-112-t*.22,-108+ease((t-85)/81)*54,W+300,H+168);
  world(cx,cy,z,roll,face,t,finish);
  const heading=t>=85&&t<138?-1:1;
  target(opponent,tx,ty,-.08+Math.sin(t*.171)*.16-ease((t-181)/28)*1.46);
  const trail=ease((t-121)/7)*(1-ease((t-142)/13));
  art.effect(2,x+197,y-131,566,171,trail*.81,.17,-1);
  art.grid('poses',index,3,2,x,y,381,{face:heading});
  drones(t,991,530);
  for(const [at,kind,angle,dir] of [[43,0,-.27,1],[64,1,.37,1],[88,0,-.62,-1],[128,1,.22,-1],[143,0,-.64,1],[166,1,.55,1]]){
   const slash=ease((t-at)/4)*(1-ease((t-at-3)/12));
   art.effect(kind,tx-dir*52,ty-103,392,251,slash*.90,angle,dir);
  }
  art.effect(3,1006,463,397+finish*561,324+finish*405,finish*.92);
  const imprint=ease((t-180)/10)*(1-ease((t-198)/31));
  art.effect(3,1006,570,607+imprint*423,166+imprint*60,imprint*.61,-.08);
  ctx.restore();flash('255,214,161',finish*.17);
  bands(t,'#131b23');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/FioraLimitProfile.contactHold;
  art.effect(0,x,y,162+43*p,132,1-p*.52,-.29,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

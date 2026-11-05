'use strict';
const ZeroLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('zero',['cutin','court','poses','effects']);
 const shots=[
  [0,408,645,947,620,700,416,1.09,.012,0],
  [42,691,642,960,619,824,423,1.13,-.014,1],
  [71,758,640,979,609,873,400,1.02,.014,1],
  [95,738,567,1012,527,861,350,.96,-.014,2],
  [121,777,461,1038,448,885,316,.89,.017,2],
  [149,709,535,1050,480,874,342,.89,-.021,1],
  [181,757,643,1077,608,883,391,.90,.011,1],
  [206,635,644,1138,594,876,382,.81,-.018,3],
  [222,821,640,1319,475,1000,389,.84,.018,3],
  [253,868,640,1770,245,1075,425,.90,0,3]
 ];
 const pulses=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function arena(t,split,face){
  const drawCourt=(offset=0,drop=0)=>art.image('court',-82-t*.11+offset,-60+drop,W+196,H+132);
  if(!split){drawCourt();return;}
  const seam=[[0,.85],[.19,.74],[.32,.67],[.39,.67],[.57,.52],[.67,.48],[.76,.37],[.86,.34],[1,.24]]
   .map(([x,y])=>[W*(face>0?x:1-x),H*y]);
  const start=seam[0][0],end=seam.at(-1)[0];
  ctx.save();ctx.beginPath();ctx.moveTo(start,0);
  for(const [x,y] of seam)ctx.lineTo(x,y);
  ctx.lineTo(end,0);ctx.clip();
  drawCourt(-23*split*face,-12*split);ctx.restore();
  ctx.save();ctx.beginPath();ctx.moveTo(start,H);
  for(const [x,y] of seam)ctx.lineTo(x,y+18*split);
  ctx.lineTo(end,H);ctx.clip();
  drawCourt(13*split*face,18*split);ctx.restore();
  ctx.save();ctx.beginPath();ctx.moveTo(...seam[0]);
  for(const [x,y] of seam.slice(1))ctx.lineTo(x,y);
  ctx.strokeStyle='rgba(255,155,83,'+split*.7+')';ctx.lineWidth=3;ctx.stroke();ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=ZeroLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const flinch=Math.max(...Array.from(ZeroLimitProfile.combo.keys(),hit=>pulses(t,hit-1,hit,hit+3,hit+8)));
  const finish=pulses(t,207,216,221,242),charge=pulses(t,187,203,209,217);
  frameClip();ctx.fillStyle='#261017';ctx.fillRect(0,0,W,H);arena(t,ease((t-216)/26),face);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.56,finish));
  art.grid('poses',pose,2,2,x,y,357);
  const drawTarget=()=>target(opponent,tx+flinch*23,ty-flinch*25,-.09-flinch*.32-ease((t-216)/31)*1.48);
  if(t<216)drawTarget();
  for(const [hit,kind,angle] of [[43,0,-.21],[52,0,.19],[64,0,-.36],[86,1,-.63],[107,1,-.5],[133,2,.4],[156,0,-.12],[177,0,.29]]){
   const progress=ease((t-hit+7)/7),strength=pulses(t,hit-7,hit-3,hit+1,hit+7);
   art.strike(kind,mix(x+118,tx-59,progress),mix(y-176,ty-102,progress),323+progress*127,176+kind*43,strength,angle);
  }
  art.glow(0,x+87,y-209,309+charge*158,185+charge*110,charge*.83,-.61);
  const advance=ease((t-207)/11);
  art.strike(3,mix(x+148,tx-12,advance),mix(y-184,ty-108,advance),487+finish*619,324+finish*212,finish,-.34);
  if(t>=216)drawTarget();
  ctx.restore();flash('198,255,221',Math.max(flinch*.11,finish*.25));bands(t,'#240f1a');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,168+time*6,118,1-time/ZeroLimitProfile.contactHold*.6,-.18,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

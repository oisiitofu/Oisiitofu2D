'use strict';
const LipLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('lip',['cutin','court','poses','effects','panels']);
 const shots=[
  [0,436,661,918,643,674,449,1.13,-.021,0],
  [50,410,652,947,640,709,436,1.03,.016,0],
  [82,383,649,974,623,714,398,.94,-.015,1],
  [126,434,586,996,616,748,375,.86,.019,2],
  [152,469,514,1020,619,752,353,.80,-.027,2],
  [178,483,565,1090,577,792,423,.95,.022,3],
  [210,467,649,1426,335,893,450,.88,-.014,0],
  [242,465,652,1732,178,934,454,.89,0,0]
 ];
 const beat=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 // The first match frees the cyan tiles, then the yellow tiles fall into line.
 const panels=[
  [0,0,0,[],75],[1,0,0,[],75],[2,0,1,[],0,1],[3,0,0,[],75,-1],
  [0,1,5,[75],0],[1,1,4,[75],0],[2,1,1,[75],0],
  [1,2,3,[75],96],[2,2,3,[75],96],[3,1,3,[],96],
  [0,2,2,[75],117],[1,3,2,[75,96],117],[2,3,2,[75,96],117]
 ];
 function board(t){
  const emerge=ease((t-33)/16),swap=ease((t-53)/13);
  for(const [col,row,n,drops,clear,slide=0] of panels){
   const alpha=emerge*(1-ease((t-(clear||129))/8));
   if(!alpha)continue;
   const fall=drops.reduce((sum,frame)=>sum+ease((t-frame-6)/12),0);
   const y=624-(row-fall)*76+(1-emerge)*84;
   const pop=clear?beat(t,clear-3,clear,clear+2,clear+9):0;
   const x=669+(col+slide*swap)*86;
   ctx.save();ctx.globalAlpha*=alpha;
   ctx.fillStyle='#402650';ctx.strokeStyle='#e2a9e4';ctx.lineWidth=3;
   ctx.beginPath();ctx.roundRect(x-36,y-36,72,72,11);ctx.fill();ctx.stroke();
   ctx.restore();
   art.grid('panels',n,6,1,x,y,89+pop*18,{anchorY:.5,alpha});
  }
  for(const [clear,x,y] of [[75,755,624],[96,841,548],[117,755,548]]){
   const sparks=beat(t,clear-2,clear+2,clear+4,clear+15);
   art.strike(2,x,y,277+sparks*115,118+sparks*78,sparks*.73);
  }
 }
 function draw({target:opponent,face,time}){
  const t=LipLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const lift=beat(t,108,131,147,163),slab=beat(t,130,142,166,178),blast=beat(t,167,178,183,211);
  frameClip();
  ctx.fillStyle='#302242';ctx.fillRect(0,0,W,H);
  art.image('court',-68-t*.10,-50,W+176,H+105);
  world(cx,cy,z,roll,face,t,Math.max(blast,lift*.28));
  art.glow(3,x+4,y-94,300+lift*164,401,lift*.69);
  art.grid('poses',pose,2,2,x,y,278);
  const recoil=-.15-ease((t-174)/38)*1.49;
  board(t);
  art.strike(1,1030,mix(118,557,ease((t-140)/28)),414+slab*172,252+slab*102,slab,.07);
  if(t<183)target(opponent,tx,ty,recoil);
  const travel=ease((t-164)/15),petals=beat(t,163,168,176,184);
  art.strike(3,mix(x+153,1046,travel),mix(y-95,505,travel),168,318,petals,Math.PI/2);
  art.strike(2,1046,505,402+blast*593,345+blast*215,blast);
  art.glow(3,1012,488,516,553,blast*.43);
  if(t>=183)target(opponent,tx,ty,recoil);
  ctx.restore();
  flash('255,218,158',blast*.24);bands(t,'#281934');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(2,x,y,140+time*5,132,1-time/LipLimitProfile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

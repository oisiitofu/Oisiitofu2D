"use strict";

const MikuLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('miku',['cutin','court','poses','motion','effects','speaker']);
 const shots=[
  [0,590,750,1110,630,850,425,.94,0,0],
  [30,580,750,1110,630,850,425,.94,0,0],
  [60,700,750,1125,620,920,415,.94,.009,1],
  [76,645,750,1120,630,900,415,.92,0,0],
  [90,690,750,1130,615,925,415,.93,-.008,2],
  [120,790,750,1150,605,980,415,.93,.008,5],
  [135,765,675,1160,595,960,385,.91,0,2],
  [150,810,545,1180,545,995,350,.85,-.012,4],
  [165,830,610,1180,560,1005,375,.85,0,4],
  [180,870,750,1190,630,1030,420,.87,.013,3],
  [210,815,750,1190,625,1010,420,.83,0,1],
  [240,865,750,1200,605,1040,410,.83,-.01,2],
  [270,875,750,1210,615,1050,410,.86,.008,5],
  [286,870,750,1210,615,1040,410,.89,0,6],
  [300,880,750,1220,615,1050,410,.76,.013,6],
  [318,880,750,1440,455,1120,405,.76,0,6],
  [338,880,750,1740,270,1250,395,.74,0,7],
  [354,880,750,1920,185,1340,375,.74,0,7]
 ];
 const pulse=(time,start,peak,hold,end)=>ease((time-start)/(peak-start))*(1-ease((time-hold)/(end-hold)));

 function note(time,hit,x,y,tx,ty,pose){
  const strength=pulse(time,hit-7,hit,hit+1,hit+7);
  if(strength<=0)return;
  const startX=x+75;
  const startY=y-(pose===4?345:365);
  const fraction=.15+.85*ease((time-hit+7)/7);
  const endX=tx-100;
  const endY=ty-100;
  const angle=Math.atan2(endY-startY,endX-startX);
  art.strike(0,startX+(endX-startX)*fraction,startY+(endY-startY)*fraction,390,342,strength,angle);
 }

 function draw({target:opponent,face,time}){
  const t=MikuLimitProfile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const beat=Math.max(...Array.from(MikuLimitProfile.combo.keys(),hit=>pulse(t,hit-2,hit,hit+2,hit+8)));
  const finish=pulse(t,294,300,307,326);
  frameClip();
  ctx.fillStyle='#061727';
  ctx.fillRect(0,0,W,H);
  art.image('court',-65,-55,W+130,H+110);
  world(cx,cy,zoom,roll,face,t,Math.max(beat*.38,finish));
  for(const hit of [60,90,120,150])note(t,hit,x,y,tx,ty,pose);
  art.strike(3,tx,ty-100,435,382,pulse(t,174,180,183,192));
  const speakerAlpha=pulse(t,163,182,324,345);
  art.grid('speaker',0,1,1,590,750,223,{alpha:speakerAlpha});
  art.grid('speaker',0,1,1,1710,750,223,{alpha:speakerAlpha,face:-1});
  for(const [hit,side] of [[210,1],[240,-1],[270,1]]){
   const strength=pulse(t,hit-8,hit,hit+2,hit+10);
   const travel=ease((t-hit+8)/8);
   const origin=side===1?590:1710;
   const startY=617;
   const endY=ty-98;
   const angle=Math.atan2(endY-startY,Math.abs(tx-origin))*side;
   art.strike(1,origin+(tx-origin)*travel,startY+(endY-startY)*travel,510,448,strength,angle,side);
   art.strike(3,tx,ty-98,340,298,pulse(t,hit-1,hit,hit+2,hit+8));
  }
  art.glow(3,x+50,y-340,340,298,pulse(t,272,286,294,302)*.44);
  art.strike(3,tx,ty-95,1100,965,finish);
  art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,585);
  target(opponent,tx+beat*12,ty-beat*14,-.10-beat*.18-ease((t-302)/30)*1.42,2.15);
  ctx.restore();
  flash('182,250,255',Math.max(beat*.065,finish*.18));
  bands(t,'#081521');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/11)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,180+time*5,158,1-time/MikuLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

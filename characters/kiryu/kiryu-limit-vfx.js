"use strict";

const KiryuLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('kiryu',['cutin','court','poses','motion','finish','effects']);
 // Time, Kiryu's feet, opponent's feet, camera center, zoom, roll, full-body pose.
 const shots=[
  [0,520,739,966,728,755,434,.96,0,1],
  [28,520,739,966,728,755,434,.96,0,1],
  [47,652,739,966,728,805,428,1.01,-.012,2],
  [62,768,739,969,721,855,428,1.02,.012,3],
  [72,756,739,987,731,860,428,1.02,0,1],
  [81,785,739,985,722,865,429,1.01,-.012,-11],
  [96,750,739,997,730,860,430,1,0,1],
  [111,751,739,1018,698,872,421,.99,.016,4],
  [127,798,739,1010,726,900,426,.99,0,2],
  [144,858,739,1005,729,927,426,.98,0,5],
  [153,891,739,1000,694,950,417,.98,.007,5],
  [167,935,739,1040,582,962,383,.94,0,6],
  [181,941,739,800,516,881,380,.93,-.02,7],
  [193,922,739,53,597,652,403,.89,.02,7],
  [205,905,739,188,650,650,420,.89,0,8],
  [217,875,739,442,744,710,423,.92,-.009,8],
  [241,793,739,890,590,838,391,.94,0,2],
  [259,777,739,1030,690,897,419,.94,0,-9],
  [280,799,739,1030,710,913,425,.93,-.01,-9],
  [288,838,739,1048,690,933,422,.91,.02,-10],
  [300,843,739,1220,566,1015,388,.85,0,-11],
  [324,840,739,1630,400,1110,400,.75,0,12],
  [346,837,739,1840,295,1160,405,.75,0,12]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 const poseAtlases=['poses','motion','finish'];

 function draw({target:opponent,face,time}){
  const t=KiryuLimitProfile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const straight=pulse(t,62,3,7),body=pulse(t,81,3,7),kick=pulse(t,111,4,9);
  const rush=Math.max(straight,body,kick);
  const grab=pulse(t,153,3,7);
  const wall=pulse(t,193,3,15);
  const rebound=pulse(t,217,3,8);
  const finish=pulse(t,288,4,21);
  frameClip();
  ctx.fillStyle='#0e1228';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(face<0?W:0,0);ctx.scale(face,1);
  art.image('court',-90-cx*.025,-70-cy*.045,W+220,H+120);
  ctx.restore();
  world(cx,cy,zoom,roll,face,t,Math.max(rush*.48,wall*.86,rebound*.36,finish));
  const footwork=Math.max(pulse(t,47,12,9),pulse(t,127,5,7),pulse(t,241,10,6));
  art.glow(0,x-40,y-30,295,105,footwork*.33);
  const windup=pulse(t,278,18,16);
  art.glow(0,x+83,y-224,430,420,windup*.38);

  const holdTurn=ease((t-152)/34);
  const tilt=-.11-rush*.18-holdTurn*1.10+ease((t-195)/47)*1.35-ease((t-289)/35)*1.4;
  target(opponent,tx,ty-rush*7,tilt,3.1);
  art.strike(0,tx-44,ty-243,258,225,straight);
  art.strike(0,tx-35,ty-199,280,244,body);
  art.strike(0,tx-45,ty-219,310,270,kick);
  art.strike(0,tx-50,ty-200,200,175,grab);
  art.strike(2,tx-27,ty-150,565,474,wall);
  art.strike(2,tx-13,ty-24,390,280,rebound);
  art.strike(1,x+213,y-231,450,293,finish,0,-1);
  art.strike(3,tx+9,ty-186,651,549,finish);
  art.grid(poseAtlases[Math.floor(pose/4)],pose%4,2,2,x,y,505,{face:Math.sign(signedPose)});
  ctx.restore();
  flash('194,219,255',Math.max(rush*.07,wall*.12,finish*.18));
  bands(t,'#0a0c18');
  art.portrait(1+t*.0012,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,185+time*6,161+time*4,1-time/KiryuLimitProfile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const SolLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('sol',['cutin','court','poses','napalm','effects']);
 const shots=[
  [0,455,647,958,609,719,395,1.08,.014,0],
  [43,700,647,987,607,853,390,1.08,-.018,0],
  [59,780,566,1027,516,908,331,1.07,.019,1],
  [76,803,647,1072,606,940,390,1.06,-.018,2],
  [98,849,647,1120,603,989,390,1.09,.02,2],
  [119,887,647,1167,600,1031,388,.99,-.02,2],
  [141,932,647,1210,598,1073,388,1.03,.02,0],
  [162,845,647,1256,591,1050,388,.87,-.014,3],
  [185,985,647,1282,585,1134,386,.96,.02,2],
  [204,960,647,1299,583,1133,349,.76,-.013,3],
  [217,1195,556,1303,564,1190,330,.83,.023,3],
  [234,1100,647,1658,297,1238,334,.73,-.013,2],
  [250,961,647,1886,178,1200,337,.74,0,2]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=SolLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const charge=pulse(t,193,204,210,217),finish=pulse(t,209,216,221,241);
  const flinch=Math.max(...Array.from(SolLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  frameClip();ctx.fillStyle='#231a30';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.12,-66,W+189,H+134);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.61,finish));
  art.glow(3,x+106,y-75,304+charge*169,374+charge*216,charge*.47);
  const drawSol=()=>art.grid(t>=210&&pose===3?'napalm':'poses',pose,2,2,x,y,351);
  if(t<210)drawSol();
  for(const [hit,angle] of [[43,-.16],[59,-.88],[141,.15]]){
   art.strike(0,tx-52,ty-123,369,260,pulse(t,hit-5,hit,hit+1,hit+8),angle);
  }
  for(const [hit,size] of [[76,283],[98,321],[119,417],[185,487]]){
   const fromX=x+138,fromY=y-221,toX=tx-40,toY=ty-174;
   art.strike(1,mix(fromX,toX,.5),mix(fromY,toY,.5),Math.min(size,toX-fromX+180),198,pulse(t,hit-4,hit,hit+1,hit+8),Math.atan2(toY-fromY,toX-fromX));
  }
  const ground=pulse(t,151,158,163,175),travel=ease((t-151)/13);
  art.strike(2,mix(x+103,tx-42,travel),y-78,563,225,ground);
  art.strike(2,mix(x+164,tx-20,ease((t-204)/12)),y-74,tx-x+154,224,charge);
  art.strike(3,x+81,647-390,482+finish*306,664+finish*246,finish);
  if(t>=210)drawSol();
  target(opponent,tx+flinch*24,ty-flinch*23,-.10-flinch*.30-ease((t-217)/28)*1.47);
  ctx.restore();flash('255,183,114',Math.max(flinch*.13,finish*.26));bands(t,'#26192d');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,166+time*6,120,1-time/SolLimitProfile.contactHold*.6,-.13,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

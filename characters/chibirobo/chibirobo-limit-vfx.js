'use strict';
const ChibiRoboLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('chibirobo',['cutin','court','poses','effects','dekarobo']);
 const shots=[
  [0,440,645,965,626,699,443,1.14,.012,0],
  [41,471,647,958,629,717,440,1.08,-.013,1],
  [83,503,647,990,624,746,426,1.01,.014,2],
  [112,568,652,1027,624,764,372,.83,-.021,2],
  [138,542,650,1040,611,782,375,.85,.017,3],
  [177,575,650,1110,593,822,404,.92,-.018,3],
  [202,556,651,1320,404,868,423,.88,.016,0],
  [243,532,648,1714,175,930,447,.89,0,0]
 ];
 const pulse=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 function draw({target:opponent,face,time}){
  const t=ChibiRoboLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const power=pulse(t,88,112,128,144),awake=pulse(t,99,131,186,222);
  const bolt=pulse(t,135,147,149,158),surge=pulse(t,157,168,172,180),blast=pulse(t,177,187,194,221);
  const flinch=Math.max(...Array.from(ChibiRoboLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#38272a';ctx.fillRect(0,0,W,H);art.image('court',-71-t*.12,-52,W+176,H+107);
  world(cx,cy,z,roll,face,t,Math.max(blast,flinch*.47));
  art.glow(2,442,460,436+power*260,420,power);
  art.grid('dekarobo',0,1,1,435,630-mix(-49,0,awake),410+awake*205,{alpha:awake});
  art.grid('poses',pose,2,2,x,y,236);
  target(opponent,tx+flinch*20,ty-flinch*17,-.11-flinch*.2-ease((t-190)/38)*1.47);
  for(const start of [41,54,67]){
   const travel=ease((t-start)/8),shot=pulse(t,start,start+2,start+8,start+12);
   art.strike(0,mix(x+105,tx-27,travel),mix(y-110,ty-99,travel),160,84,shot);
  }
  art.strike(1,mix(x+161,tx-92,ease((t-136)/11)),ty-101,495,175,bolt);
  art.strike(1,tx-108,ty-111,471,211,surge,-.16);
  art.strike(3,tx,ty-100,147,148,flinch*.82);
  art.strike(3,1096,509,409+blast*607,382+blast*210,blast);
  ctx.restore();flash('169,243,255',Math.max(blast*.26,power*.10));bands(t,'#242332');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,137+time*6,85,1-time/ChibiRoboLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

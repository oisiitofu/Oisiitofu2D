'use strict';
const DanteLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('dante',['cutin','court','poses','devil','effects']);
 const shots=[
  [0,467,642,962,607,726,397,1.08,.014,0],
  [44,649,642,980,607,830,388,1.02,-.018,0],
  [59,777,566,1033,511,928,333,1.10,.018,1],
  [73,670,518,1062,483,868,315,.99,-.016,2],
  [104,659,528,1096,484,878,312,.98,.019,2],
  [116,584,643,1080,576,834,382,.81,-.012,3],
  [139,584,643,1100,578,851,379,.80,.014,0],
  [157,798,560,1142,514,972,341,.89,-.019,1],
  [173,880,491,1165,450,1040,300,.94,.021,2],
  [189,923,541,1181,490,1060,323,.95,-.02,1],
  [205,962,472,1214,427,1090,284,.98,.023,2],
  [222,837,520,1234,515,1037,352,.78,-.012,0],
  [237,989,600,1270,546,1132,379,1.02,.024,3],
  [251,887,643,1667,290,1191,402,.79,-.015,3],
  [269,869,643,1902,170,1221,404,.80,0,3]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=DanteLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const awaken=pulse(t,112,124,130,150),charge=pulse(t,216,226,231,237),finish=pulse(t,232,236,242,260);
  const flinch=Math.max(...Array.from(DanteLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const demon=ease((t-120)/10)*(1-ease((t-252)/10));
  frameClip();ctx.fillStyle='#1d122a';ctx.fillRect(0,0,W,H);art.image('court',-70-t*.13,-65,W+186,H+132);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.58,finish));
  art.glow(2,x+15,y-159,470+awaken*372,410+awaken*280,awaken*.58);
  art.glow(3,x+99,y-151,430+charge*244,328+charge*157,charge*.48,-.15);
  const drawDante=()=>{
   art.grid('poses',t>=252?3:pose,2,2,x,y,331,{alpha:1-demon});
   art.grid('devil',pose,2,2,x,y,448,{alpha:demon});
  };
  const drawTarget=()=>target(opponent,tx+flinch*23,ty-flinch*22,-.10-flinch*.29-ease((t-237)/28)*1.44);
  if(t<236)drawDante();
  for(const [hit,angle] of [[44,-.20],[59,-.94],[157,-.14],[173,-.93],[189,.36],[205,-.76]]){
   art.strike(0,tx-63,ty-120,hit<100?330:478,hit<100?242:333,pulse(t,hit-5,hit,hit+1,hit+8),angle);
  }
  for(const [hit,offset] of [[76,-15],[82,10],[88,-7],[94,19],[100,0]]){
   const fromX=x+(offset<0?115:128),fromY=y-(offset<0?162:146),toX=tx-30,toY=ty-103+offset;
   art.strike(1,mix(fromX,toX,.5),mix(fromY,toY,.5),Math.hypot(toX-fromX,toY-fromY),97,pulse(t,hit-2,hit,hit+1,hit+4),Math.atan2(toY-fromY,toX-fromX));
  }
  art.strike(2,tx-42,ty-139,451+charge*284,387+charge*209,charge);
  art.strike(3,tx+19,ty-135,507+finish*426,367+finish*264,finish,-.10);
  if(t>=236)drawDante();
  drawTarget();
  ctx.restore();flash('255,159,112',Math.max(awaken*.16,flinch*.13,finish*.26));bands(t,'#211125');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,172+time*6,124,1-time/DanteLimitProfile.contactHold*.6,-.15,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

"use strict";

const C4621LimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=C4621LimitProfile;
 const art=assets('c4621',['cutin','court','poses','boost','blade','props','effects']);
 const atlases=['poses','boost','blade'];
 const shots=[
  [0,544,748,1087,731,818,420,.96,0,1],
  [31,544,748,1087,731,818,420,.96,0,1],
  [57,845,748,1138,720,1000,419,.88,.018,1],
  [79,864,747,1230,701,1049,410,.88,.015,5],
  [92,948,709,1317,651,1129,391,.84,-.025,2],
  [111,1135,635,1366,649,1242,366,.83,-.038,5],
  [128,1315,670,1534,655,1429,393,.81,-.028,6],
  [150,1465,741,1643,687,1545,414,.84,.027,3],
  [176,1340,747,1673,713,1511,421,.85,.019,7],
  [194,1256,747,1675,713,1485,425,.84,0,7],
  [212,1231,747,1644,690,1449,415,.83,-.016,8],
  [237,1264,748,1616,728,1441,419,.81,.024,9],
  [261,1377,749,1678,734,1519,421,.82,-.023,10],
  [291,1480,749,1707,682,1600,411,.80,.027,11],
  [311,1480,749,1782,694,1632,420,.76,0,9],
  [331,1525,750,1823,673,1685,404,.73,.024,11],
  [353,1525,750,2169,452,1767,380,.67,0,12],
  [376,1525,750,2409,310,1860,371,.64,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));

 function boosters(t,x,y,tx,ty){
  const thrust=Math.max(pulse(t,108,15,22),pulse(t,260,17,19));
  const brake=pulse(t,146,10,17);
  art.grid('props',1,2,2,x-185,y-72,480,{alpha:thrust,face:-1});
  art.grid('props',1,2,2,x+155,y-60,384,{alpha:brake});
  art.grid('props',3,2,2,x-108,y-157,239,{alpha:thrust*.83});
  for(const [beat,startX,startY] of [[92,905,530],[212,1240,519]]){
   const p=ease((t-beat+22)/22);
   const alpha=pulse(t,beat-7,15,8);
   art.grid('props',0,2,2,mix(startX,tx-15,p),mix(startY,ty-111,p)-Math.sin(Math.PI*p)*180,235,{alpha,anchorY:.5});
  }
  const debris=ease((t-328)/23);
  art.grid('props',2,2,2,tx+debris*134,ty-debris*153,430,{alpha:pulse(t,332,2,26)});
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,4,10)));
  const finish=pulse(t,331,4,23);
  frameClip();
  ctx.fillStyle='#272c33';ctx.fillRect(0,0,W,H);
  art.image('court',-87-cx*.017,-82-cy*.025,W+244,H+160);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.6,finish));
  boosters(t,x,y,tx,ty);
  art.glow(1,tx,ty-117,357,297,pulse(t,225,13,18)*.62);
  art.strike(3,tx+32,ty-135,1017,713,finish);
  target(opponent,tx,ty-hit*13,-.13-hit*.35-ease((t-333)/34)*1.53,2.76);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,514);
  for(const [beat,kind,angle] of [[57,0,0],[92,1,-.17],[128,2,.06],[176,0,0],[212,1,.09],[261,2,-.16],[291,3,-.21]]){
   art.strike(kind,tx-26,ty-132,kind===3?524:404,kind===3?410:315,pulse(t,beat,3,11),angle);
  }
  ctx.restore();
  flash('217,244,255',Math.max(hit*.055,finish*.16));bands(t,'#1c222b');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,175+time*5,145+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

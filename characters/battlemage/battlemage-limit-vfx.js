"use strict";

const BattleMageLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=BattleMageLimitProfile;
 const art=assets('battlemage',['cutin','court','poses','warp','finish','props','effects']);
 const atlases=['poses','warp','finish'];
 const orbs=[[1008,619,85,160],[1510,441,123,244],[1312,304,167,282]];
 const shots=[
  [0,532,749,1088,729,815,425,.94,0,1],
  [30,532,749,1088,729,815,425,.94,0,1],
  [51,860,749,1144,709,1004,419,.89,-.019,2],
  [69,927,743,1231,710,1080,421,.86,0,1],
  [86,983,727,1286,632,1135,406,.85,.023,3],
  [106,1005,665,1353,654,1177,390,.81,-.027,4],
  [126,1052,608,1370,570,1203,366,.78,.027,5],
  [146,1095,588,1425,592,1254,369,.77,0,6],
  [161,1533,479,1342,557,1428,347,.73,.047,-7],
  [181,1505,494,1291,580,1397,361,.75,-.018,-8],
  [201,1425,414,1174,583,1293,343,.73,.024,-5],
  [221,1412,395,1287,584,1355,357,.73,0,-6],
  [245,1116,427,1521,583,1312,345,.73,-.038,7],
  [267,1217,498,1496,648,1353,380,.76,0,8],
  [287,1375,539,1564,611,1467,371,.75,.029,9],
  [312,1377,607,1565,674,1477,401,.74,0,9],
  [337,1390,730,1656,673,1525,419,.70,-.032,10],
  [359,1390,749,2025,460,1681,390,.64,0,11],
  [394,1390,749,2343,242,1849,339,.60,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,337,4,24);
  frameClip();
  ctx.fillStyle='#302448';ctx.fillRect(0,0,W,H);
  art.image('court',-85-cx*.017,-82-cy*.021,W+230,H+165);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.55,finish));
  for(const [i,[ox,oy,start,close]] of orbs.entries()){
   const collect=ease((t-close)/17);
   const gather=ease((t-294-i*5)/39);
   const aimX=mix(ox,tx-31,Math.max(collect*.35,gather));
   const aimY=mix(oy,ty-106,Math.max(collect*.35,gather));
   art.grid('props',i%2,2,2,aimX,aimY,216+gather*76,
    {alpha:ease((t-start)/14)*(1-ease((t-339)/16)),anchorY:.5});
  }
  art.grid('props',3,2,2,tx-25,ty+78,710,{alpha:pulse(t,328,33,34)});
  art.grid('props',2,2,2,tx+108,ty+8,595,{alpha:pulse(t,341,7,28)});
  art.glow(3,tx,ty-137,625,468,pulse(t,318,14,20)*.66);
  art.strike(3,tx+25,ty-121,1110,749,finish);
  for(const [beat,kind,angle,direction] of [[51,0,0,1],[86,0,-.51,1],[126,1,.1,1],[161,2,.11,-1],[201,1,0,-1],[245,2,.12,1],[287,1,.24,1]]){
   art.strike(kind,tx-21,ty-116,kind===2?521:433,350,pulse(t,beat,3,9),angle,direction);
  }
  target(opponent,tx,ty-hit*11,-.11-hit*.36-ease((t-338)/38)*1.44,2.74);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,502,{face:Math.sign(signedPose)});
  ctx.restore();
  flash('255,218,247',Math.max(hit*.055,finish*.17));bands(t,'#2e2444');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,172+time*5,142+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

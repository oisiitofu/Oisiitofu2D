"use strict";

const RaymanLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=RaymanLimitProfile;
 const art=assets('rayman',['cutin','court','poses','glide','finish','props','effects']);
 const atlases=['poses','glide','finish'];
 const shots=[
  [0,532,749,1078,730,807,421,.93,0,1],
  [30,532,749,1078,730,807,421,.93,0,1],
  [48,822,738,1096,703,963,414,.90,.018,3],
  [66,930,711,1178,674,1048,400,.86,-.019,2],
  [85,1047,552,1223,572,1138,340,.82,.032,2],
  [102,1121,427,1341,642,1232,350,.80,.018,5],
  [119,1235,390,1463,640,1349,355,.77,-.025,6],
  [148,1375,380,1519,438,1452,306,.74,-.021,6],
  [171,1531,451,1556,552,1546,354,.75,.019,7],
  [190,1643,516,1424,625,1529,402,.76,.026,-7],
  [213,1665,632,1294,541,1483,380,.76,0,-8],
  [235,1574,609,1164,618,1375,400,.77,-.016,-9],
  [259,1547,601,1240,709,1394,425,.79,0,-9],
  [283,1547,601,1319,689,1436,415,.81,.021,-10],
  [311,1543,601,1239,727,1395,433,.79,0,-10],
  [333,1536,602,1210,664,1371,417,.71,-.024,-11],
  [357,1536,602,836,459,1196,377,.66,0,-12],
  [394,1536,602,540,241,1041,338,.61,0,-12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,333,4,24);
  frameClip();
  ctx.fillStyle='#27414a';ctx.fillRect(0,0,W,H);
  art.image('court',-88-cx*.017,-81-cy*.022,W+231,H+167);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.52,finish));
  art.grid('props',0,2,2,1048,759,337,{alpha:1-ease((t-144)/68)});
  art.grid('props',1,2,2,1549,755,505,{alpha:ease((t-143)/46)});
  art.grid('props',2,2,2,tx-56,ty+54,489,{alpha:Math.max(pulse(t,192,8,22),finish*.83)});
  for(const [beat,direction,arc] of [[48,1,33],[119,1,44],[148,1,63],[283,-1,33],[333,-1,48]]){
   const travel=ease((t-beat+15)/15);
   const fistX=mix(x+direction*123,tx-direction*18,travel);
   const fistY=mix(y-192,ty-146,travel)-Math.sin(travel*Math.PI)*arc;
   art.grid('props',3,2,2,fistX,fistY,beat===333?323:232,
    {face:direction,anchorY:.5,alpha:pulse(t,beat-2,13,beat===333?4:5)});
  }
  art.glow(2,x+114,y-221,495,275,pulse(t,145,38,35)*.72);
  art.strike(3,tx-70,ty-113,1013,704,finish,0,-1);
  for(const [beat,kind,angle,direction] of [[48,0,.05,1],[85,1,-.8,1],[119,0,.09,1],[148,0,-.3,1],[190,1,.7,-1],[235,2,-.17,-1],[283,0,0,-1]]){
   art.strike(kind,tx,ty-106,kind===2?483:415,340,pulse(t,beat,3,9),angle,direction);
  }
  target(opponent,tx,ty-hit*12,.12+hit*.35+ease((t-334)/37)*1.49,2.72);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,421,{face:Math.sign(signedPose)});
  ctx.restore();
  flash('255,238,191',Math.max(hit*.055,finish*.16));bands(t,'#1e333e');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,170+time*5,142+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

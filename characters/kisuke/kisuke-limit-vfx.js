"use strict";

const KisukeLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=KisukeLimitProfile;
 const art=assets('kisuke',['cutin','court','poses','swap','sheath','props','effects']);
 const atlases=['poses','swap','sheath'];
 const shots=[
  [0,510,747,1087,733,793,415,.93,0,1],
  [30,510,747,1087,733,793,415,.93,0,1],
  [52,845,747,1136,712,991,409,.91,.018,2],
  [76,872,746,1167,733,1024,423,.90,0,1],
  [93,965,747,1245,684,1108,412,.86,-.022,3],
  [114,1044,747,1312,711,1184,431,.87,-.011,4],
  [130,1126,747,1387,731,1256,425,.86,.024,3],
  [150,1125,746,1457,712,1282,427,.84,0,5],
  [165,1048,747,1466,731,1260,432,.83,-.016,6],
  [185,1134,748,1427,657,1283,407,.84,.023,7],
  [207,1185,746,1414,728,1296,425,.86,0,8],
  [225,1236,747,1504,662,1375,414,.85,-.024,9],
  [246,1259,747,1539,727,1400,427,.84,-.01,9],
  [265,1320,748,1622,726,1468,433,.83,.022,10],
  [289,1320,747,1618,730,1466,431,.84,0,11],
  [310,1314,747,1617,729,1466,431,.84,0,12],
  [332,1314,747,1675,667,1495,419,.73,-.026,12],
  [354,1314,747,2056,484,1632,376,.67,0,12],
  [382,1314,747,2360,247,1740,350,.62,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,332,3,22);
  frameClip();
  ctx.fillStyle='#172831';ctx.fillRect(0,0,W,H);
  art.image('court',-85-cx*.016,-82-cy*.021,W+230,H+168);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.52,finish));
  const debris=ease((t-142)/48);
  art.grid('props',0,2,2,1181+debris*188,511+debris*241,272,{alpha:pulse(t,158,14,31)});
  art.grid('props',1,2,2,1104,748,443,{alpha:1-ease((t-173)/16)});
  art.grid('props',2,2,2,1524+ease((t-311)/51)*374,705,696,{alpha:pulse(t,337,18,39)*.85});
  art.glow(0,1384,564,272,239,pulse(t,309,9,11)*.75);
  art.strike(3,tx-14,ty-104,1041,689,finish,-.15);
  target(opponent,tx,ty-hit*12,-.10-hit*.36-ease((t-333)/35)*1.47,2.76);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,500);
  for(const [beat,kind,angle] of [[52,0,0],[93,1,-.18],[130,2,.12],[185,1,-.58],[225,0,.14],[265,2,-.11]]){
   art.strike(kind,tx-25,ty-119,kind===2?497:402,315,pulse(t,beat,3,9),angle);
  }
  ctx.restore();
  flash('205,237,255',Math.max(hit*.06,finish*.16));bands(t,'#17242f');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,173+time*5,142+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

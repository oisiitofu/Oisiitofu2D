"use strict";

const DanaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=DanaLimitProfile;
 const art=assets('dana',['cutin','court','poses','gratica','luminous','props','effects']);
 const atlases=['poses','gratica','luminous'];
 const shots=[
  [0,526,749,1094,731,826,422,.96,0,1],
  [31,526,749,1094,731,826,422,.96,0,1],
  [58,850,749,1121,710,997,421,.89,.019,2],
  [79,899,741,1193,693,1044,410,.88,-.025,3],
  [96,981,685,1231,650,1108,383,.86,.02,3],
  [115,1077,534,1267,628,1171,348,.84,-.028,4],
  [132,1259,481,1124,637,1191,333,.82,.034,-4],
  [151,1428,510,1136,641,1291,351,.82,-.019,-5],
  [178,1425,728,1176,695,1310,416,.84,.03,-6],
  [198,1417,751,1181,676,1292,414,.83,-.02,-7],
  [221,1436,697,1159,596,1294,381,.82,.02,-8],
  [239,1435,551,1134,555,1277,331,.81,-.013,-9],
  [250,1293,477,1101,543,1192,324,.83,.026,-10],
  [273,1355,451,1090,570,1226,328,.83,-.025,-11],
  [292,1443,486,1057,614,1250,341,.82,.017,-10],
  [311,1498,373,1024,635,1253,315,.78,0,-12],
  [331,1498,373,993,650,1235,352,.71,-.02,-12],
  [353,1498,373,713,508,1132,332,.66,0,-12],
  [376,1498,373,432,311,989,305,.63,0,-12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));

 function terrain(t){
  const ice=ease((t-71)/24)*(1-ease((t-177)/13));
  art.grid('props',0,2,2,1071,mix(876,746,ice),530,{alpha:ice});
  const rubble=ease((t-176)/23);
  art.grid('props',2,2,2,1137-rubble*82,685-rubble*101,524,{alpha:pulse(t,182,6,24)});
  const rise=ease((t-207)/33);
  art.grid('props',1,2,2,1484,mix(957,779,rise),629,{alpha:ease((t-206)/13)});
  art.grid('props',3,2,2,1425,709-rise*123,427,{alpha:pulse(t,224,12,31)});
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,4,10)));
  const finish=pulse(t,331,4,24);
  frameClip();
  ctx.fillStyle='#132d35';ctx.fillRect(0,0,W,H);
  art.image('court',-85-cx*.017,-79-cy*.029,W+241,H+159);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.6,finish));
  terrain(t);
  const beamStartX=x-153,beamStartY=y-150,beamEndY=ty-117;
  const beamX=mix(beamStartX,tx,.5),beamY=mix(beamStartY,beamEndY,.5);
  const angle=Math.atan2(beamEndY-beamStartY,tx-beamStartX)-Math.PI;
  art.glow(2,beamStartX,beamStartY,317,280,pulse(t,322,11,17)*.73);
  art.strike(3,beamX,beamY,Math.hypot(tx-beamStartX,beamEndY-beamStartY)+425,368,finish,angle,-1);
  target(opponent,tx,ty-hit*12,-.13-hit*.35-ease((t-334)/33)*1.53,2.76);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,468,{face:Math.sign(signedPose)});
  art.glow(1,x,y-121,386,324,pulse(t,151,6,13)*.77);
  art.glow(2,x,y-152,373,312,pulse(t,239,7,13)*.71);
  for(const [beat,kind,angle] of [[58,0,-.13],[96,0,.11],[132,0,-.25],[178,1,.12],[221,1,0],[250,2,.13],[273,2,-.24],[292,2,.12]]){
   art.strike(kind,tx+(beat<120?-22:29),ty-121,kind===1?465:362,kind===1?396:299,pulse(t,beat,3,10),angle,beat<120?1:-1);
  }
  ctx.restore();
  flash('255,240,190',Math.max(hit*.059,finish*.15));bands(t,'#122931');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,177+time*5,144+time*4,1-time/profile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

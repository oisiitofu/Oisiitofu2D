"use strict";

const EnochLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=EnochLimitProfile;
 const art=assets('enoch',['cutin','court','poses','weapons','finish','props','effects']);
 const atlases=['poses','weapons','finish'];
 const shots=[
  [0,528,749,1086,729,812,419,.94,0,1],
  [30,528,749,1086,729,812,419,.94,0,1],
  [53,858,749,1128,687,1002,422,.89,.02,2],
  [73,924,686,1193,605,1052,394,.86,-.017,3],
  [92,979,556,1263,491,1122,355,.83,-.026,4],
  [109,913,398,1256,497,1087,327,.78,.02,5],
  [126,892,340,1357,592,1102,336,.75,0,6],
  [154,894,340,1440,503,1160,317,.74,-.024,6],
  [183,855,375,1531,566,1197,348,.73,.019,6],
  [202,822,458,1492,635,1174,377,.75,0,7],
  [235,820,749,1232,702,1055,424,.78,-.031,9],
  [253,827,749,1103,712,1001,424,.84,.013,10],
  [270,908,749,1235,681,1071,423,.83,.022,10],
  [298,1012,749,1304,728,1161,427,.81,0,11],
  [318,1069,749,1377,726,1228,429,.79,0,11],
  [334,1163,749,1464,669,1310,413,.71,-.026,12],
  [359,1163,749,1795,445,1445,374,.65,0,1],
  [394,1163,749,2136,235,1600,338,.61,0,1]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,334,4,24);
  frameClip();
  ctx.fillStyle='#35516a';ctx.fillRect(0,0,W,H);
  art.image('court',-86-cx*.017,-82-cy*.022,W+231,H+167);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.54,finish));
  art.grid('props',0,2,2,x+95,776,491,{alpha:pulse(t,235,4,31)});
  art.grid('props',3,2,2,x,y-10,583,{alpha:pulse(t,321,15,20)});
  for(const [beat,arc] of [[126,85],[154,138],[183,103]]){
   const travel=ease((t-beat+15)/15);
   art.strike(1,mix(x+126,tx-36,travel),mix(y-118,ty-109,travel)-Math.sin(Math.PI*travel)*arc,413,288,
    pulse(t,beat-4,11,12),.42);
  }
  art.strike(3,tx-23,ty-152,1023,724,finish);
  for(const [beat,kind,angle] of [[53,0,-.68],[92,0,-.41],[235,2,.1],[270,2,0]]){
   art.strike(kind,tx-29,ty-120,kind===2?506:441,342,pulse(t,beat,3,9),angle,kind===0?-1:1);
  }
  target(opponent,tx,ty-hit*12,-.09-hit*.37-ease((t-335)/38)*1.49,2.74);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,503);
  ctx.restore();
  flash('221,245,255',Math.max(hit*.054,finish*.17));bands(t,'#233448');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,172+time*5,143+time*4,1-time/profile.contactHold*.63,0,-face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

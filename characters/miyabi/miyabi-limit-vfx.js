"use strict";

const MiyabiLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=MiyabiLimitProfile;
 const art=assets('miyabi',['cutin','court','poses','frost','finish','props','effects']);
 const atlases=['poses','frost','finish'];
 const shots=[
  [0,541,747,1094,731,812,423,.94,0,1],
  [31,541,747,1094,731,812,423,.94,0,1],
  [51,850,747,1130,696,995,418,.89,.019,2],
  [66,938,745,1179,716,1062,428,.87,0,3],
  [82,1016,716,1244,664,1133,400,.84,-.026,4],
  [101,1158,660,1311,693,1236,394,.81,-.02,5],
  [118,1392,646,1308,701,1352,393,.79,.032,-5],
  [138,1468,704,1282,727,1375,421,.80,.021,-6],
  [154,1428,749,1229,711,1339,435,.81,0,-7],
  [183,1412,749,1164,727,1290,436,.82,0,-7],
  [210,1393,749,1147,727,1271,436,.82,0,-7],
  [226,1272,749,1050,663,1159,418,.80,.029,-8],
  [246,1183,751,941,706,1070,432,.80,0,-9],
  [264,1108,746,837,640,976,403,.77,-.029,-10],
  [286,1128,749,802,717,969,433,.78,0,-9],
  [303,1086,749,770,679,928,415,.76,.019,-11],
  [324,1083,749,746,720,916,431,.76,0,-7],
  [339,1043,749,707,664,874,414,.70,-.025,-11],
  [359,1043,749,365,456,774,377,.64,0,-12],
  [394,1043,749,86,231,629,340,.61,0,-12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,339,4,24);
  frameClip();
  ctx.fillStyle='#263d59';ctx.fillRect(0,0,W,H);
  art.image('court',-85-cx*.017,-82-cy*.022,W+229,H+166);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.54,finish));
  const frost=ease((t-105)/48);
  art.grid('props',0,2,2,tx-28,ty+48,350+frost*207,{alpha:frost*(1-ease((t-302)/19))});
  art.grid('props',1,2,2,tx+145,ty+9,388,{alpha:pulse(t,188,34,112)});
  art.grid('props',2,2,2,tx-ease((t-334)/43)*208,ty+19,650,{alpha:pulse(t,342,6,33)});
  art.grid('props',3,2,2,x,y+11,542,{alpha:pulse(t,198,23,28)});
  art.glow(1,x-133,y-173,489,313,pulse(t,323,13,16)*.67,0,-1);
  art.strike(3,tx-45,ty-124,1091,706,finish,-.14,-1);
  for(const [beat,kind,angle,dir] of [[51,0,-.16,1],[82,0,-.51,1],[118,1,.16,-1],[154,1,-.06,-1],[226,0,.11,-1],[264,0,-.45,-1],[303,2,.06,-1]]){
   art.strike(kind,tx-23*dir,ty-114,kind===2?513:440,346,pulse(t,beat,3,9),angle,dir);
  }
  target(opponent,tx,ty-hit*10,.1+hit*.35+ease((t-340)/39)*1.46,2.74);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,499,{face:Math.sign(signedPose)});
  ctx.restore();
  flash('209,239,255',Math.max(hit*.055,finish*.16));bands(t,'#23364e');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,173+time*5,142+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

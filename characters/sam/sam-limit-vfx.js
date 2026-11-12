"use strict";

const SamLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=SamLimitProfile;
 const art=assets('sam',['cutin','court','poses','motion','throw','props','terrain','effects']);
 const atlas=['poses','motion','throw'];
 const shots=[
  [0,543,704,1051,723,816,422,.97,0,1],
  [31,543,704,1051,723,816,422,.97,0,1],
  [57,802,723,1103,723,975,421,.92,.024,1],
  [68,857,738,1143,726,1023,424,.91,.031,2],
  [85,910,729,1222,711,1061,417,.88,.051,3],
  [108,1001,718,1242,730,1114,417,.86,.053,3],
  [131,1102,735,1340,724,1212,412,.85,.088,4],
  [150,1230,767,1374,720,1297,426,.85,.088,4],
  [166,1398,661,1365,699,1341,397,.85,.061,5],
  [190,1543,475,1272,697,1373,352,.82,-.014,-6],
  [207,1632,637,1209,704,1390,372,.81,-.04,-7],
  [228,1650,701,1165,715,1391,413,.81,-.025,-7],
  [247,1674,702,1136,703,1413,413,.82,0,-8],
  [262,1674,704,1127,706,1396,415,.82,.018,-9],
  [278,1651,704,1139,694,1383,413,.81,.016,-10],
  [301,1642,709,1158,697,1333,356,.72,-.022,-11],
  [318,1653,709,1177,690,1322,362,.70,-.013,-11],
  [332,1658,704,1184,692,1334,405,.71,.023,-11],
  [353,1658,704,895,492,1307,385,.72,0,-12],
  [379,1658,704,591,314,1195,382,.67,0,-12]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function tar(t,x,y,tx){
  const first=pulse(t,70,20,32),rise=ease((t-264)/23)*(1-ease((t-341)/23));
  art.grid('terrain',1,2,2,1093,852,570);
  art.grid('terrain',0,2,2,1670,812,535);
  art.grid('terrain',3,2,2,1168,763,718,{alpha:rise*.72});
  art.grid('props',1,2,2,1097,759,380,{alpha:first});
  art.grid('props',1,2,2,1180,746,650,{alpha:rise});
  const emergence=ease((t-286)/28);
  art.grid('props',2,2,2,1174,mix(1155,744,emergence),1038,{alpha:rise});
  const slide=ease((t-80)/10)*(1-ease((t-161)/7));
  const carve=ease((t-105)/36);
  ctx.save();ctx.translate(x-69*carve,y-19);ctx.rotate(mix(.01,.16,carve));
  art.grid('props',0,2,2,0,0,304,{anchorY:.53,alpha:slide});
  ctx.restore();
  const arc=ease((t-262)/16);
  const grenade=pulse(t,273,11,3);
  art.grid('props',3,2,2,mix(x-101,tx,arc),mix(y-254,680,arc)-Math.sin(Math.PI*arc)*167,132,{anchorY:.5,alpha:grenade});
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,332,5,25);
  frameClip();
  ctx.fillStyle='#132333';ctx.fillRect(0,0,W,H);
  art.image('court',-89-cx*.022,-81-cy*.026,W+243,H+161);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.62,finish));
  tar(t,x,y,tx);
  art.glow(0,x+110,y-248,367,239,pulse(t,57,10,13)*.73);
  art.glow(2,tx-32,ty-153,716,502,pulse(t,292,18,44)*.56);
  art.strike(3,tx-86,ty-137,1005,703,finish);
  target(opponent,tx,ty-hit*10,-.16-hit*.35-ease((t-333)/36)*1.51,2.75);
  art.grid(atlas[Math.floor(pose/4)],pose%4,2,2,x,y,475,{face:Math.sign(signedPose)});
  for(const [i,beat] of [...profile.combo.keys()].entries()){
   const effect=i<2?1:i===4?0:i===5?2:1;
   art.strike(effect,tx-28,ty-127,318+i*12,260+i*9,pulse(t,beat,3,10),i===2?.15:i===3?-.9:0);
  }
  ctx.restore();
  flash('216,233,240',Math.max(hit*.06,finish*.16));
  bands(t,'#121d2b');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(1,x,y,179+time*5,149+time*4,1-time/profile.contactHold*.61,-.11*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

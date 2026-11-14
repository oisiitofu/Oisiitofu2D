"use strict";

const ZoeLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=ZoeLimitProfile;
 const art=assets('zoe',['cutin','court','poses','charge','finish','props','effects']);
 const atlases=['poses','charge','finish'];
 const shots=[
  [0,529,748,1091,727,809,422,.93,0,1],
  [31,529,748,1091,727,809,422,.93,0,1],
  [53,858,748,1158,683,1008,413,.88,-.023,2],
  [73,913,748,1215,722,1063,429,.86,0,1],
  [92,1007,749,1282,659,1144,405,.84,.023,3],
  [111,956,736,1356,699,1164,423,.81,-.018,4],
  [132,844,666,1378,672,1112,385,.78,-.03,5],
  [151,963,590,1421,687,1195,374,.75,-.021,6],
  [177,1167,639,1474,656,1325,384,.77,.031,2],
  [197,1282,706,1556,693,1422,412,.79,.022,8],
  [222,1311,748,1614,670,1464,423,.80,-.023,9],
  [242,1257,748,1656,716,1455,433,.78,0,10],
  [260,1224,749,1695,682,1457,417,.78,-.029,9],
  [282,1289,748,1715,723,1504,430,.76,.019,10],
  [294,1327,749,1720,696,1520,420,.75,.024,11],
  [315,1332,749,1698,721,1512,429,.74,0,11],
  [334,1377,749,1741,681,1556,421,.70,-.026,11],
  [359,1377,749,2075,457,1695,382,.64,0,12],
  [394,1377,749,2366,234,1850,339,.60,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,334,4,25);
  frameClip();
  ctx.fillStyle='#343049';ctx.fillRect(0,0,W,H);
  art.image('court',-85-cx*.017,-80-cy*.022,W+230,H+165);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.55,finish));
  art.grid('props',0,2,2,tx+62,ty+41,550,{alpha:Math.max(pulse(t,54,5,22),pulse(t,178,5,24),finish)});
  art.grid('props',1,2,2,mix(x,tx,.45),ty+45,608,{alpha:pulse(t,321,26,32)});
  art.grid('props',2,2,2,x-147,y+16,468,{alpha:pulse(t,209,16,32)});
  art.grid('props',3,2,2,tx+479,770,690,{alpha:pulse(t,331,27,37)});
  art.strike(3,tx+23,ty-92,1156,715,finish);
  for(const [beat,kind,angle] of [[53,1,.04],[92,0,-.21],[132,0,.19],[177,1,.08],[222,2,-.11],[260,2,-.13],[294,1,.04]]){
   const origin=kind===2?mix(x+134,tx,.62):tx-27;
   art.strike(kind,origin,ty-113,kind===2?645:462,352,pulse(t,beat,3,9),angle);
  }
  target(opponent,tx,ty-hit*12,-.1-hit*.38-ease((t-335)/38)*1.44,2.75);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,491);
  ctx.restore();
  flash('255,244,192',Math.max(hit*.055,finish*.17));bands(t,'#2c293d');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,173+time*5,142+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

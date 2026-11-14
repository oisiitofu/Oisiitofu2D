'use strict';
const HumanLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=HumanLimitProfile;
 const art=assets('human',['cutin','court','poses','swing','finish','props','effects']);
 const sheets=['poses','swing','finish'];
 const shots=[
  [0,570,752,1124,747,846,429,.94,0,1],
  [28,709,752,1124,747,920,430,.91,0,2],
  [49,798,657,1170,712,988,390,.84,-.024,3],
  [66,935,630,1213,674,1078,367,.81,.021,4],
  [84,1093,667,1258,704,1176,388,.82,-.025,5],
  [104,1195,752,1338,727,1268,427,.81,.019,6],
  [123,1275,748,1461,704,1370,415,.80,0,7],
  [143,1420,654,1508,685,1465,388,.78,-.024,8],
  [163,1543,525,1579,626,1561,328,.75,.025,9],
  [185,1543,557,1611,680,1577,357,.74,.011,10],
  [205,1521,737,1748,665,1637,414,.71,-.026,11],
  [225,1523,748,2062,465,1761,379,.66,0,12],
  [265,1523,748,2348,221,1883,329,.61,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,8)));
  const finish=pulse(t,205,4,27);
  frameClip();
  ctx.fillStyle='#495775';ctx.fillRect(0,0,W,H);
  art.image('court',-84-cx*.025,-83-cy*.069,W+258,H+176);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.52,finish));
  art.grid('props',0,2,2,936,401,718,{alpha:ease((t-22)/15)});
  art.grid('props',1,2,2,mix(1335,1511,ease((t-119)/25)),780,529,{alpha:ease((t-89)/15)});
  art.grid('props',2,2,2,1534,495+ease((t-187)/18)*264,540,{alpha:ease((t-128)/15)});
  ctx.save();ctx.translate(1781,759);ctx.rotate(ease((t-191)/14)*.51);
  art.grid('props',3,2,2,0,0,664,{alpha:ease((t-142)/13)});ctx.restore();
  target(opponent,tx,ty-hit*11,-.1-hit*.36-ease((t-206)/38)*1.45,2.63);
  art.grid(sheets[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,491);
  for(const [beat,kind,angle] of [[49,0,.12],[66,1,-.13],[84,2,.18],[104,1,.22],[123,2,-.10],[143,0,-.30],[163,1,.35]]){
   art.strike(kind,tx-29,ty-104,kind===1?531:457,327,pulse(t,beat,4,8),angle);
  }
  art.strike(3,tx+114,ty-92,939,610,finish,.04);
  ctx.restore();
  flash('255,238,195',Math.max(hit*.04,finish*.15));bands(t,'#2c3046');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,170+time*5,141+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

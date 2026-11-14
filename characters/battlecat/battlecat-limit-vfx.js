'use strict';
const BattlecatLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=BattlecatLimitProfile;
 const art=assets('battlecat',['cutin','court','poses','charge','finish','props','effects']);
 const sheets=['poses','charge','finish'];
 const shots=[
  [0,557,751,1115,748,833,425,.93,0,1],
  [28,658,751,1115,748,888,426,.92,0,2],
  [48,836,751,1168,713,1001,413,.89,.021,2],
  [66,938,751,1225,708,1082,413,.85,-.019,3],
  [84,1045,751,1284,699,1164,410,.82,.016,4],
  [102,1131,719,1314,667,1221,395,.81,-.022,5],
  [121,1248,603,1386,669,1321,369,.79,.027,6],
  [140,1070,710,1467,667,1267,399,.78,-.019,-7],
  [160,917,642,1516,683,1214,382,.76,.015,-8],
  [180,807,632,1578,724,1173,399,.71,0,9],
  [209,793,630,1656,678,1243,382,.66,.022,10],
  [234,793,630,1954,430,1393,346,.63,-.008,11],
  [266,793,630,2318,218,1534,325,.60,0,1]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,8)));
  const finish=pulse(t,209,5,28);
  frameClip();ctx.fillStyle='#6c6976';ctx.fillRect(0,0,W,H);
  art.image('court',-84-cx*.021,-90-cy*.052,W+243,H+167);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.49,finish));
  art.grid('props',2,2,2,623,814,835,{alpha:ease((t-119)/39)});
  art.grid('props',3,2,2,833,682,360,{alpha:ease((t-144)/13)*(1-ease((t-161)/12))});
  const cart=mix(925,1584,ease((t-61)/106));
  art.grid('props',0,2,2,cart,808,520,{alpha:pulse(t,91,34,80)});
  art.grid('props',1,2,2,cart-118,781,511,{alpha:pulse(t,120,37,73)});
  target(opponent,tx,ty-hit*11,-.1-hit*.36-ease((t-210)/39)*1.45,2.59);
  art.grid(sheets[Math.floor(pose/4)],pose%4,2,2,x,y,455,{face:Math.sign(signedPose)});
  for(const [beat,kind,angle] of [[48,0,.04],[66,1,.08],[84,0,-.13],[102,1,.11],[121,2,-.16],[140,1,.02],[160,2,-.15]]){
   art.strike(kind,tx-33,ty-102,kind===2?526:425,315,pulse(t,beat,3,8),angle);
  }
  art.glow(3,979,555,640,330,pulse(t,201,11,16)*.64);
  art.strike(3,mix(1037,tx+213,ease((t-203)/7)),ty-108,1300,545,finish,-.06);
  ctx.restore();flash('255,239,167',Math.max(hit*.048,finish*.16));bands(t,'#3b3745');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(1,x,y,170+time*5,141+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

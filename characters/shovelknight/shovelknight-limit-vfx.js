"use strict";

const ShovelKnightLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=ShovelKnightLimitProfile;
 const art=assets('shovelknight',['cutin','court','poses','drop','finish','props','effects']);
 const atlases=['poses','drop','finish'];
 const shots=[
  [0,522,747,1084,724,812,423,.93,0,1],
  [30,522,747,1084,724,812,423,.93,0,1],
  [52,846,747,1129,705,984,417,.88,.024,2],
  [72,931,510,1181,681,1050,360,.81,-.022,3],
  [91,1073,598,1244,681,1154,389,.79,.032,4],
  [108,1138,388,1280,641,1208,322,.77,0,5],
  [129,1260,562,1393,682,1324,394,.75,-.028,7],
  [151,1326,420,1511,649,1423,341,.73,.019,6],
  [171,1405,533,1546,627,1470,370,.74,.032,7],
  [190,1452,535,1591,740,1518,426,.76,-.02,8],
  [210,1411,535,1690,779,1552,446,.75,0,9],
  [233,1382,535,1731,775,1554,451,.75,0,9],
  [257,1410,535,1809,743,1612,435,.75,-.017,10],
  [276,1423,535,1860,788,1645,462,.72,.02,10],
  [296,1425,535,1917,762,1671,451,.73,0,11],
  [316,1427,535,1948,780,1687,457,.72,0,10],
  [335,1478,535,1962,715,1717,433,.69,.028,11],
  [357,1478,535,2186,498,1808,385,.64,0,12],
  [394,1478,535,2428,260,1936,347,.60,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,335,4,25);
  frameClip();
  ctx.fillStyle='#352632';ctx.fillRect(0,0,W,H);
  art.image('court',-85-cx*.017,-82-cy*.021,W+228,H+166);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.55,finish));
  ctx.imageSmoothingEnabled=false;
  art.grid('props',0,2,2,1094,765,311);
  art.grid('props',0,2,2,1418,631,542);
  const collapse=ease((t-169)/47);
  art.grid('props',1,2,2,1591+collapse*105,741+collapse*143,416,{alpha:1-collapse});
  art.grid('props',3,2,2,1551+collapse*217,768+collapse*65,623,{alpha:pulse(t,174,5,62)});
  const throwRock=ease((t-308)/29);
  art.grid('props',2,2,2,mix(x+143,tx,throwRock),mix(y-88,ty-28,throwRock)-Math.sin(Math.PI*throwRock)*58,
   427,{alpha:pulse(t,327,55,14)});
  art.strike(3,tx+22,ty-92,997,658,finish);
  for(const [beat,kind,angle] of [[52,0,0],[91,1,-.07],[129,1,-.05],[171,2,0],[210,2,-.21],[257,0,0],[296,2,.1]]){
   art.strike(kind,tx-22,ty-95,442,365,pulse(t,beat,3,9),angle);
  }
  target(opponent,tx,ty-hit*9,-.11-hit*.35-ease((t-336)/38)*1.45,2.73);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,447);
  ctx.restore();
  flash('255,221,173',Math.max(hit*.053,finish*.17));bands(t,'#2b202c');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,172+time*5,142+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

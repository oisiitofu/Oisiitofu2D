"use strict";

const EstelleLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=EstelleLimitProfile;
 const art=assets('estelle',['cutin','court','poses','motion','blossom','props','effects']);
 const atlases=['poses','motion','blossom'];
 const shots=[
  [0,565,747,1091,730,837,420,.97,0,1],
  [34,565,747,1091,730,837,420,.97,0,1],
  [57,873,747,1118,717,1005,419,.91,.01,1],
  [79,861,747,1166,704,1011,420,.89,-.02,2],
  [96,961,741,1209,707,1088,414,.88,-.036,3],
  [113,1031,666,1238,662,1134,384,.86,-.056,4],
  [132,1106,603,1274,638,1205,369,.84,-.031,4],
  [151,1290,483,1194,671,1251,331,.82,.024,-5],
  [172,1425,511,1191,642,1307,344,.84,.047,-6],
  [191,1466,664,1170,666,1319,393,.87,.03,-6],
  [213,1437,748,1167,694,1304,420,.88,.01,-7],
  [234,1404,748,1168,708,1300,421,.87,-.025,-8],
  [251,1370,748,1072,699,1214,419,.87,-.032,-8],
  [269,1306,734,1059,703,1184,420,.87,.014,-9],
  [288,1355,748,1113,712,1248,419,.85,.017,-9],
  [310,1436,748,1097,711,1272,420,.80,-.014,-10],
  [331,1415,748,1060,688,1246,413,.77,.024,-11],
  [352,1418,748,761,465,1134,391,.71,0,-12],
  [376,1418,748,490,311,1008,390,.67,0,-12]
 ];
 const pulse=(t,at,before,after)=>ease((t-at+before)/before)*(1-ease((t-at-1)/after));

 function courtyard(t){
  art.grid('props',0,2,2,1610,744,655,{alpha:.83});
  art.grid('props',1,2,2,1153,766,378,{alpha:pulse(t,124,34,66)});
  const branch=ease((t-278)/23)*(1-ease((t-340)/27));
  art.grid('props',3,2,2,795,415,524,{alpha:branch*.65});
  for(let i=0;i<5;i++){
   const drift=ease((t-291-i*5)/59);
   art.grid('props',2,2,2,1435-i*158-drift*220,560-i*45+drift*87,275-i*13,{
    anchorY:.5,alpha:branch*(.5+i*.07)
   });
  }
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,4,10)));
  const finish=pulse(t,331,5,27);
  frameClip();
  ctx.fillStyle='#4e3735';ctx.fillRect(0,0,W,H);
  art.image('court',-89-cx*.022,-81-cy*.026,W+243,H+161);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.57,finish));
  courtyard(t);
  art.glow(2,1144,693,263,170,pulse(t,111,9,13)*.52);
  art.strike(3,tx-28,ty-119,990,686,finish,0,-1);
  target(opponent,tx,ty-hit*11,-.13-hit*.35-ease((t-333)/34)*1.53,2.72);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,468,{face:Math.sign(signedPose)});
  for(const [beat,kind,angle] of [[57,0,.09],[96,0,-.27],[132,2,-.53],[172,1,-.49],[213,2,0],[251,0,.14],[288,1,.21]]){
   art.strike(kind,tx+(beat<151?-22:23),ty-127,382,304,pulse(t,beat,3,10),angle,beat<151?1:-1);
  }
  ctx.restore();
  flash('255,223,204',Math.max(hit*.057,finish*.15));bands(t,'#372831');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,177+time*5,144+time*4,1-time/profile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

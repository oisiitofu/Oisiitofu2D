"use strict";

const ShizunaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=ShizunaLimitProfile;
 const art=assets('shizuna',['cutin','court','poses','motion','moon','props','effects']);
 const atlases=['poses','motion','moon'];
 const shots=[
  [0,571,748,1104,731,843,420,.97,0,1],
  [31,571,748,1104,731,843,420,.97,0,1],
  [59,921,748,1170,730,1059,420,.89,.016,1],
  [78,896,748,1141,726,1034,418,.88,-.011,2],
  [99,912,748,1118,721,1024,416,.87,.014,2],
  [125,829,750,1130,712,999,418,.87,-.029,3],
  [147,769,705,1110,720,945,395,.86,-.025,4],
  [166,781,702,1095,727,945,398,.86,.004,5],
  [186,893,723,1131,713,1010,414,.88,.014,6],
  [210,953,748,1206,705,1080,421,.89,.021,7],
  [235,1017,748,1226,714,1125,420,.89,-.02,7],
  [255,1042,749,1285,720,1162,424,.87,0,8],
  [277,1056,750,1351,718,1190,426,.85,.013,9],
  [302,1070,751,1358,719,1212,424,.81,-.018,10],
  [318,1070,751,1358,718,1212,422,.76,0,11],
  [331,1070,751,1362,704,1210,413,.73,.019,11],
  [351,1070,751,1683,495,1320,394,.68,0,12],
  [376,1070,751,2046,305,1491,385,.65,0,12]
 ];
 const pulse=(t,at,before,after)=>ease((t-at+before)/before)*(1-ease((t-at-1)/after));

 function blossoms(t){
  const amount=pulse(t,331,11,39);
  if(amount<=0)return;
  for(let i=0;i<6;i++){
   const fall=ease((t-323-i*3)/47);
   art.grid('props',1,2,2,1024+i*139+fall*110,322+i*46+fall*90,219-i*9,{alpha:amount*(.57+i*.055),anchorY:.5});
  }
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,4,10)));
  const finish=pulse(t,331,3,28);
  frameClip();
  ctx.fillStyle='#1e263a';ctx.fillRect(0,0,W,H);
  art.image('court',-89-cx*.022,-81-cy*.026,W+243,H+161);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.53,finish));
  art.grid('props',0,2,2,777,761,385,{alpha:pulse(t,157,31,66)});
  blossoms(t);
  art.strike(2,tx-34,ty-139,565,303,pulse(t,305,2,5),-.42);
  art.glow(2,tx-19,ty-145,740,574,pulse(t,329,5,18)*.34);
  art.strike(3,tx+31,ty-117,1060,699,finish);
  target(opponent,tx,ty-hit*13,-.13-hit*.35-ease((t-333)/34)*1.53,2.74);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,465);
  for(const [beat,kind,angle] of [[59,0,-.18],[99,0,.27],[147,1,-.09],[186,1,.24],[235,2,-.39],[277,2,.28]]){
   art.strike(kind,tx-22,ty-126,408,313,pulse(t,beat,3,11),angle);
  }
  ctx.restore();
  flash('255,216,248',Math.max(hit*.047,finish*.16));bands(t,'#171c2c');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,175+time*5,144+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

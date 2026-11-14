"use strict";

const HorseLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=HorseLimitProfile;
 const art=assets('horse',['cutin','court','poses','course','finish','props','effects']);
 const sheets=['poses','course','finish'];
 const shots=[
  [0,580,750,1130,748,856,426,.94,0,1],
  [29,580,750,1130,748,856,426,.94,0,1],
  [54,798,750,1146,723,980,420,.89,.02,2],
  [79,891,750,1234,743,1065,427,.86,0,3],
  [95,961,701,1256,696,1111,398,.83,-.02,4],
  [120,1115,684,1288,733,1201,400,.81,.018,5],
  [137,1183,652,1306,657,1248,379,.79,.022,6],
  [174,1337,442,1442,540,1394,312,.74,-.026,7],
  [197,1461,519,1517,610,1489,358,.75,0,7],
  [224,1576,506,1572,586,1574,348,.74,.023,8],
  [244,1682,399,1631,511,1656,300,.72,-.028,9],
  [266,1783,419,1635,465,1711,300,.71,.021,9],
  [304,1847,479,1714,503,1782,329,.71,-.022,10],
  [351,1918,470,1814,534,1866,341,.68,.027,11],
  [374,1918,470,2077,348,1956,296,.64,0,12],
  [414,1918,470,2464,152,2111,269,.59,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,351,5,33);
  frameClip();
  ctx.fillStyle='#68545b';ctx.fillRect(0,0,W,H);
  art.image('court',-80-cx*.025,-92-(cy-360)*.23,W+258,H+185);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.5,finish));
  art.grid('props',0,2,2,mix(895,1096,ease((t-61)/23)),737,542,{alpha:ease((t-57)/12)});
  art.grid('props',1,2,2,1155,724,505,{alpha:ease((t-101)/17)});
  art.grid('props',0,2,2,1460,536,549,{alpha:ease((t-155)/16)});
  art.grid('props',0,2,2,1866,497,572,{alpha:ease((t-244)/24)});
  ctx.save();
  ctx.translate(1611,578);
  ctx.rotate(ease((t-193)/89)*Math.PI*2+ease((t-328)/33)*.67);
  art.grid('props',2,2,2,0,0,602,{anchorY:.5,alpha:ease((t-176)/23)});
  ctx.restore();
  art.grid('props',3,2,2,2021,485,546,{alpha:ease((t-272)/28)});
  target(opponent,tx,ty-hit*11,-.1-hit*.37-ease((t-352)/41)*1.41,2.61);
  art.grid(sheets[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,487);
  for(const [beat,kind,angle] of [[54,0,.04],[95,0,.09],[137,1,-.12],[174,1,-.25],[224,2,-.19],[266,2,.37],[304,0,-.14]]){
   art.strike(kind,tx-31,ty-104,kind===2?593:440,342,pulse(t,beat,4,11),angle);
  }
  art.glow(2,tx-122,ty-119,744,484,pulse(t,342,12,18)*.51,.20);
  art.strike(3,tx+45,ty-94,1120,723,finish);
  ctx.restore();
  flash('255,229,163',Math.max(hit*.05,finish*.16));bands(t,'#362a39');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,171+time*5,142+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

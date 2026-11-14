"use strict";

const MaelleLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=MaelleLimitProfile;
 const art=assets('maelle',['cutin','court','poses','thrust','finish','props','effects']);
 const sheets=['poses','thrust','finish'];
 const shots=[
  [0,539,747,1149,737,842,419,.94,0,1],
  [31,539,747,1149,737,842,419,.94,0,1],
  [45,811,747,1163,738,986,424,.91,-.013,2],
  [54,907,747,1173,734,1040,422,.90,-.026,3],
  [68,907,747,1173,734,1040,422,.90,0,3],
  [92,1027,747,1262,708,1138,415,.88,.026,4],
  [112,975,747,1296,743,1131,427,.88,0,5],
  [134,1088,747,1327,712,1207,416,.85,-.017,6],
  [172,1007,747,1379,727,1193,425,.81,-.028,5],
  [195,1007,747,1411,743,1209,425,.81,0,5],
  [218,1151,747,1435,721,1290,421,.82,.023,6],
  [235,1105,747,1494,745,1293,426,.81,0,5],
  [254,1213,747,1516,709,1362,414,.80,-.024,7],
  [278,1261,747,1553,692,1404,409,.79,.022,8],
  [300,1145,747,1590,740,1376,426,.74,0,9],
  [320,1158,747,1624,739,1391,427,.72,-.013,10],
  [341,1395,747,1681,661,1530,415,.70,.027,11],
  [367,1395,747,1987,449,1653,384,.65,0,11],
  [406,1395,747,2272,245,1794,341,.61,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,8)));
  const finish=pulse(t,341,5,31);
  frameClip();
  ctx.fillStyle='#252333';ctx.fillRect(0,0,W,H);
  art.image('court',-81-cx*.019,-78-cy*.037,W+231,H+171);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.48,finish));
  art.grid('props',0,2,2,x-143,y+31,516,{alpha:Math.max(pulse(t,54,13,19),pulse(t,172,7,14),pulse(t,341,4,18))});
  art.grid('props',1,2,2,tx+73,ty+31,500,{alpha:pulse(t,95,5,27)});
  art.grid('props',2,2,2,x-32,y-52,522,{alpha:pulse(t,314,14,25)*.75});
  art.grid('props',3,2,2,tx+95,ty+43,640,{alpha:finish});
  target(opponent,tx,ty-hit*11,-.1-hit*.38-ease((t-342)/41)*1.42,2.62);
  art.grid(sheets[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,514);
  for(const [beat,kind,angle] of [[54,0,.18],[92,2,-.11],[134,1,.16],[172,0,-.12],[218,1,.12],[254,1,-.07],[278,2,-.30]]){
   art.strike(kind,tx-38,ty-113,kind===0?430:545,310,pulse(t,beat,4,10),angle);
  }
  art.glow(3,tx-167,ty-134,690,428,pulse(t,331,10,17)*.52,-.11);
  art.strike(3,tx+111,ty-127,1000,560,finish,-.10);
  ctx.restore();
  flash('241,221,255',Math.max(hit*.055,finish*.16));bands(t,'#252033');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,170+time*5,140+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

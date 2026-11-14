"use strict";

const TerrarianLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=TerrarianLimitProfile;
 const art=assets('terrarian',['cutin','court','poses','mine','finish','props','effects']);
 const sheets=['poses','mine','finish'];
 const shots=[
  [0,552,630,1138,625,849,384,.94,0,1],
  [30,552,630,1138,625,849,384,.94,0,1],
  [51,849,630,1198,610,1021,382,.88,.021,2],
  [86,911,639,1231,624,1080,387,.84,-.024,3],
  [107,961,776,1278,699,1119,461,.80,.012,4],
  [129,1066,888,1301,828,1187,525,.75,.02,5],
  [149,1101,888,1325,864,1215,548,.77,0,6],
  [170,1164,888,1434,847,1301,538,.78,-.02,7],
  [212,1286,773,1473,733,1384,463,.75,.026,8],
  [237,1320,697,1516,679,1419,425,.73,-.018,9],
  [254,1428,548,1631,602,1526,371,.72,.021,9],
  [289,1511,622,1690,604,1597,380,.73,-.023,10],
  [313,1539,629,1773,623,1654,385,.73,0,10],
  [344,1597,629,1838,571,1720,367,.69,.026,11],
  [367,1597,629,2042,345,1810,328,.64,0,11],
  [408,1597,629,2348,134,1945,292,.61,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,344,5,31);
  frameClip();
  ctx.fillStyle='#1c2438';ctx.fillRect(0,0,W,H);
  art.image('court',-91-cx*.015,-148-(cy-390)*.56,W+250,H+315);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.48,finish));
  const digging=ease((t-75)/20);
  art.grid('props',0,2,2,813,669,560,{alpha:1-digging});
  art.grid('props',0,2,2,813,669+digging*240,560,{alpha:digging*(1-ease((t-119)/30))});
  art.grid('props',1,2,2,1127,927,579,{alpha:pulse(t,170,44,61)});
  art.grid('props',2,2,2,x+44,y-100,626,{anchorY:.57,alpha:pulse(t,304,75,55)});
  art.grid('props',3,2,2,mix(x,tx,.43),ty+48,556,{alpha:Math.max(pulse(t,85,6,32),finish)});
  target(opponent,tx,ty-hit*11,-.1-hit*.36-ease((t-345)/40)*1.44,2.60);
  ctx.imageSmoothingEnabled=false;
  art.grid(sheets[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,493);
  for(const [beat,kind,angle] of [[51,0,.12],[86,0,-.16],[129,1,.14],[170,2,-.03],[212,1,-.3],[254,2,-.31],[289,2,.22]]){
   art.strike(kind,tx-39,ty-98,kind===2?576:455,345,pulse(t,beat,4,11),angle);
  }
  art.glow(2,tx-99,ty-123,725,501,pulse(t,332,12,20)*.54,-.19);
  art.strike(3,tx+50,ty-102,1155,729,finish,-.09);
  ctx.restore();
  flash('229,248,224',Math.max(hit*.051,finish*.16));bands(t,'#192232');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,172+time*5,143+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

"use strict";

const MonoLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=MonoLimitProfile;
 const art=assets('mono',['cutin','court','poses','draw','finish','props','effects']);
 const atlases=['poses','draw','finish'];
 const shots=[
  [0,532,749,1088,729,811,423,.93,0,1],
  [30,532,749,1088,729,811,423,.93,0,1],
  [55,838,748,1127,707,976,424,.90,.023,3],
  [78,920,749,1167,724,1044,423,.86,0,2],
  [96,940,749,1237,643,1087,401,.83,-.027,4],
  [125,994,727,1364,630,1165,390,.81,.019,5],
  [148,1116,699,1427,687,1257,391,.80,.023,6],
  [171,1202,686,1503,648,1340,381,.78,-.028,7],
  [190,1288,708,1517,603,1396,382,.79,0,5],
  [208,1228,747,1617,686,1417,425,.77,.019,-8],
  [233,1104,748,1627,721,1363,432,.75,-.022,-5],
  [254,1020,747,1608,690,1321,420,.74,.012,-6],
  [274,1042,748,1572,724,1303,424,.75,0,9],
  [292,1061,748,1603,661,1344,411,.74,.02,10],
  [315,1066,748,1637,721,1343,429,.73,0,10],
  [333,1114,748,1708,675,1412,411,.70,-.029,11],
  [359,1114,749,2009,477,1509,378,.64,0,12],
  [394,1114,749,2275,266,1657,336,.60,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function sketch(t,x,y){
  const phase=t<213?ease((t-77)/91):ease((t-219)/85);
  const alpha=t<213?pulse(t,136,57,66):pulse(t,274,55,63);
  if(!alpha)return;
  const base=t<213?884:1021;
  ctx.save();
  ctx.globalAlpha*=alpha;
  ctx.lineCap='round';
  for(const [offset,color] of [[0,'#dc6d4c'],[12,'#e4aa47'],[24,'#39a9a9']]){
   ctx.beginPath();ctx.moveTo(base,748+offset);
   ctx.quadraticCurveTo(mix(base,x-102,phase),y+56+offset,mix(base,x+82,phase),y+offset);
   ctx.lineWidth=8;ctx.strokeStyle=color;ctx.stroke();
  }
  ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,333,4,24);
  frameClip();
  ctx.fillStyle='#41606a';ctx.fillRect(0,0,W,H);
  art.image('court',-87-cx*.017,-81-cy*.022,W+231,H+167);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.53,finish));
  sketch(t,x,y);
  const jump=ease((t-88)/39);
  art.grid('props',0,2,2,mix(980,tx,jump),mix(762,ty+27,jump)-Math.sin(jump*Math.PI)*140,333,{alpha:pulse(t,106,18,36)});
  const charge=ease((t-153)/57);
  art.grid('props',1,2,2,mix(1102,tx,charge),mix(762,ty+22,charge),486,{alpha:pulse(t,179,24,46)});
  const rise=ease((t-266)/54);
  art.grid('props',2,2,2,1404,748,692+rise*163,{alpha:rise*(1-ease((t-336)/44))});
  art.grid('props',3,2,2,tx+107,ty+27,555,{alpha:pulse(t,336,6,35)});
  art.strike(3,tx+51,ty-116,1041,701,finish);
  for(const [beat,kind,angle] of [[55,0,.12],[96,1,-.25],[125,1,-.15],[171,2,0],[208,2,-.12],[254,0,0],[292,2,-.15]]){
   art.strike(kind,tx-28,ty-106,kind===2?510:417,342,pulse(t,beat,3,9),angle);
  }
  target(opponent,tx,ty-hit*11,-.11-hit*.34-ease((t-334)/38)*1.45,2.75);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,438,{face:Math.sign(signedPose)});
  ctx.restore();
  flash('254,235,199',Math.max(hit*.053,finish*.17));bands(t,'#263a46');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,172+time*5,142+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

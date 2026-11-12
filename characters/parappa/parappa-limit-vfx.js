"use strict";

const ParappaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=ParappaLimitProfile;
 const art=assets('parappa',['cutin','court','poses','skate','dance','props','effects']);
 const shots=[
  [0,534,746,966,735,753,423,.97,0,1],
  [30,534,746,966,735,753,423,.97,0,1],
  [43,624,746,966,733,812,421,.98,-.009,1],
  [59,743,746,955,721,845,416,.98,.01,2],
  [75,765,746,969,704,856,409,.97,-.011,3],
  [91,773,746,977,721,867,415,.97,.01,4],
  [111,698,735,1001,734,852,416,.94,0,5],
  [124,783,654,1015,707,903,377,.89,-.017,5],
  [139,924,519,1093,645,1002,367,.86,.014,6],
  [156,1095,527,1212,624,1143,356,.83,-.016,7],
  [171,1224,548,1363,651,1263,369,.84,.015,7],
  [188,1352,591,1448,664,1371,389,.86,0,8],
  [203,1297,729,1472,724,1390,420,.88,.017,8],
  [222,1310,746,1484,732,1388,417,.92,-.01,9],
  [235,1325,746,1472,702,1406,412,.92,.014,9],
  [251,1349,746,1494,708,1415,412,.91,-.013,10],
  [267,1370,746,1511,698,1433,408,.88,.014,11],
  [292,1349,746,1538,717,1440,417,.86,0,12],
  [315,1412,729,1590,699,1491,410,.83,.018,12],
  [335,1430,746,1794,507,1588,403,.78,0,12],
  [372,1433,746,2045,296,1696,399,.74,0,12]
 ];
 const atlases=['poses','skate','dance'];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 const peaks=(t,list,lead,tail)=>Math.max(...list.map(hit=>pulse(t,hit,lead,tail)));

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,number]=camera(shots,t);
  const pose=number-1;
  const strike=peaks(t,[59,75,91,235,251,267],4,9);
  const skate=peaks(t,[139,171,203],4,10);
  const finish=pulse(t,315,6,23);
  frameClip();
  ctx.fillStyle='#121a2b';ctx.fillRect(0,0,W,H);
  art.image('court',-81-cx*.024,-66-cy*.039,W+222,H+127);
  world(cx,cy,zoom,roll,face,t,Math.max(strike*.38,skate*.49,finish));
  const railAlpha=ease((t-91)/29)*(1-ease((t-207)/28));
  art.grid('props',1,2,2,1095,783,652,{alpha:railAlpha});
  const boardAlpha=ease((t-97)/16)*(1-ease((t-212)/18));
  const boardLift=pulse(t,137,15,12);
  const dismount=ease((t-188)/22);
  const boardX=mix(x,1471,dismount),boardY=mix(y-38,718,dismount);
  ctx.save();ctx.translate(boardX,boardY);ctx.rotate(-.19*boardLift+.19*dismount);
  art.grid('props',0,2,2,0,0,269,{alpha:boardAlpha,anchorY:.5});
  ctx.restore();
  art.strike(1,boardX-24,boardY+4,370,310,skate,-.24);
  art.strike(3,tx+38,ty-178,840,657,finish);
  target(opponent,tx,ty-Math.max(strike,skate)*12,-.11-strike*.25-skate*.31-ease((t-316)/36)*1.48,2.86);
  art.grid(atlases[Math.floor(pose/4)],pose%4,2,2,x,y,408);
  art.strike(0,tx-48,ty-151,331,279,strike,.11);
  const beatAge=t-43;
  if(beatAge>=0&&t<310){
   const meter=.18+(1-ease((beatAge%32)/24))*.44;
   art.glow(2,x+4,y-31,420,300,meter);
  }
  const crowd=pulse(t,311,13,33);
  art.grid('props',2,2,2,1044,441,420,{alpha:crowd*.82});
  art.grid('props',3,2,2,1814,452,420,{alpha:crowd*.82});
  ctx.restore();
  flash('255,216,163',Math.max(strike*.071,skate*.061,finish*.18));
  bands(t,'#171222');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,171+time*6,149+time*4,1-time/profile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

"use strict";

const ToroLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=ToroLimitProfile;
 const art=assets('toro',['cutin','court','poses','ninja','oni','props','effects']);
 const shots=[
  [0,355,742,989,737,681,409,.96,0,1],
  [30,355,742,989,737,681,409,.96,0,1],
  [46,485,671,982,737,722,379,.96,-.012,1],
  [57,604,615,976,731,770,370,.95,0,2],
  [71,759,558,947,646,842,374,.95,.011,3],
  [81,714,615,976,728,836,383,.94,0,2],
  [89,786,590,958,645,860,375,.94,-.014,4],
  [107,602,557,998,732,802,375,.91,0,-4],
  [120,501,676,1014,736,764,421,.91,.009,5],
  [135,533,553,1017,726,765,389,.91,-.01,6],
  [148,658,467,1021,708,830,350,.87,.013,7],
  [160,697,414,1037,695,858,322,.84,0,6],
  [172,782,403,1049,692,905,311,.84,-.011,7],
  [188,811,516,1066,710,933,363,.86,0,8],
  [200,810,742,1075,736,947,417,.9,.009,8],
  [217,860,742,1097,732,976,415,.92,0,9],
  [227,881,742,1102,727,991,405,.92,-.008,10],
  [235,899,742,1115,711,1007,418,.92,.017,11],
  [257,897,742,1145,722,1017,411,.90,0,10],
  [274,920,742,1187,710,1040,403,.87,.015,11],
  [294,899,742,1207,726,1053,419,.88,0,10],
  [319,941,742,1254,722,1090,409,.82,.019,11],
  [337,950,742,1522,493,1191,395,.78,0,12],
  [367,947,742,1835,285,1300,401,.75,0,12]
 ];
 const poseAtlases=['poses','ninja'];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function stars(t,hit,x,y,tx,ty){
  const progress=ease((t-hit+12)/12);
  if(progress<=0||t>hit+9)return;
  const alpha=ease((t-hit+12)/4)*(1-ease((t-hit)/9));
  const startX=x+93,startY=y-164,endX=tx-42,endY=ty-132;
  const angle=Math.atan2(endY-startY,endX-startX);
  art.strike(1,mix(startX,endX,progress),mix(startY,endY,progress),283,246,alpha,angle,-1);
  art.strike(0,tx-31,ty-143,240,210,pulse(t,hit,3,9));
 }

 function mochi(t,hit,tx,ty,count,size){
  const progress=ease((t-hit+24)/24);
  if(progress<=0||t>hit+8)return;
  for(let i=0;i<count;i++){
   const offset=(i-(count-1)/2)*size*.39;
   art.grid('props',2,2,2,tx+offset,mix(-120-i*65,ty-156,progress),size,
    {anchorY:.5,alpha:ease((t-hit+24)/7)*(1-ease((t-hit)/8))});
  }
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const kick=Math.max(pulse(t,71,4,9),pulse(t,89,4,9));
  const ninja=Math.max(pulse(t,148,3,10),pulse(t,172,3,10));
  const stomp=Math.max(pulse(t,235,4,10),pulse(t,274,4,10));
  const finish=pulse(t,319,5,24);
  frameClip();
  ctx.fillStyle='#261e23';ctx.fillRect(0,0,W,H);
  art.image('court',-80-cx*.023,-65-cy*.04,W+219,H+122);
  world(cx,cy,zoom,roll,face,t,Math.max(kick*.44,ninja*.36,stomp*.52,finish));
  const tableFade=1-ease((t-108)/23);
  art.grid('props',0,2,2,620,750,265,{alpha:tableFade});
  const door=ease((t-95)/17)*(1-ease((t-183)/25));
  target(opponent,tx,ty-Math.max(kick,ninja,stomp)*13,-.11-kick*.26-ninja*.17-stomp*.19-ease((t-321)/34)*1.53,3.38);
  const conceal=pulse(t,119,9,7);
  const doorX=509-ease((t-127)/25)*123;
  if(t>=139)art.grid('props',1,2,2,doorX,746,568,{alpha:door});
  if(pose<8)art.grid(poseAtlases[Math.floor(pose/4)],pose%4,2,2,x,y,360,
   {face:Math.sign(signedPose),alpha:1-conceal*.88});
  if(t<139)art.grid('props',1,2,2,doorX,746,568,{alpha:door});
  const speech=pulse(t,34,9,13);
  if(speech>0){
   art.grid('props',3,2,2,x+72,y-370,260,{alpha:speech,anchorY:.5});
   ctx.save();ctx.translate(x+72,y-375);ctx.scale(face,1);ctx.globalAlpha=speech;
   ctx.fillStyle='#253c35';ctx.font='bold 31px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.fillText('へんしんニャ！',0,0);ctx.restore();
  }
  art.strike(2,510,579,419,360,pulse(t,121,6,16));
  art.strike(2,811,605,369,325,pulse(t,201,5,14));
  art.strike(0,tx-49,ty-156,269,304,kick,Math.PI/2);
  stars(t,148,x,y,tx,ty);
  stars(t,172,x,y,tx,ty);
  mochi(t,235,tx,ty,1,264);
  mochi(t,274,tx,ty,2,301);
  mochi(t,319,tx,ty,3,485);
  art.strike(3,tx,ty-121,394,347,stomp);
  art.strike(3,tx+40,ty-161,748,612,finish);
  if(pose>=8)art.grid('oni',pose%4,2,2,x,y,360);
  ctx.restore();
  flash('255,232,176',Math.max(kick*.065,ninja*.052,stomp*.076,finish*.17));
  bands(t,'#1d1821');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,171+time*5,148+time*4,1-time/profile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

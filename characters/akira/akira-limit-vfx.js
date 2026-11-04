'use strict';
const AkiraLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('akira',['cutin','court','poses','effects']);
 const shots=[
  [0,471,663,837,641,703,443,1.08,-.026,0],
  [42,475,660,902,637,739,434,1.09,.024,0],
  [72,433,663,952,592,734,392,.94,-.036,1],
  [103,393,658,1012,525,760,370,.86,-.022,1],
  [133,755,523,1056,538,839,380,.90,.037,2],
  [150,1006,606,1108,563,906,422,.98,-.026,2],
  [174,590,657,1358,320,931,426,.86,.027,3],
  [216,589,656,1700,190,913,443,.92,0,3]
 ];
 const beat=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 function draw({target:opponent,face,time}){
  const t=AkiraLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const rift=beat(t,57,82,148,181),bind=beat(t,35,57,108,133);
  const slash=beat(t,121,133,138,150),impact=beat(t,145,155,166,199);
  frameClip();
  ctx.fillStyle='#101729';ctx.fillRect(0,0,W,H);
  art.image('court',-50-t*.18,-52,W+146,H+105);
  world(cx,cy,z,roll,face,t,Math.max(impact,slash*.53));
  art.strike(2,1135,427,414+rift*249,527+rift*193,rift*.81);
  target(opponent,tx,ty,-.19-ease((t-151)/38)*1.4);
  const cuffX=x+(pose===0?102:-62),cuffY=y-(pose===0?195:111);
  const dx=tx-cuffX,dy=ty-72-cuffY,angle=Math.atan2(dy,dx);
  const span=Math.hypot(dx,dy)*mix(.22,1,ease((t-37)/19));
  art.strike(0,cuffX+Math.cos(angle)*span/2,cuffY+Math.sin(angle)*span/2,
   span+36,137,bind,angle);
  art.strike(1,1028,481,505+slash*372,352+slash*155,slash,-.15);
  art.strike(3,1100,479,426+impact*671,390+impact*227,impact);
  art.glow(3,1111,532,780+ease((t-155)/47)*510,338,impact*.37);
  art.grid('poses',pose,2,2,x,y,285);
  ctx.restore();
  flash('140,211,255',Math.max(impact*.25,slash*.12));bands(t,'#130f26');
  art.portrait(1+Math.max(0,t)*.0012,ease(t/4)*(1-ease((t-18)/10)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,151+time*6,75,1-time/AkiraLimitProfile.contactHold*.58,-.08,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

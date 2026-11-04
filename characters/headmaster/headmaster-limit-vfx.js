'use strict';
const HeadmasterLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('headmaster',['cutin','court','poses','effects']);
 const beat=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 const shots=[
  [0,484,650,935,637,721,432,1.06,-.022,0],
  [40,484,650,935,637,721,426,1.07,.013,0],
  [91,451,648,925,632,698,391,.89,0,1],
  [117,522,379,939,621,735,354,.83,-.028,2],
  [144,654,553,942,635,790,410,1.01,.026,2],
  [155,663,650,958,614,811,446,1.02,-.018,3],
  [186,551,649,1328,294,864,431,.88,.018,0],
  [232,551,648,1699,171,902,432,.88,0,0]
 ];
 function draw({target:opponent,face,time}){
  const t=HeadmasterLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const tiles=beat(t,34,42,108,136),drop=beat(t,122,143,152,165);
  const blast=beat(t,147,155,157,185),stamp=beat(t,172,183,202,228);
  frameClip();
  ctx.fillStyle='#19291f';ctx.fillRect(0,0,W,H);
  art.image('court',-67+t*.10,-51,W+142,H+110);
  world(cx,cy,z,roll,face,t,Math.max(blast,drop*.38));
  const revealed=Math.max(0,Math.min(5,Math.floor((t-38)/11)+1));
  if(revealed){
   ctx.save();ctx.beginPath();ctx.rect(425,235,36+revealed*126,170);ctx.clip();
   art.strike(0,773,318,701,525,tiles);ctx.restore();
  }
  for(let i=0;i<revealed;i++){
   const light=beat(t,37+i*11,40+i*11,42+i*11,49+i*11);
   art.glow(2,518+i*128,317,126,110,light*.46);
  }
  art.glow(2,944,587,540,205,blast*.52);
  target(opponent,tx,ty,-.13-ease((t-153)/34)*1.4);
  art.strike(1,946,mix(246,562,ease((t-122)/33)),287+drop*164,456+drop*75,drop,.08);
  art.strike(2,955,585,418+blast*580,290+blast*208,blast);
  art.grid('poses',pose,2,2,x,y,272);
  ctx.restore();
  flash('255,212,131',blast*.24);bands(t,'#18291c');
  art.strike(3,W*.72,H*.43,363+stamp*133,358+stamp*119,stamp,-.2);
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(2,x,y,140+time*5,128,1-time/HeadmasterLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

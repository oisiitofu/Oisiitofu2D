'use strict';
const SukaponLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('sukapon',['cutin','court','poses','effects']);
 const beat=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 const shots=[
  [0,484,650,893,634,688,439,1.14,.022,0],
  [48,448,644,902,626,691,443,1.04,-.013,1],
  [76,493,643,961,578,724,406,.91,.017,1],
  [109,590,488,988,590,777,373,.89,-.045,2],
  [132,822,571,1020,617,872,420,1.07,.028,2],
  [157,685,640,1066,608,885,444,1.03,-.022,3],
  [182,698,645,1340,421,948,425,.89,.024,3],
  [199,682,647,1475,346,934,433,.89,.01,0],
  [244,677,648,1755,213,924,441,.9,0,0]
 ];
 function draw({target:opponent,face,time}){
  const t=SukaponLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const head=beat(t,33,42,61,87),rollTrail=beat(t,83,104,131,145);
  const punch=beat(t,146,160,168,184),blast=beat(t,161,173,180,208);
  const fly=ease((t-34)/29),returning=ease((t-65)/13);
  const hx=mix(mix(x+4,tx,fly),x+4,returning);
  const hy=mix(mix(y-208,ty-125,fly)-Math.sin(fly*Math.PI)*142,y-201,returning);
  frameClip();
  ctx.fillStyle='#101627';ctx.fillRect(0,0,W,H);
  art.image('court',-76-t*.14,-60,W+186,H+122);
  world(cx,cy,z,roll,face,t,Math.max(blast,punch*.6));
  art.glow(1,x-64,y-113,593,382,rollTrail*.42,-.27);
  art.strike(1,x+68,y-125,389+rollTrail*236,306,rollTrail,-.28);
  target(opponent,tx,ty,.06-ease((t-168)/38)*1.45);
  if(pose===2){
   ctx.save();ctx.translate(x,y-125);
   ctx.rotate(TAU*2*ease((t-93)/50));
   art.grid('poses',pose,2,2,0,125,267);ctx.restore();
  }else art.grid('poses',pose,2,2,x,y,267);
  if(pose===1)art.strike(0,hx,hy,166+head*201,157+head*52,1,-.11);
  const extension=ease((t-146)/14);
  if(pose===3){
   const reach=extension*(1-ease((t-171)/19));
   art.strike(2,mix(x+75,1060,reach),y-139,150+punch*435,160+punch*158,1,-.09);
  }
  art.strike(3,1092,525,365+blast*614,330+blast*220,blast);
  ctx.restore();
  flash('255,176,196',Math.max(blast*.28,punch*.12));bands(t,'#18102c');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(3,x,y,139+time*5,136,1-time/SukaponLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

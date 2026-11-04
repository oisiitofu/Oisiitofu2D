'use strict';
const DoshinLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('doshin',['cutin','court','poses','effects']);
 const shots=[
  [0,475,649,953,632,712,421,1.04,-.012,0],
  [55,485,649,956,630,728,408,.99,.012,1],
  [95,476,650,1010,613,746,396,.93,-.016,0],
  [121,513,649,1028,614,767,369,.81,.022,2],
  [143,533,649,1041,609,783,390,.92,-.025,3],
  [154,502,649,1056,611,784,383,.87,.014,2],
  [166,548,649,1072,614,810,392,.87,-.021,3],
  [191,555,649,1137,536,836,361,.83,.016,3],
  [246,519,649,1715,180,924,431,.86,0,0]
 ];
 const pulse=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 function draw({target:opponent,face,time}){
  const t=DoshinLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const lift=pulse(t,47,61,65,76),wave=pulse(t,70,83,88,98);
  const shift=pulse(t,98,112,123,138),slash=pulse(t,134,143,147,154),slam=pulse(t,158,166,170,179);
  const eruption=pulse(t,176,188,197,225),flinch=Math.max(lift,wave,slash,slam);
  frameClip();ctx.fillStyle='#33291b';ctx.fillRect(0,0,W,H);art.image('court',-65-t*.09,-44,W+155,H+94);
  world(cx,cy,z,roll,face,t,Math.max(eruption,flinch*.55));
  art.glow(3,x,y-180,440,590,shift*.67);
  art.grid('poses',pose,2,2,x,y,pose>=2?510:385,{alpha:1-shift*.28});
  target(opponent,tx+flinch*23,ty-flinch*24,-.12-flinch*.24-ease((t-191)/35)*1.3);
  art.strike(0,tx-31,ty-113,345,286,lift);
  art.strike(1,mix(x+115,tx-12,ease((t-70)/13)),ty-55,445,164,wave);
  art.strike(2,tx-70,ty-140,496,262,slash,-.1);
  art.strike(0,tx+5,ty-113,364,286,slam,.14);
  art.strike(3,1093,550-eruption*145,421+eruption*376,299+eruption*360,eruption);
  ctx.restore();flash('255,158,86',Math.max(eruption*.28,shift*.18));bands(t,'#332219');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(1,x,y+14,161+time*5,96,1-time/DoshinLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const RionLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('rion',['cutin','court','poses','effects']);
 const shots=[
  [0,500,651,989,626,739,428,1.10,-.012,0],
  [48,617,651,971,628,788,434,1.07,.018,1],
  [63,630,650,986,621,801,428,1.04,-.016,2],
  [78,663,650,1010,619,838,430,1.10,.017,1],
  [92,705,650,1030,620,856,430,1.04,-.017,2],
  [114,656,650,1053,616,855,372,.85,.013,0],
  [152,712,650,1069,614,890,411,.95,-.018,3],
  [175,727,650,1113,592,913,369,.85,.014,3],
  [195,698,650,1267,441,944,413,.87,-.012,0],
  [245,611,651,1727,164,941,430,.87,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=RionLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const fracture=pulse(t,110,122,127,146),gather=pulse(t,130,149,164,179),voidBlast=pulse(t,165,185,193,223);
  const flinch=Math.max(...Array.from(RionLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#251626';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.12,-54,W+172,H+114);
  world(cx,cy,z,roll,face,t,Math.max(voidBlast,flinch*.56));
  art.glow(2,x+123,y-157,438+gather*220,467,gather);
  ctx.save();ctx.shadowColor='#b34c97';ctx.shadowBlur=14;
  art.grid('poses',pose,2,2,x,y,392);
  ctx.restore();
  target(opponent,tx+flinch*26,ty-flinch*16,-.1-flinch*.2-ease((t-188)/38)*1.49);
  for(const [index,hit,angle,offset] of [[0,53,-.18,0],[1,66,.14,16],[0,82,-.46,-33],[1,97,.31,-17],[1,159,-.11,0]]){
   const slash=pulse(t,hit-4,hit,hit+2,hit+8);
   art.strike(index,tx-83,ty-117+offset,316+slash*157,184+slash*84,slash,angle);
  }
  art.strike(2,tx-9,ty-151,412,418,fracture);
  art.strike(3,1118,505-voidBlast*104,463+voidBlast*500,391+voidBlast*249,voidBlast);
  ctx.restore();flash('255,132,223',Math.max(voidBlast*.28,gather*.08));bands(t,'#2b192e');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,148+time*5,113,1-time/RionLimitProfile.contactHold*.6,-.14*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

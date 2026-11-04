'use strict';
const RayLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('ray',['cutin','court','poses','effects','bomb']);
 const shots=[
  [0,450,650,1001,630,717,426,1.08,-.012,0],
  [38,481,648,993,629,730,419,.96,.018,1],
  [93,499,647,1021,621,765,424,1.01,-.014,2],
  [136,524,644,1049,608,776,368,.84,.019,3],
  [177,681,627,1064,604,868,414,1.01,-.019,3],
  [196,633,650,1280,432,891,418,.87,.016,2],
  [249,557,650,1706,163,933,435,.89,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=RayLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const charge=pulse(t,169,182,189,194),beam=pulse(t,181,191,198,222);
  const flinch=Math.max(...Array.from(RayLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+7)));
  frameClip();ctx.fillStyle='#121a34';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.11,-54,W+170,H+109);
  world(cx,cy,z,roll,face,t,Math.max(beam,flinch*.54));
  const throwProgress=ease((t-34)/18);
  art.grid('bomb',0,1,1,mix(x+112,tx-22,throwProgress),mix(y-143,ty-43,throwProgress)-130*Math.sin(throwProgress*Math.PI),79,{alpha:pulse(t,34,38,51,53)});
  for(const [start,impact,offset] of [[66,84,-118],[139,162,-174]]){
   const flight=ease((t-start)/(impact-start));
   art.strike(1,mix(x+106,tx-48,flight),mix(y-145+offset,ty-100,flight)-88*Math.sin(flight*Math.PI),228,146,pulse(t,start,start+4,impact-1,impact+1),.12);
  }
  art.grid('poses',pose,2,2,x,y,302);
  target(opponent,tx+flinch*24,ty-flinch*18,-.1-flinch*.17-ease((t-190)/39)*1.5);
  for(const start of [97,111,125]){
   const flight=ease((t-start)/7);
   art.strike(0,mix(x+131,tx-24,flight),mix(y-131,ty-104,flight),177,92,pulse(t,start,start+2,start+7,start+10));
  }
  art.strike(2,tx-4,ty-107,193+flinch*75,169+flinch*48,flinch);
  art.glow(2,x+136,y-134,221,207,charge);
  const length=mix(240,921,ease((t-181)/10));
  art.strike(3,x+94+length*.5,y-154,length,244+beam*152,beam,-.08);
  ctx.restore();flash('160,216,255',beam*.28);bands(t,'#141d33');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,139+time*5,88,1-time/RayLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

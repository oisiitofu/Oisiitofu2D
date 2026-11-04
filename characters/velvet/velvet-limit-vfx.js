'use strict';
const VelvetLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('velvet',['cutin','court','poses','effects']);
 const shots=[
  [0,480,650,982,626,731,421,1.10,.014,0],
  [47,621,649,974,623,793,427,1.06,-.016,1],
  [86,696,649,1022,619,858,425,1.05,.016,1],
  [99,755,650,1039,611,889,413,.94,-.019,2],
  [122,659,650,1021,593,840,382,.85,.012,2],
  [144,720,650,1070,609,893,395,.96,-.017,3],
  [173,750,650,1105,613,926,386,.87,.019,3],
  [198,703,650,1268,490,949,401,.84,-.013,3],
  [249,627,649,1736,163,952,433,.88,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=VelvetLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const grip=pulse(t,96,105,122,136),burst=pulse(t,173,191,197,224);
  const flinch=Math.max(...Array.from(VelvetLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#2c182b';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.10,-54,W+172,H+114);
  world(cx,cy,z,roll,face,t,Math.max(burst,flinch*.53));
  art.glow(2,x+111,y-127,489,363,grip*.64);
  ctx.save();ctx.shadowColor='#af557f';ctx.shadowBlur=13;
  art.grid('poses',pose,2,2,x,y,385);
  ctx.restore();
  target(opponent,tx+flinch*21-grip*60,ty-flinch*18-grip*26,-.1-flinch*.22-ease((t-194)/36)*1.49);
  for(const [index,hit,angle] of [[0,52,-.18],[0,64,.23],[0,79,-.35],[1,98,.13],[1,136,-.23],[1,162,.17]]){
   const swipe=pulse(t,hit-4,hit,hit+2,hit+8);
   art.strike(index,tx-89,ty-120,330+swipe*145,179+swipe*93,swipe,angle);
  }
  art.strike(2,tx-58,ty-113,262+grip*144,281,grip*.75);
  art.strike(3,mix(x+217,1118,ease((t-173)/18)),521-burst*70,462+burst*488,371+burst*261,burst);
  ctx.restore();flash('255,126,173',burst*.25);bands(t,'#271b2a');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,146+time*5,108,1-time/VelvetLimitProfile.contactHold*.6,-.12*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const KaratekaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('karateka',['cutin','court','poses','effects','pot']);
 const shots=[
  [0,460,654,995,633,719,431,1.10,.011,0],
  [52,464,652,981,638,722,423,1.05,-.014,0],
  [102,471,652,976,633,738,437,1.08,.013,0],
  [134,540,652,962,629,746,432,1.03,-.021,0],
  [150,604,643,958,621,760,423,.89,-.029,0],
  [168,754,620,904,602,801,414,1.05,.023,3],
  [182,676,650,1272,345,887,428,.86,.026,3],
  [225,639,653,1690,177,920,444,.88,0,0]
 ];
 const beat=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 const punches=[71,87,103,119];
 function draw({target:opponent,face,time}){
  const t=KaratekaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,shotPose]=camera(shots,t);
  const kick=beat(t,157,167,172,188),blast=beat(t,165,174,179,203);
  const recoil=-.15-ease((t-169)/34)*1.51;
  frameClip();
  ctx.fillStyle='#273151';ctx.fillRect(0,0,W,H);
  art.image('court',-60-t*.11,-50,W+147,H+106);
  world(cx,cy,z,roll,face,t,Math.max(kick*.62,blast));
  let pose=shotPose;
  for(let i=0;i<punches.length;i++){
   const hit=punches[i],p=ease((t-hit+16)/16);
   const flight=beat(t,hit-17,hit-12,hit-2,hit+1);
   art.grid('pot',0,1,1,mix(997,x+133,p),mix(458,y-149,p)-Math.sin(p*Math.PI)*46,127,{anchorY:.5,alpha:flight});
   if(t>=hit-1&&t<=hit+7)pose=1+i%2;
   const impact=beat(t,hit-1,hit+2,hit+4,hit+12);
   art.strike(i===3?2:1,x+145,y-157,225+i*30,178+i*18,impact,i%2?.12:-.12);
  }
  art.glow(2,x+41,y-144,354,300,kick*.45,-.04);
  art.grid('poses',pose,2,2,x,y,278);
  if(t<177)target(opponent,tx,ty,recoil);
  art.strike(3,905,479,412+blast*579,345+blast*200,blast);
  if(t>=177)target(opponent,tx,ty,recoil);
  ctx.restore();
  flash('255,216,152',blast*.26);bands(t,'#202945');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(1,x,y,136+time*5,126,1-time/KaratekaLimitProfile.contactHold*.58,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const ElzaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('elza',['cutin','court','poses','effects']);
 const shots=[
  [0,512,653,907,639,704,427,1.12,.018,0],
  [62,475,656,877,635,673,461,1.09,-.027,0],
  [91,641,656,847,638,741,447,1.05,-.013,1],
  [124,755,327,834,638,754,368,.79,.026,2],
  [141,828,385,839,639,777,365,.81,.012,2],
  [160,792,651,876,599,781,449,1.03,-.031,3],
  [187,693,654,1135,335,814,408,.87,.015,3],
  [228,689,656,1524,171,864,437,.91,0,3]
 ];
 const beat=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 function draw({target:opponent,face,time}){
  const t=ElzaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const gathering=beat(t,27,60,126,154),descent=beat(t,140,151,161,174);
  const fracture=beat(t,153,164,177,211);
  frameClip();
  ctx.fillStyle='#202633';ctx.fillRect(0,0,W,H);
  art.image('court',-64+t*.10,-48,W+136,H+99);
  world(cx,cy,z,roll,face,t,Math.max(fracture,descent*.6));
  art.glow(0,845,619,525+gathering*240,273,gathering*.79);
  art.strike(3,763,564,476+gathering*198,192,gathering*.76);
  target(opponent,tx,ty,.18-ease((t-155)/39)*1.42);
  art.grid('poses',pose,2,2,x,y,280);
  art.strike(1,945,mix(312,523,ease((t-141)/22)),345+descent*150,533+descent*96,descent,.12);
  art.strike(2,876,581,484+fracture*560,274+fracture*173,fracture);
  ctx.restore();
  flash('192,225,255',Math.max(descent*.12,fracture*.26));bands(t,'#171d2b');
  art.portrait(1+Math.max(0,t)*.0013,ease(t/4)*(1-ease((t-18)/11)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(1,x,y,121+time*4,156,1-time/ElzaLimitProfile.contactHold*.62,.24*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

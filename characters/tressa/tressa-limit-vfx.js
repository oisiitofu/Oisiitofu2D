'use strict';
const TressaLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('tressa',['cutin','court','poses','hired','effects']);
 const shots=[
  [0,483,650,907,622,705,456,1.12,-.032,0],
  [33,504,644,898,620,714,454,1.21,.021,1],
  [55,514,645,895,621,741,442,1.05,-.035,1],
  [77,516,643,922,592,740,447,1.08,.072,2],
  [97,524,643,923,561,773,443,1.02,-.051,2],
  [114,538,639,952,577,800,444,1.07,.057,2],
  [136,550,642,960,608,805,449,1.09,-.063,3],
  [154,559,640,971,613,796,430,1.00,-.037,3],
  [175,627,633,969,612,805,441,1.14,.042,3],
  [191,737,629,990,604,851,446,1.25,-.065,4],
  [205,774,642,1127,478,882,441,1.01,.061,4],
  [225,769,646,1351,354,900,448,.92,-.025,5],
  [249,769,646,1544,251,910,454,.92,0,5]
 ];
 const hired=[
  {start:58,attack:77,end:103,from:[304,663],to:[784,643]},
  {start:81,attack:98,end:123,from:[1182,526],to:[1091,548]},
  {start:105,attack:131,end:155,from:[441,647],to:[942,600]}
 ];
 function mercenaries(t){
  for(const [i,{start,attack,end,from,to}] of hired.entries()){
   if(t<start||t>=end)continue;
   const move=ease((t-start)/(attack-start)),exit=ease((t-attack)/(end-attack));
   const x=mix(from[0],to[0],move)+(i===1?1:-1)*exit*122;
   const y=mix(from[1],to[1],move)-(i===2?Math.sin(move*Math.PI)*120:0);
   const alpha=ease((t-start)/8)*(1-ease((t-end+11)/11));
   art.grid('hired',i,3,1,x,y,288,{alpha,face:i===1?-1:1});
  }
 }
 function coin(x,y,r,angle,alpha){
  ctx.save();ctx.translate(x,y);ctx.rotate(angle*.27);ctx.scale(Math.max(.16,Math.abs(Math.cos(angle))),1);
  ctx.globalAlpha=alpha;
  ctx.fillStyle='#ffd977';ctx.strokeStyle='#87521b';ctx.lineWidth=2;
  ctx.beginPath();ctx.ellipse(0,0,r,r*.91,0,0,TAU);ctx.fill();ctx.stroke();
  ctx.strokeStyle='#fff5ba';ctx.beginPath();ctx.ellipse(0,0,r*.78,r*.70,0,0,TAU);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,r*.41);ctx.quadraticCurveTo(-r*.63,-r*.18,0,-r*.49);ctx.quadraticCurveTo(r*.60,-r*.16,0,r*.41);ctx.stroke();
  ctx.restore();
 }
 function coinToss(t,x,y){
  const p=(t-35)/38;if(p<0||p>=1)return;
  const px=x+77+p*266,py=y-158-Math.sin(p*Math.PI)*164;
  coin(px,py,23,t*.21,unit((1-p)*6));
  art.glow(0,px,py,131,117,ease((t-49)/9)*(1-ease((t-61)/12)));
 }
 function payout(t,x,y,weight){
  if(weight<=0)return;
  for(let n=0;n<33;n++){
   const age=t-189-(n%5)*3;if(age<0)continue;
   const a=n*2.39996,px=x+Math.cos(a)*age*(3+n%7*.86);
   const py=y-(4+n%9*.74)*age+age*age*.103+Math.sin(a)*31;
   coin(px,py,6+n%7,n+age*.27,weight*(.57+n%5*.105));
  }
 }
 function cutin(t,time){
  if(t>=31)return;
  const s=1+time*.001,alpha=ease(t/5)*(1-ease((t-24)/7));
  ctx.save();ctx.beginPath();ctx.moveTo(0,114);ctx.lineTo(W,63);ctx.lineTo(W,683);ctx.lineTo(0,758);ctx.closePath();ctx.clip();
  art.portrait(s,alpha);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=TressaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const charge=ease((t-141)/37)*(1-ease((t-184)/11));
  const strike=ease((t-184)/8)*(1-ease((t-197)/26));
  const hit=t>=192?unit(1-(t-192)/13):0;
  frameClip();ctx.fillStyle='#342e2b';ctx.fillRect(0,0,W,H);
  art.image('court',-96-t*.17,-77,W+256,H+140);
  ctx.fillStyle='rgba(42,22,46,'+(charge*.24)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit,strike*.49));
  mercenaries(t);
  target(opponent,tx,ty,-.13+hit*.59-ease((t-197)/26)*1.04);
  art.grid('poses',index,3,2,x,y,352);
  coinToss(t,x,y);
  for(const [i,at] of [76,102,130].entries()){
   const beat=ease((t-at)/5)*(1-ease((t-at-6)/13));
   art.strike(1,tx-24,ty-111,536,174,beat*.88,i===1?.31:-.15,i===1?-1:1);
  }
  art.glow(2,tx,ty-151,380+charge*260,368+charge*240,charge*.89,t*.023);
  art.strike(1,969,479,984+strike*400,233+strike*165,strike*.73,-.12);
  art.strike(3,1027,521,661+strike*486,397+strike*218,strike*.74);
  payout(t,1000,527,ease((t-189)/8)*(1-ease((t-214)/25)));
  ctx.restore();flash('255,231,168',hit*.25);
  bands(t,'#1e1719');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/TressaLimitProfile.contactHold;
  art.strike(1,x,y,165+51*p,92,1-p*.58,-.08,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

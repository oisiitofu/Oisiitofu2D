'use strict';
const ArthurLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('arthur',['cutin','court','poses','effects']);
 const shots=[
  [0,420,643,967,618,692,424,1.10,.012,0],
  [40,492,588,987,611,739,398,1.05,-.013,0],
  [63,498,646,1022,609,762,404,.98,.018,1],
  [92,481,648,1046,613,766,408,.95,-.014,1],
  [115,523,645,1077,604,796,387,.89,.015,2],
  [158,549,641,1126,590,831,377,.85,-.017,2],
  [186,516,643,1153,574,832,339,.81,.014,3],
  [216,501,646,1182,573,854,345,.77,-.014,3],
  [234,528,643,1433,403,979,365,.83,.018,3],
  [251,531,644,1765,231,1039,416,.9,0,3]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({attacker,target:opponent,face,time}){
  const t=ArthurLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const gold=pulse(t,87,99,108,124),charge=pulse(t,182,204,209,217),finish=pulse(t,207,216,221,240);
  const flinch=Math.max(...Array.from(ArthurLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+8)));
  const goldAtStart=arthurArmor(attacker)===2;
  frameClip();ctx.fillStyle='#1d172e';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.11,-105,W+177,H+113);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.52,finish));
  art.glow(2,x+15,y-132,422,331,gold*.78,-.36);
  art.glow(3,x+51,y-212,300+charge*212,340+charge*215,charge*.64);
  art.grid('poses',goldAtStart&&pose<2?2:pose,2,2,x,y,325);
  const drawTarget=()=>target(opponent,tx+flinch*22,ty-flinch*23,-.09-flinch*.24-ease((t-218)/28)*1.48);
  if(t<216)drawTarget();
  for(const [hit,kind,arc] of [[44,0,30],[62,1,51],[79,1,67],[114,2,16],[137,2,47],[159,2,80]]){
   const flight=ease((t-hit+11)/11),effect=goldAtStart&&kind===0?2:kind;
   art.strike(effect,mix(x+137,tx-43,flight),mix(y-152,ty-106,flight)-arc*Math.sin(flight*Math.PI),effect===1?312:422,effect===1?172:124,pulse(t,hit-11,hit-8,hit,hit+7),mix(-.14,.15,flight));
  }
  art.strike(3,tx-65,ty-283,289,472,pulse(t,173,178,181,190),-.09);
  art.strike(3,tx-14,ty-314-74*finish,415+finish*342,546+finish*388,finish);
  if(t>=216)drawTarget();
  ctx.restore();flash('255,219,157',Math.max(gold*.14,flinch*.13,finish*.26));bands(t,'#251732');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,171+time*6,109,1-time/ArthurLimitProfile.contactHold*.6,-.13,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

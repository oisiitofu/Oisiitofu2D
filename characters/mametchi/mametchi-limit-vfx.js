'use strict';
const MametchiLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('mametchi',['cutin','court','poses','effects','robot']);
 const shots=[
  [0,472,650,995,627,734,423,1.08,.014,0],
  [46,529,649,991,626,764,425,1.04,-.016,1],
  [77,519,650,1017,622,779,403,.92,.014,2],
  [99,510,650,1033,621,794,370,.80,-.016,2],
  [136,552,650,1063,617,817,380,.85,.015,2],
  [171,580,650,1093,609,856,394,.89,-.017,2],
  [199,615,601,1174,588,895,367,.84,.015,3],
  [217,605,650,1369,429,924,406,.86,-.014,0],
  [247,573,650,1725,172,945,432,.89,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=MametchiLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const build=pulse(t,77,102,195,225),charge=pulse(t,172,190,196,209),pop=pulse(t,188,201,208,229);
  const flinch=Math.max(...Array.from(MametchiLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#2b3451';ctx.fillRect(0,0,W,H);art.image('court',-74-t*.11,-54,W+177,H+114);
  world(cx,cy,z,roll,face,t,Math.max(pop,flinch*.48));
  const robotX=x+95,robotY=y+16+(1-build)*48;
  art.glow(2,robotX,robotY-217,459+charge*261,396,charge);
  art.grid('robot',0,1,1,robotX,robotY,532,{alpha:build});
  art.grid('poses',pose,2,2,x-91*build,y,296);
  target(opponent,tx+flinch*23,ty-flinch*19,-.1-flinch*.2-ease((t-202)/36)*1.47);
  for(const hit of [52,69]){
   const flight=ease((t-hit+11)/11);
   art.strike(0,mix(x+101,tx-36,flight),mix(y-141,ty-113,flight)-62*Math.sin(flight*Math.PI),147,135,pulse(t,hit-11,hit-7,hit,hit+7));
  }
  for(const [hit,offset] of [[107,0],[128,-92],[146,22],[169,-61]]){
   const reach=ease((t-hit+8)/8),width=241+reach*311;
   art.strike(1,mix(robotX+96,tx-189,reach),ty-103+offset*(1-reach),width,199,pulse(t,hit-8,hit,hit+2,hit+8),offset*.004);
  }
  art.strike(2,tx+3,ty-101,176+flinch*68,171+flinch*64,flinch*.87);
  art.strike(3,1138,477,429+pop*593,351+pop*252,pop);
  ctx.restore();flash('203,248,255',Math.max(pop*.25,charge*.08));bands(t,'#2b2b47');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(2,x,y,140+time*5,115,1-time/MametchiLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const LukeLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('luke',['cutin','court','poses','effects']);
 const shots=[
  [0,477,648,997,626,735,425,1.11,-.012,0],
  [48,628,649,984,623,796,430,1.05,.016,1],
  [75,676,649,1002,622,832,425,1.10,-.017,0],
  [97,699,648,1036,620,865,424,1.04,.016,1],
  [122,638,649,1060,609,840,376,.86,-.015,0],
  [138,667,643,1076,591,857,391,.96,.014,2],
  [168,716,648,1117,605,901,398,.91,-.018,3],
  [192,729,648,1140,592,942,402,.90,.015,3],
  [215,755,649,1338,423,977,411,.84,-.013,3],
  [256,688,649,1739,175,966,430,.87,0,3]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=LukeLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const shift=pulse(t,118,130,136,147),charge=pulse(t,177,193,203,215),beam=pulse(t,197,211,218,237);
  const flinch=Math.max(...Array.from(LukeLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#3a2227';ctx.fillRect(0,0,W,H);art.image('court',-74-t*.12,-55,W+182,H+113);
  world(cx,cy,z,roll,face,t,Math.max(beam,flinch*.55));
  art.glow(2,x+52,y-149,479+shift*241,381,shift);
  art.glow(2,x+164,y-141,455+charge*259,328,charge);
  const swinging=[53,65,77,89,105].some(hit=>t>=hit-4&&t<=hit+2);
  art.grid('poses',t<117?(swinging?1:0):pose,2,2,x,y,373,{alpha:1-shift*.34});
  target(opponent,tx+flinch*27,ty-flinch*20,-.11-flinch*.18-ease((t-211)/36)*1.52);
  for(const [index,hit,angle] of [[0,53,-.13],[0,65,.23],[0,77,-.29],[0,89,.12],[1,105,-.36],[1,146,-.4]]){
   const slash=pulse(t,hit-4,hit,hit+2,hit+8);
   art.strike(index,tx-77,ty-119,331+slash*118,178+slash*96,slash,angle);
  }
  art.strike(2,tx-17,ty-114,581,347,pulse(t,159,171,175,186),-.12);
  const length=mix(199,1060,ease((t-197)/14));
  art.strike(3,x+87+length*.5,y-146,length,251+beam*162,beam,-.045);
  ctx.restore();flash('255,169,125',Math.max(beam*.27,shift*.12));bands(t,'#34212a');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,153+time*5,113,1-time/LukeLimitProfile.contactHold*.6,-.11*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

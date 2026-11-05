'use strict';
const KasaneLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('kasane',['cutin','court','poses','effects']);
 const shots=[
  [0,465,648,998,626,734,424,1.09,.013,0],
  [46,528,649,987,620,764,424,1.04,-.016,1],
  [94,543,649,1016,615,782,401,.95,.016,1],
  [119,516,645,1042,601,784,368,.83,-.016,2],
  [147,595,545,1069,589,839,348,.86,.018,2],
  [165,635,605,1103,604,882,379,.92,-.014,3],
  [193,649,649,1192,533,912,385,.83,.015,3],
  [249,611,649,1736,166,941,429,.89,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=KasaneLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const net=pulse(t,116,137,160,178),crush=pulse(t,175,195,203,227);
  const flinch=Math.max(...Array.from(KasaneLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#241827';ctx.fillRect(0,0,W,H);art.image('court',-74-t*.10,-54,W+172,H+113);
  world(cx,cy,z,roll,face,t,Math.max(crush,flinch*.49));
  art.glow(2,tx-89,ty-162,744,534,net*.68);
  ctx.save();ctx.globalAlpha=net*.64;ctx.strokeStyle='#ff576c';ctx.lineWidth=3;
  for(const [dx,dy] of [[-187,-221],[110,-277],[224,-167]]){
   ctx.beginPath();ctx.moveTo(x+106,y-167);ctx.quadraticCurveTo(tx+dx,ty+dy,tx+dx*.58,ty-96);ctx.stroke();
  }
  ctx.restore();
  ctx.save();ctx.shadowColor='#f888a3';ctx.shadowBlur=13;
  art.grid('poses',pose,2,2,x,y,393);
  ctx.restore();
  target(opponent,tx+flinch*22,ty-flinch*18-net*29,-.1-flinch*.21-ease((t-199)/36)*1.47);
  for(const [hit,offset] of [[51,-38],[65,11],[80,39],[143,-89]]){
   const flight=ease((t-hit+9)/9);
   art.strike(0,mix(x+112,tx-46,flight),mix(y-155+offset,ty-107,flight),254,165,pulse(t,hit-9,hit-6,hit,hit+7),offset*.004);
  }
  for(const [hit,offset] of [[107,-169],[165,155]]){
   const flight=ease((t-hit+17)/17);
   art.strike(1,mix(x+128,tx-53,flight),mix(y-178+offset,ty-117,flight),412,244,pulse(t,hit-17,hit-9,hit,hit+7),offset*.002);
  }
  art.strike(3,1146,471,428+crush*604,328+crush*245,crush);
  ctx.restore();flash('255,137,156',Math.max(crush*.25,net*.09));bands(t,'#24192c');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,148+time*5,101,1-time/KasaneLimitProfile.contactHold*.6,-.12*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

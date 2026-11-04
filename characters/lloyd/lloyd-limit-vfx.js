'use strict';
const LloydLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('lloyd',['cutin','court','poses','effects']);
 const shots=[
  [0,473,648,984,626,734,424,1.08,.012,0],
  [47,622,649,971,625,805,434,1.05,-.015,1],
  [76,642,648,1008,622,827,418,.98,.014,0],
  [86,692,641,1026,599,858,404,1.02,-.015,1],
  [104,727,567,1049,557,891,367,.91,.017,2],
  [129,724,507,1081,514,918,332,.79,-.013,2],
  [151,837,498,1119,487,972,323,.89,.019,3],
  [188,832,464,1162,494,993,329,.82,-.015,2],
  [210,947,616,1343,478,1087,369,.85,.015,3],
  [250,852,649,1759,168,1062,431,.88,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=LloydLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const wings=pulse(t,114,130,200,222),finish=pulse(t,187,204,213,234);
  const flinch=Math.max(...Array.from(LloydLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#293a56';ctx.fillRect(0,0,W,H);art.image('court',-75-t*.10,-56,W+176,H+114);
  world(cx,cy,z,roll,face,t,Math.max(finish,flinch*.52));
  art.strike(2,x-83,y-174,510+wings*134,356, wings*.76,-.09+Math.sin(t*.22)*.09);
  art.grid('poses',pose,2,2,x,y,364);
  target(opponent,tx+flinch*23,ty-flinch*21,-.1-flinch*.21-ease((t-205)/37)*1.47);
  for(const [index,hit,angle] of [[0,52,-.17],[0,66,.23],[1,86,-.12],[0,112,-.48],[0,143,.18],[1,167,-.18]]){
   const slash=pulse(t,hit-4,hit,hit+2,hit+9);
   art.strike(index,tx-89,ty-118,327+slash*146,192+slash*89,slash,angle);
  }
  const flight=ease((t-187)/23);
  art.strike(3,mix(x+95,1250,flight),mix(y-133,429,flight),459+finish*503,321+finish*235,finish,.09);
  ctx.restore();flash('186,228,255',finish*.26);bands(t,'#21314c');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,149+time*5,111,1-time/LloydLimitProfile.contactHold*.6,-.12*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

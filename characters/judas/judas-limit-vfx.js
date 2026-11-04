'use strict';
const JudasLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('judas',['cutin','court','poses','effects','unmasked']);
 const shots=[
  [0,496,649,988,627,742,421,1.09,.014,0],
  [50,632,650,986,626,802,427,1.05,-.017,1],
  [74,605,649,1024,623,816,421,.94,.015,0],
  [97,630,649,1052,605,834,416,.97,-.014,1],
  [112,631,644,1079,602,832,392,.91,.014,0],
  [123,667,589,1091,561,871,356,.84,-.013,2],
  [148,767,504,1101,502,932,322,.88,.019,2],
  [167,879,489,1152,476,1004,320,.92,-.018,2],
  [194,936,483,1171,514,1046,352,.83,.013,2],
  [212,1212,531,1344,476,1146,372,.85,-.018,3],
  [257,1000,649,1774,186,1124,427,.86,0,3]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=JudasLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const mask=pulse(t,106,112,117,132),charge=pulse(t,177,194,202,211),dive=pulse(t,197,207,213,234);
  const flinch=Math.max(...Array.from(JudasLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#14182f';ctx.fillRect(0,0,W,H);art.image('court',-78-t*.10,-54,W+184,H+112);
  world(cx,cy,z,roll,face,t,Math.max(dive,mask*.55,flinch*.45));
  art.glow(1,x+73,y-162,421+charge*255,456,charge*.83);
  if(t>=124&&t<144)art.grid('unmasked',0,2,1,x,y,351);
  else if(t>=194&&t<218)art.grid('unmasked',1,2,1,x,y,371);
  else art.grid('poses',pose,2,2,x,y,345);
  target(opponent,tx+flinch*21,ty-flinch*19,-.12-flinch*.22-ease((t-208)/37)*1.48);
  art.strike(2,x+14,y-238,313+mask*110,284+mask*98,mask,-.12);
  for(const [index,hit,angle] of [[0,53,-.19],[0,69,.22],[1,95,-.14],[1,130,-.21],[0,149,.24],[1,167,-.17]]){
   const slash=pulse(t,hit-5,hit,hit+3,hit+9);
   art.strike(index,tx-80,ty-117,350+slash*149,201+slash*98,slash,angle);
  }
  art.strike(3,mix(x+132,1233,ease((t-198)/19)),mix(y-127,489,ease((t-198)/19)),476+dive*371,270+dive*158,dive,-.27);
  ctx.restore();flash('153,217,255',Math.max(dive*.25,mask*.16));bands(t,'#1f1b35');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,150+time*5,117,1-time/JudasLimitProfile.contactHold*.6,-.12*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

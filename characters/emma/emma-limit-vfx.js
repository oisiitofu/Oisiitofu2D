'use strict';
const EmmaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('emma',['cutin','court','poses','effects','koo']);
 const shots=[
  [0,536,649,958,625,742,424,1.10,.014,0],
  [51,609,649,961,620,783,424,1.04,-.016,1],
  [76,576,650,985,615,779,404,.94,.022,0],
  [109,533,650,1008,616,771,373,.81,-.018,0],
  [133,611,614,1051,589,820,357,.87,.014,2],
  [159,741,589,1095,571,910,355,.94,-.020,2],
  [178,776,647,1119,603,946,404,1.01,.014,3],
  [207,784,649,1148,598,955,402,.88,-.018,3],
  [222,718,648,1378,412,968,410,.85,.014,3],
  [257,642,649,1744,163,954,425,.89,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=EmmaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const pounce=pulse(t,83,98,102,113),thorn=pulse(t,111,122,128,145);
  const charge=pulse(t,177,194,201,207),finish=pulse(t,200,210,219,240);
  const flinch=Math.max(...Array.from(EmmaLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#30252a';ctx.fillRect(0,0,W,H);art.image('court',-70-t*.09,-50,W+172,H+109);
  world(cx,cy,z,roll,face,t,Math.max(finish,flinch*.5));
  const leap=ease((t-81)/31),flank=ease((t-181)/38);
  art.grid('koo',0,1,1,mix(393,1091,leap),650-153*Math.sin(leap*Math.PI),240,{alpha:pulse(t,78,87,121,153)});
  art.grid('koo',0,1,1,mix(1478,1050,flank),641-185*Math.sin(flank*Math.PI),228,{face:-1,alpha:pulse(t,181,192,211,223)});
  art.glow(2,x+105,y-141,429+charge*183,437,charge);
  art.grid('poses',pose,2,2,x,y,367);
  target(opponent,tx+flinch*23,ty-flinch*18,-.1-flinch*.20-ease((t-211)/35)*1.45);
  for(const [hit,angle] of [[56,-.17],[71,.16],[151,-.41],[171,.22]]){
   const cut=pulse(t,hit-5,hit,hit+2,hit+9);
   art.strike(0,tx-89,ty-109,327+cut*142,191+cut*72,cut,angle,-1);
  }
  art.strike(1,tx-38,ty-112,471,269,pounce,-.16);
  art.strike(2,tx-13,ty-175,407,434,thorn);
  art.strike(2,tx+87,ty-166,355,389,pulse(t,189,201,211,222),.16);
  art.strike(3,tx-24,ty-150,572+finish*468,311+finish*219,finish,-.14);
  ctx.restore();flash('255,176,192',Math.max(finish*.25,charge*.1));bands(t,'#29202a');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,156+time*5,112,1-time/EmmaLimitProfile.contactHold*.6,-.13*face,-face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

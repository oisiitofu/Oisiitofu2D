"use strict";
const NarukamiLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('narukami',['cutin','court','poses','motion','avatars','effects']);
 const shots=[
 [0,430,690,960,610,700,390,1.02,0,0],[32,450,690,970,610,710,390,1.02,-.01,0],
 [41,610,690,1000,605,800,385,.98,-.012,1],[52,810,690,1050,590,930,380,1.01,.014,2],
 [65,1290,690,1090,590,1190,380,.92,0,1],[70,1320,690,1100,590,1210,380,.98,0,1],
 [80,1190,690,920,580,1060,375,1.01,-.014,4],[96,760,610,1070,420,900,285,.87,-.01,3],
 [112,870,470,1160,270,1010,245,.85,.016,5],[128,1000,410,1240,300,1120,230,.89,-.01,5],
 [143,1090,690,1320,585,1210,380,.94,.014,6],[160,940,690,1400,585,1170,380,.82,-.01,1],
 [175,1030,690,1440,570,1220,365,.82,.016,2],[192,1660,650,1470,530,1530,340,.82,0,1],
 [207,1600,500,1320,280,1440,260,.84,-.015,5],[222,1210,440,1510,330,1360,245,.84,0,5],
 [238,1300,690,1540,585,1420,380,.91,.014,6],[253,1140,690,1610,585,1380,375,.80,-.01,7],
 [267,1160,690,1640,570,1400,365,.78,.014,7],[281,1160,690,1660,560,1410,355,.75,-.01,7],
 [290,1160,690,1680,550,1420,350,.75,.014,7],[304,1170,690,1690,560,1430,355,.70,-.01,7],
 [313,1180,690,1710,570,1440,360,.67,.018,7],[330,1180,690,1970,370,1540,350,.67,-.01,7],
 [350,1180,690,2240,170,1640,340,.67,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 const facing=t=>t>=69&&t<94||t>=198&&t<220?-1:1;
 function actor(t,alpha=1){const [x,y,,,,,,,pose]=camera(shots,t);art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,550,{face:facing(t),alpha});}
 function avatar(t){const [x,y,tx,ty]=camera(shots,t),dir=facing(t),scale=1100/800;
  if(t>=89&&t<250){const upper=t<128||t>=197&&t<222;/* Visible blade tips measured in the 900x800 cells; align to the target before mirroring. */const [tipX,tipY]=upper?[700,540]:[660,622];art.grid('avatars',upper?1:0,2,2,tx-dir*(tipX-450)*scale,ty-95-(tipY-768)*scale,1100,{face:dir,alpha:pulse(t,89,103,238,250)});}
  if(t>=250)art.grid('avatars',t<304?2:3,2,2,x-220,y-75,940,{alpha:pulse(t,250,263,335,350)});
 }
 function draw({target:opponent,face,time}){
  const t=NarukamiLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll]=camera(shots,t);
  const flinch=Math.max(...Array.from(NarukamiLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const finish=pulse(t,307,313,321,339),charge=pulse(t,278,298,307,314);
  frameClip();ctx.fillStyle='#19160d';ctx.fillRect(0,0,W,H);art.image('court',-80-t*.045,-58,W+185,H+116);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.6,finish));
  avatar(t);
  for(const [hit,angle,dir] of [[52,0,1],[80,.06,-1],[112,-.84,1],[143,.78,1],[175,0,1],[207,-.8,-1],[238,.75,1]]){
   art.strike(0,tx-dir*68,ty-(hit===112||hit===207?155:95),570,501,pulse(t,hit-5,hit,hit+1,hit+10),angle,dir);
  }
  for(const hit of [175,267,290])art.strike(1,tx,ty-220,510,760,pulse(t,hit-5,hit,hit+2,hit+11));
  art.glow(2,x-200,y-380,410,360,charge*.45);
  art.strike(3,tx,ty-430,900,1400,finish);
  art.strike(2,tx,ty-95,1180,1036,finish);
  actor(t);
  target(opponent,tx+flinch*18,ty-flinch*16,-.10-flinch*.25-ease((t-314)/30)*1.44);
  ctx.restore();flash('255,239,183',Math.max(flinch*.09,finish*.20));bands(t,'#19130a');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,185+time*5,163,1-time/NarukamiLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

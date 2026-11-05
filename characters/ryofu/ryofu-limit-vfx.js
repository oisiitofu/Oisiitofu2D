'use strict';
const RyofuLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('ryofu',['cutin','court','poses','motion','horse','effects']);
 const shots=[
  [0,240,690,1030,610,650,380,.84,0,8],[32,260,690,1040,610,660,380,.84,-.01,8],
  [41,470,690,1100,460,790,380,.85,-.014,9],[52,720,690,1210,390,980,380,.87,.018,10],
  [66,1190,690,1430,390,1320,380,.83,0,9],[79,1270,690,1530,390,1410,380,.88,.018,10],
  [88,1070,650,1490,540,1290,350,.81,-.01,11],[98,1250,470,1470,320,1360,240,.96,-.01,3],
  [107,1300,440,1530,260,1420,215,.98,.018,3],[119,1410,560,1610,485,1510,320,.96,-.01,6],
  [134,1480,690,1680,585,1590,380,.98,.018,2],[147,1910,690,1700,580,1810,380,.91,0,1],
  [162,1700,690,1490,575,1600,380,.99,-.018,2],[176,1260,690,1540,575,1400,380,.94,-.01,1],
  [191,1330,690,1550,570,1440,375,.99,.018,4],[205,1460,620,1670,485,1570,320,.94,-.01,3],
  [220,1510,470,1740,250,1630,215,.98,.018,3],[234,1580,390,1780,330,1690,230,.94,-.01,5],
  [247,1660,510,1860,445,1760,295,.98,.018,6],[260,1710,690,1910,580,1820,380,.94,-.01,7],
  [273,1720,690,1930,580,1830,380,.91,.014,4],[289,1740,440,1950,590,1850,295,.86,-.018,5],
  [303,1790,390,1960,610,1890,280,.81,.01,5],[312,1820,690,1970,660,1900,390,.75,.02,7],
  [330,1820,690,2210,400,1990,365,.75,-.01,7],[350,1820,690,2470,180,2090,350,.75,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 const facing=t=>t>=151&&t<171?-1:1;
 function actor(t,alpha=1){const [x,y,,,,,,,pose]=camera(shots,t);
  if(pose>=8){const n=t<46?Math.floor(t/7)%2:pose-8;art.grid('horse',n,2,2,x,y,1100,{anchorY:.98,alpha});}
  else art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,620,{face:facing(t),alpha});
 }
 function draw({target:opponent,face,time}){
  const t=RyofuLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll]=camera(shots,t);
  const flinch=Math.max(...Array.from(RyofuLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const finish=pulse(t,306,312,318,339),awaken=pulse(t,170,185,302,314);
  frameClip();ctx.fillStyle='#211019';ctx.fillRect(0,0,W,H);art.image('court',-80-t*.055,-58,W+185,H+116);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.65,finish));
  art.glow(3,x,y-210,600,527,awaken*.28);
  for(const [hit,n,angle,dir] of [[52,0,0,1],[79,0,0,1],[107,0,-.91,1],[134,0,0,1],[162,0,.06,-1],[191,1,-.12,1],[220,1,-.91,1],[247,1,.77,1],[273,1,.1,1]]){
   art.strike(n,tx-dir*65,ty-(hit===107||hit===220?175:100),610,536,pulse(t,hit-5,hit,hit+1,hit+10),angle,dir);
  }
  art.strike(2,tx,ty-8,600,360,pulse(t,256,260,264,274));
  art.strike(2,x+225,y-18,1560,700,finish);
  art.strike(3,tx,ty-100,1220,1071,finish);
  actor(t);
  target(opponent,tx+flinch*20,ty-flinch*18,-.10-flinch*.27-ease((t-313)/30)*1.44);
  ctx.restore();flash('255,219,164',Math.max(flinch*.1,finish*.22));bands(t,'#170810');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,185+time*5,163,1-time/RyofuLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

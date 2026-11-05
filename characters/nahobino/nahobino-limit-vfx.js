"use strict";
const NahobinoLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('nahobino',['cutin','court','poses','motion','effects']);
 const shots=[
 [0,450,690,970,610,710,390,1.02,0,0],[32,470,690,980,610,720,390,1.02,-.01,0],
 [40,630,690,1000,605,810,385,.98,-.012,1],[52,810,690,1060,590,930,380,1.01,.016,2],
 [62,1340,660,1120,560,1230,365,.91,0,1],[68,1370,660,1120,560,1250,365,.97,0,1],
 [77,1230,690,970,580,1100,375,1.01,-.016,4],[90,820,610,1100,430,960,285,.92,-.01,1],
 [104,940,480,1210,280,1070,235,.97,.016,3],[118,1030,370,1280,290,1150,220,.91,-.01,5],
 [131,1150,690,1390,585,1270,380,.98,.016,6],[146,1740,660,1510,550,1620,355,.90,0,1],
 [161,1610,690,1360,580,1490,375,1.00,-.016,4],[176,1210,590,1500,400,1360,280,.92,-.01,1],
 [191,1340,450,1610,250,1470,215,.97,.016,3],[207,1450,350,1720,300,1580,210,.91,-.01,5],
 [222,1540,590,1790,500,1660,330,.98,.016,6],[238,2050,650,1820,545,1940,350,.91,0,1],
 [253,1950,690,1690,580,1820,375,.98,-.016,4],[265,1480,690,1820,585,1650,380,.83,-.01,0],
 [279,1510,520,1860,580,1680,310,.82,-.01,5],[293,1560,460,1900,590,1730,290,.77,-.015,5],
 [304,1680,690,1980,585,1820,380,.70,.019,7],[321,1680,690,2220,360,1920,365,.70,-.01,7],
 [340,1680,690,2480,150,2020,350,.70,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 const facing=t=>t>=66&&t<88||t>=150&&t<173||t>=242&&t<262?-1:1;
 function actor(t,alpha=1){const [x,y,,,,,,,pose]=camera(shots,t);art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,550,{face:facing(t),alpha});}
 function draw({target:opponent,face,time}){
  const t=NahobinoLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll]=camera(shots,t);
  const flinch=Math.max(...Array.from(NahobinoLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const finish=pulse(t,298,304,312,330),charge=pulse(t,267,290,298,305);
  frameClip();ctx.fillStyle='#12152a';ctx.fillRect(0,0,W,H);art.image('court',-80-t*.045,-58,W+185,H+116);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.65,finish));
  if(t>=39&&t<261){actor(Math.max(32,t-4),.13);}
  for(const [hit,angle,dir] of [[52,0,1],[77,.05,-1],[104,-.62,1],[131,.77,1],[161,.04,-1],[191,-.62,1],[222,.77,1],[253,.05,-1]]){
   // Visible convex edge of both crescent sprites points RIGHT in source coordinates.
   art.strike(0,tx-dir*65,ty-(hit===104||hit===191?130:95),560,492,pulse(t,hit-4,hit,hit+1,hit+8),angle,dir);
  }
  art.glow(2,x+100,y-250,450,395,charge*.38);
  art.strike(1,tx-80,ty-120,1170,1028,finish,-.20);
  art.strike(3,tx-105,ty-210,1420,1247,finish,-.25);
  art.strike(2,tx,ty-95,780,685,finish);
  actor(t);target(opponent,tx+flinch*18,ty-flinch*16,-.10-flinch*.25-ease((t-305)/30)*1.44);
  ctx.restore();flash('189,222,255',Math.max(flinch*.1,finish*.21));bands(t,'#091222');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,185+time*5,163,1-time/NahobinoLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const RyzaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('ryza',['cutin','court','poses','motion','items','effects']);
 const shots=[
  [0,470,690,960,610,730,390,1.06,0,0],[32,480,690,960,610,735,390,1.06,-.01,0],
  [47,650,690,970,610,810,390,1.04,-.014,1],[57,700,690,990,610,850,390,1.04,.01,2],
  [65,720,690,1010,610,870,390,1.04,.01,3],[82,730,690,1035,600,885,390,1.01,-.01,3],
  [94,810,690,1080,595,945,390,1.02,-.01,1],[108,930,690,1130,590,1030,385,1.04,.018,4],
  [119,1000,620,1180,480,1090,330,1.02,-.012,5],[136,1060,450,1250,320,1160,230,1.03,.018,5],
  [147,1150,580,1280,480,1220,320,.99,.01,6],[157,1420,690,1260,585,1340,380,.98,-.01,1],
  [169,1360,690,1155,585,1255,380,1.03,-.018,4],[179,1420,690,1140,585,1280,380,1.01,.01,2],
  [184,1400,690,1110,585,1250,380,1.01,.01,3],[193,1370,690,1080,585,1230,380,.99,-.01,3],
  [207,760,690,1150,585,960,385,.91,.01,1],[219,710,690,1180,585,950,385,.91,-.01,7],
  [259,710,690,1210,585,960,385,.89,.01,7],[276,710,690,1240,560,980,385,.86,-.01,7],
  [296,710,690,1240,465,980,385,.86,-.012,7],[300,690,690,1250,465,980,385,.78,.018,7],
  [316,680,690,1470,300,1020,370,.78,-.01,7],[335,700,690,1700,110,1080,370,.78,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 const facing=t=>t>=153&&t<202?-1:1;
 function actor(t,alpha=1){const [x,y,,,,,,,pose]=camera(shots,t);art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,530,{face:facing(t),alpha});}
 function draw({target:opponent,face,time}){
  const t=RyzaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll]=camera(shots,t);
  const flinch=Math.max(...Array.from(RyzaLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const charge=pulse(t,212,230,292,302),finish=pulse(t,296,300,310,326);
  frameClip();ctx.fillStyle='#261d32';ctx.fillRect(0,0,W,H);art.image('court',-80-t*.07,-58,W+185,H+116);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.6,finish));
  for(const [release,hit,dir] of [[65,82,1],[184,193,-1]]){
   const p=ease((t-release)/(hit-release)),a=pulse(t,release-1,release+1,hit-1,hit+1);
   const sx=dir===1?850:1240,sy=dir===1?410:410;
   art.grid('items',0,2,2,mix(sx,tx,p),mix(sy,ty-90,p)-Math.sin(p*Math.PI)*150,155,{alpha:a});
   art.strike(3,tx,ty-100,380,334,pulse(t,hit-3,hit,hit+1,hit+10));
  }
  for(const [hit,dir,angle] of [[108,1,0],[136,1,-.86],[169,-1,.06]]){
   art.strike(0,tx-dir*56,ty-(hit===136?165:100),470,413,pulse(t,hit-5,hit,hit+1,hit+9),angle,dir);
  }
  const ice=pulse(t,214,219,222,231),thunder=pulse(t,235,239,242,251);
  art.grid('items',1,2,2,tx,ty+95,520,{anchorY:.96,alpha:ice});
  art.strike(3,tx,ty-100,430,378,ice*.85);
  art.grid('items',2,2,2,tx,ty-40,620,{anchorY:.96,alpha:thunder});
  art.strike(1,tx,ty-130,380,334,thunder,-Math.PI/2);
  for(const hit of [259,276]){
   const p=ease((t-hit+12)/12),a=pulse(t,hit-13,hit-9,hit,hit+4);
   art.strike(1,mix(x+160,tx,p),mix(y-286,ty-100,p),360,316,a);
   art.strike(3,tx,ty-100,350,307,pulse(t,hit-2,hit,hit+1,hit+8));
  }
  art.grid('items',3,2,2,x+120,y-180,620,{anchorY:.5,alpha:charge*.5});
  const muzzleX=x+251,muzzleY=y-275;
  art.glow(3,muzzleX,muzzleY,290,255,charge*.42);
  // Beam placement is reviewed against the visible atlas origin and staff orb.
  art.strike(2,muzzleX+500,muzzleY,2100,690,finish);
  art.strike(3,tx,ty-100,810,711,finish);
  actor(t);
  target(opponent,tx+flinch*18,ty-flinch*18,-.10-flinch*.27-ease((t-301)/29)*1.44);
  ctx.restore();flash('255,227,174',Math.max(flinch*.1,finish*.2));bands(t,'#1a1023');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,171+time*6,150,1-time/RyzaLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

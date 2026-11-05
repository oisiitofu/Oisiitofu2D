"use strict";
const MakotoLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('makoto',['cutin','court','poses','motion','avatars','effects']);
 const shots=[
 [0,440,690,960,610,710,390,1.02,0,0],[32,460,690,970,610,720,390,1.02,-.01,0],
 [42,600,690,980,605,800,385,.98,-.012,1],[54,790,690,1030,590,910,380,1.01,.014,2],
 [65,1260,690,1060,590,1160,380,.93,0,1],[72,1300,690,1060,590,1180,380,.99,0,1],
 [82,1150,690,880,580,1020,375,1.01,-.014,4],[96,680,660,940,510,810,340,.92,0,1],
 [116,840,500,1110,270,970,230,.97,.015,3],[132,940,370,1150,290,1050,225,.91,-.01,5],
 [148,1030,600,1250,510,1140,340,.99,.014,6],[164,1010,690,1320,585,1160,380,.87,-.01,1],
 [180,1140,690,1420,565,1250,355,.84,.016,2],[196,1670,660,1470,530,1510,350,.83,0,1],
 [213,1590,540,1310,315,1430,260,.84,-.015,5],[227,1280,460,1530,350,1400,250,.84,0,5],
 [241,1310,690,1560,585,1420,380,.91,.016,6],[253,1130,690,1610,585,1370,380,.82,-.01,1],
 [269,1170,660,1630,555,1400,355,.79,.012,7],[284,1150,650,1650,545,1390,345,.75,-.01,7],
 [296,1140,640,1650,535,1390,335,.76,.014,7],[313,1150,650,1660,555,1400,340,.72,-.01,7],
 [324,1160,660,1680,565,1410,345,.69,.018,7],[340,1160,675,1930,390,1500,340,.69,-.01,7],
 [360,1160,690,2220,180,1610,340,.69,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 const facing=t=>t>=70&&t<94||t>=200&&t<225?-1:1;
 function actor(t,alpha=1){const [x,y,,,,,,,pose]=camera(shots,t);art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,550,{face:facing(t),alpha});}
 function avatar(t){const [x,y,tx,ty]=camera(shots,t),dir=facing(t),scale=1100/800;
  if(t>=157&&t<253){const upper=t>=201&&t<227;/* Visible blade tips measured in the 900x800 cells; align to the target before mirroring. */const [tipX,tipY]=upper?[700,525]:[650,684];art.grid('avatars',upper?1:0,2,2,tx-dir*(tipX-450)*scale,ty-95-(tipY-768)*scale,1100,{face:dir,alpha:pulse(t,157,171,241,253)});}
  if(t>=253)art.grid('avatars',t<311?2:3,2,2,x-185,y-65,835,{alpha:pulse(t,253,266,343,360)});
 }
 function draw({target:opponent,face,time}){
  const t=MakotoLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll]=camera(shots,t);
  const flinch=Math.max(...Array.from(MakotoLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const finish=pulse(t,318,324,332,349),charge=pulse(t,282,304,318,325);
  frameClip();ctx.fillStyle='#071221';ctx.fillRect(0,0,W,H);art.image('court',-80-t*.045,-58,W+185,H+116);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.6,finish));
  avatar(t);
  for(const [hit,angle,dir] of [[54,0,1],[82,.06,-1],[116,-.84,1],[148,.78,1],[180,0,1],[213,-.8,-1],[241,.75,1]]){
   // Both source crescents have their convex cutting face RIGHT, open tails LEFT.
   art.strike(hit<170?0:1,tx-dir*68,ty-(hit===116||hit===213?155:95),570,501,pulse(t,hit-5,hit,hit+1,hit+10),angle,dir);
  }
  for(const hit of [269,296])art.strike(2,tx,ty-85,650,571,pulse(t,hit-6,hit,hit+3,hit+13));
  art.glow(2,x-185,y-370,420,369,charge*.42);
  art.strike(3,tx,ty-100,1420,1247,finish);
  actor(t);
  target(opponent,tx+flinch*18,ty-flinch*16,-.10-flinch*.25-ease((t-325)/31)*1.44);
  ctx.restore();flash('199,220,255',Math.max(flinch*.09,finish*.20));bands(t,'#071020');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,185+time*5,163,1-time/MakotoLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

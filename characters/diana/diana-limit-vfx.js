'use strict';
const DianaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('diana',['cutin','court','poses','motion','effects']);
 const shots=[
  [0,460,680,950,605,710,385,1.06,0,0],[32,470,680,960,605,715,385,1.06,-.01,0],
  [44,620,680,970,600,800,385,1.03,-.01,1],[58,690,680,1000,595,850,385,1.06,.01,2],
  [72,690,680,1000,595,850,385,1.00,0,2],[84,650,680,1000,590,830,380,.97,-.01,3],
  [96,660,680,1050,590,860,380,.98,.01,3],[106,700,690,1080,590,900,380,.90,0,4],
  [125,850,690,1190,585,1030,380,.94,.016,5],[136,930,600,1250,470,1100,315,.94,-.012,6],
  [148,1030,460,1330,115,1190,175,.94,.016,6],[161,1130,580,1380,300,1260,285,.91,-.01,6],
  [174,1150,690,1450,585,1310,380,.91,.014,7],[187,1630,690,1430,585,1530,380,.86,0,4],
  [198,1570,690,1380,585,1480,380,.94,-.01,5],[208,1440,690,1100,585,1270,380,.94,-.016,5],
  [221,760,690,1170,585,980,380,.87,0,4],[240,720,690,1210,585,980,380,.87,.012,7],
  [278,720,690,1230,585,990,380,.85,-.01,7],[297,720,690,1250,560,1000,370,.81,-.01,7],
  [314,700,690,1290,540,1020,370,.75,.018,7],[329,690,690,1500,340,1080,360,.75,-.01,7],
  [345,710,690,1780,160,1160,355,.75,0,7]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 const facing=t=>t>=190&&t<218?-1:1;
 function actor(t,alpha=1){const [x,y,,,,,,,pose]=camera(shots,t);art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,pose<4?450:620,{face:facing(t),alpha});}
 // Per-pose barrel tips measured in the packed 780x640 cells, then mapped by grid's anchor.
 function muzzle(t){const [x,y,,,,,,,pose]=camera(shots,t),dir=facing(t),scale=620/640;
  const [px,py,angle]=pose===6?[584,258,-.55]:pose===5?[665,397,0]:[626,260,0];
  return [x+dir*(px-390)*scale,y+(py-640*.96)*scale,angle,dir];
 }
 function gun(t,strength){const [mx,my,angle,dir]=muzzle(t);
  // The visible flash core sits left of the source cell center; offset it onto the barrel.
  art.strike(2,mx+dir*65*Math.cos(angle),my+65*Math.sin(angle),480,421,strength,angle,dir);
 }
 function draw({target:opponent,face,time}){
  const t=DianaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll]=camera(shots,t),dir=facing(t);
  const flinch=Math.max(...Array.from(DianaLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const charge=pulse(t,279,298,308,315),finish=pulse(t,307,314,319,337);
  frameClip();ctx.fillStyle='#06101c';ctx.fillRect(0,0,W,H);art.image('court',-80-t*.07,-58,W+185,H+116);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.6,finish));
  for(const hit of [58,240,278]){
   const a=pulse(t,hit-8,hit,hit+2,hit+12);
   art.strike(0,tx,ty-100,470,413,a);
   art.glow(0,x+dir*110,y-(t<100?245:440),260,228,a*.3);
  }
  for(const [release,hit] of [[77,96],[245,260]]){
   const p=ease((t-release)/(hit-release)),a=pulse(t,release-1,release+1,hit-1,hit+2);
   // Hacked missile curls back from the enemy side; source nose points RIGHT.
   const sx=tx+360,sy=ty-300,ex=tx,ey=ty-100;
   const mx=mix(sx,ex,p),my=mix(sy,ey,p)-Math.sin(p*Math.PI)*155;
   art.strike(1,mx,my,420,369,a,Math.atan2(ey-sy-155*Math.PI*Math.cos(p*Math.PI),ex-sx));
   art.strike(3,tx,ty-100,410,360,pulse(t,hit-3,hit,hit+1,hit+9));
  }
  for(const [hit,angle] of [[125,0],[148,-.55],[174,0],[208,0]]){
   const a=pulse(t,hit-3,hit,hit+1,hit+8),d=hit===208?-1:1;
   gun(t,a);
   art.strike(2,tx-d*43,ty-100,300,263,a,angle,d);
  }
  art.glow(0,x+80,y-425,410,360,charge*.42);
  art.strike(3,x+180,y-340,1300+ease((t-306)/14)*1100,1142+ease((t-306)/14)*966,finish);
  art.strike(0,tx,ty-105,580,509,finish);
  actor(t);
  gun(t,pulse(t,312,314,316,326));
  target(opponent,tx+flinch*18,ty-flinch*18,-.10-flinch*.27-ease((t-315)/28)*1.44);
  ctx.restore();flash('174,228,255',Math.max(flinch*.1,finish*.2));bands(t,'#040c16');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,180+time*5,158+time*4,1-time/DianaLimitProfile.contactHold*.6);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

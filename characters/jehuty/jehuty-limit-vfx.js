'use strict';
const JehutyLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('jehuty',['cutin','court','poses','motion','cannon','effects']);
 const shots=[
  [0,470,680,950,610,730,390,1.02,0,0],[32,480,680,960,610,740,390,1.03,-.01,0],
  [40,580,650,970,605,790,380,1.02,-.02,1],[53,845,680,1035,590,940,370,1.01,.018,2],
  [61,1220,650,1050,590,1130,370,.96,.01,1],[70,1220,650,1050,585,1130,370,1.01,-.01,1],
  [81,1050,680,850,585,950,370,1.01,-.018,2],[91,650,650,880,565,780,360,.98,.01,1],
  [102,760,600,980,420,880,300,1.01,-.018,3],[112,830,470,1090,245,960,240,.99,.02,3],
  [123,910,340,1100,260,1010,210,.97,-.01,1],[141,950,450,1150,390,1060,275,1.00,.018,2],
  [151,870,590,1190,530,1040,335,.97,-.01,0],[158,880,650,1190,580,1040,370,.93,0,6],
  [169,660,600,1180,580,930,350,.95,-.02,4],[180,980,650,1190,560,1090,350,1.00,.018,5],
  [188,1480,600,1240,550,1360,350,.94,.01,4],[196,1480,600,1240,550,1360,350,1.01,-.01,4],
  [208,1270,650,1055,560,1160,350,1.00,-.018,5],[218,640,670,1130,580,900,380,.85,.01,6],
  [253,640,670,1200,580,940,380,.85,-.01,6],[267,610,690,1260,580,920,380,.79,0,8],
  [296,610,690,1260,580,920,380,.79,-.01,8],[302,590,690,1280,575,930,380,.72,.018,9],
  [318,570,690,1480,440,970,370,.72,-.01,9],[340,600,690,1730,240,1040,370,.72,0,8]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 const facing=t=>t>=64&&t<89||t>=192&&t<216?-1:1;
 function actor(t,alpha=1){
  const [x,y,,,,,,,pose]=camera(shots,t);
  if(pose>=8)art.grid('cannon',pose-8,2,1,x,y,520,{face:1,alpha});
  else art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,pose<4?550:850,{face:facing(t),alpha});
 }
 const swings=[[53,0,1],[81,0,-1],[112,-.91,1],[141,.65,1],[180,-.14,1],[208,.12,-1]];
 function draw({target:opponent,face,time}){
  const t=JehutyLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll]=camera(shots,t);
  const flinch=Math.max(...Array.from(JehutyLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const change=pulse(t,153,158,160,167),charge=pulse(t,264,280,296,303),finish=pulse(t,297,302,312,330);
  frameClip();ctx.fillStyle='#071322';ctx.fillRect(0,0,W,H);art.image('court',-80-t*.07,-58,W+185,H+116);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.6,finish));
  if([[39,62],[69,91],[100,144],[168,190],[195,217]].some(([a,b])=>t>=a&&t<=b)){
   actor(Math.max(0,t-5),.13);actor(Math.max(0,t-2),.23);
  }
  for(const [hit,angle,dir] of swings){
   const power=pulse(t,hit-5,hit,hit+1,hit+9);
   // Source crescent's convex cutting edge points RIGHT; mirror only for a reverse cut.
   art.strike(0,tx-dir*75,ty-(hit===112?185:100),485,426,power,angle,dir);
  }
  for(const hit of [225,239,253])for(let n=0;n<3;n++){
   const p=ease((t-hit+12+n*2)/12),a=pulse(t,hit-14-n*2,hit-9,hit,hit+5);
   const sx=x+60,sy=y-210-n*56,ex=tx,ey=ty-100;
   const lx=mix(sx,ex,p),ly=mix(sy,ey,p)-Math.sin(p*Math.PI)*(95+n*48);
   const angle=Math.atan2(ey-sy-(95+n*48)*Math.PI*Math.cos(p*Math.PI),ex-sx);
   art.strike(1,lx,ly,280,246,a,angle);
  }
  art.glow(3,x,y-210,650,571,change*.45);
  // Final cannon muzzles point right; beam begins at their rightmost front aperture.
  const muzzleX=x+210,muzzleY=y-275;
  art.glow(3,muzzleX,muzzleY,270,237,charge*.42);
  // Visible beam begins at source x=200/740; account for transparent atlas padding.
  art.strike(2,muzzleX+528,muzzleY+20,2300,680,finish);
  art.strike(3,tx,ty-100,795,698,finish);
  actor(t);
  target(opponent,tx+flinch*18,ty-flinch*18,-.1-flinch*.27-ease((t-303)/31)*1.44);
  ctx.restore();flash('172,229,255',Math.max(flinch*.10,change*.2,finish*.2));bands(t,'#050d18');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,171+time*6,150,1-time/JehutyLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

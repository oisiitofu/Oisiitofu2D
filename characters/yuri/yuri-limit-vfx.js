'use strict';
const YuriLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('yuri',['cutin','court','poses','motion','effects']);
 const shots=[
  [0,480,690,950,610,720,390,1.06,0,0],[32,490,690,960,610,730,390,1.06,-.01,0],
  [41,630,690,980,470,810,340,1.03,-.012,1],[54,700,690,1020,390,865,315,1.04,.012,4],
  [66,600,690,1050,390,835,315,1.01,-.012,2],[79,620,690,1050,366,835,305,1.04,.012,5],
  [92,500,690,1080,400,800,320,.99,-.012,3],[104,650,690,1100,390,885,315,1.04,.012,4],
  [116,1280,690,1130,390,1210,315,.95,0,1],[123,1360,690,1080,366,1220,305,1.01,-.012,1],
  [133,1330,690,1000,366,1170,305,1.04,-.012,5],[148,1400,690,1060,400,1230,320,.99,.012,3],
  [163,1310,690,1000,390,1160,315,1.04,-.012,4],[176,700,690,1080,390,900,315,.95,0,1],
  [190,720,690,1100,366,920,305,1.04,.012,5],[204,660,690,1140,400,910,320,.99,-.012,3],
  [220,730,690,1170,354,960,300,1.03,.012,6],[233,800,690,1200,390,1010,315,.99,-.01,4],
  [247,900,690,1240,390,1080,315,1.04,.012,4],[259,800,690,1250,390,1030,315,.99,-.01,2],
  [271,790,690,1260,366,1030,305,1.04,.012,5],[287,1050,690,1280,390,1170,315,.97,-.01,4],
  [303,1080,690,1340,420,1210,330,.85,.015,7],[319,1070,690,1580,260,1310,310,.83,-.01,7],
  [340,1080,690,1790,120,1400,300,.83,0,0]
 ].map(row=>row.map((value,index)=>index===6?value+60:value));
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 const facing=t=>t>=120&&t<172?-1:1;
 function actor(t,alpha=1){const [x,y,,,,,,,pose]=camera(shots,t);art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,550,{face:facing(t),alpha});}
 // Lens centers measured in the four 780x640 motion cells; keep flashes attached while moving.
 function photo(t,strength,width=720){const [x,y,,,,,,,pose]=camera(shots,t),dir=facing(t),s=550/640;
  const [px,py]=[[576,195],[516,168],[526,153],[628,233]][Math.max(0,pose-4)%4];
  const lx=x+dir*(px-390)*s,ly=y+(py-640*.96)*s;
  art.strike(0,lx+dir*width*170/740,ly-width*40/740,width,width*650/740,strength,0,dir);
 }
 function draw({target:opponent,face,time}){
  const t=YuriLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll]=camera(shots,t);
  const flinch=Math.max(...Array.from(YuriLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+1,hit+6)));
  const finish=pulse(t,299,303,308,326),charge=pulse(t,274,288,299,304);
  frameClip();ctx.fillStyle='#07131e';ctx.fillRect(0,0,W,H);art.image('court',-80-t*.055,-58,W+185,H+116);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.36,finish*.8));
  for(const hit of YuriLimitProfile.combo.keys()){
   const a=pulse(t,hit-2,hit,hit+.5,hit+4);
   if(a>0)photo(t,a);
   art.strike(1,tx,ty-75,360,316,pulse(t,hit-1,hit,hit+2,hit+10));
  }
  art.strike(2,tx+35,ty-90,430,377,charge*.82,Math.PI);
  art.glow(1,x+150,y-340,310,272,charge*.32);
  if(finish>0)photo(t,finish,1180);
  art.strike(3,tx,ty-75,1080,948,finish);
  actor(t);
  target(opponent,tx+flinch*14,ty-flinch*12,-.10-flinch*.25-ease((t-304)/30)*1.44);
  ctx.restore();flash('188,227,255',Math.max(flinch*.08,finish*.17));bands(t,'#050b13');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(1,x,y,185+time*5,163+time*4,1-time/YuriLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

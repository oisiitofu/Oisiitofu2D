'use strict';
const HinakoLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('hinako',['cutin','court','poses','motion','effects']);
 const shots=[
  [0,470,690,960,610,730,390,1.06,0,0],[32,480,690,970,610,735,390,1.06,-.01,0],
  [42,650,690,990,605,820,390,1.03,-.014,1],[52,800,690,1030,595,920,385,1.05,.018,2],
  [63,1190,690,1040,595,1120,385,.97,0,1],[72,1190,690,1030,590,1110,385,1.03,-.01,0],
  [82,1010,690,810,585,915,380,1.04,-.018,2],[94,650,660,860,560,760,365,.99,.01,1],
  [112,760,470,1020,240,900,235,1.02,.018,3],[126,870,340,1080,300,980,225,.97,-.01,3],
  [142,940,560,1150,500,1050,335,1.00,.018,2],[156,860,690,1190,585,1030,380,.95,0,4],
  [168,720,690,1190,585,960,380,.96,-.01,4],[178,1000,690,1210,580,1110,380,1.02,.018,5],
  [189,1530,690,1230,575,1380,380,.95,0,4],[204,1290,690,1080,575,1190,380,1.02,-.018,5],
  [218,860,620,1110,490,990,325,.97,-.01,4],[230,920,480,1160,320,1040,235,1.00,.018,5],
  [241,1000,420,1210,340,1110,225,.95,-.01,6],[252,1060,500,1260,450,1160,295,.99,.016,5],
  [263,1120,580,1300,545,1210,350,.94,-.01,6],[274,1120,520,1300,545,1210,325,.91,.012,6],
  [289,1150,360,1300,590,1230,270,.87,-.018,6],[300,1190,530,1310,620,1260,360,.82,.01,6],
  [307,1200,690,1320,690,1260,390,.76,.02,7],[324,1200,690,1530,450,1330,360,.76,-.01,7],
  [342,1200,690,1780,250,1400,350,.76,0,7]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 const facing=t=>t>=67&&t<91||t>=193&&t<214?-1:1;
 function actor(t,alpha=1){const [x,y,,,,,,,pose]=camera(shots,t);art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,pose<4?620:570,{face:facing(t),alpha});}
 function draw({target:opponent,face,time}){
  const t=HinakoLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll]=camera(shots,t);
  const flinch=Math.max(...Array.from(HinakoLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const change=pulse(t,150,156,159,168),finish=pulse(t,301,307,313,332);
  frameClip();ctx.fillStyle='#160e25';ctx.fillRect(0,0,W,H);art.image('court',-80-t*.07,-58,W+185,H+116);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.6,finish));
  for(const [hit,angle,dir] of [[52,0,1],[82,.06,-1],[112,-.91,1],[142,.72,1]]){
   art.strike(0,tx-dir*65,ty-(hit===112?175:100),520,457,pulse(t,hit-5,hit,hit+1,hit+9),angle,dir);
  }
  art.glow(2,x,y-235,600,527,change*.38);
  for(const [hit,angle,dir] of [[178,-.08,1],[204,.08,-1],[230,-.78,1],[252,.78,1]]){
   art.strike(1,tx-dir*58,ty-180,565,496,pulse(t,hit-5,hit,hit+1,hit+10),angle,dir);
  }
  art.strike(2,tx,ty-100,410,360,pulse(t,270,274,276,284));
  // The final impact remains centered on the giant fist and grounded victim.
  art.strike(3,x+235,y-13,1300,620,finish);
  art.strike(2,tx,ty-110,1050,922,finish);
  actor(t);
  target(opponent,tx+flinch*18,ty-flinch*18,-.1-flinch*.27-ease((t-308)/28)*1.44);
  ctx.restore();flash('232,203,255',Math.max(flinch*.1,change*.17,finish*.2));bands(t,'#12091d');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,180+time*5,158,1-time/HinakoLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const AlucardLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('alucard',['cutin','court','poses','motion','effects']);
 const shots=[
  [0,470,680,900,610,691,402,1.08,.012,0],[32,480,680,910,610,700,402,1.09,-.013,0],
  [39,570,680,935,610,751,402,1.06,-.013,1],[48,730,680,990,607,861,400,1.05,.018,2],
  [54,900,680,1010,600,957,397,1.02,.01,3],[61,1170,680,1030,600,1103,397,1.02,-.013,0],
  [69,1170,680,1000,600,1088,397,1.04,-.013,1],[76,1020,680,820,597,920,395,1.06,-.018,2],
  [82,880,680,810,590,849,390,1.02,.01,3],[88,660,680,850,570,761,381,.98,-.014,0],
  [98,740,625,965,460,854,337,.99,-.018,4],[106,820,480,1050,280,937,282,1.02,.02,4],
  [114,940,350,1120,330,1033,240,1.01,-.014,5],[124,1020,460,1190,510,1111,319,.99,.014,5],
  [132,1120,590,1260,570,1192,370,1.00,.018,5],[140,1160,680,1280,610,1223,402,.96,-.014,6],
  [149,1460,680,1270,610,1370,402,1.01,.012,1],[158,1460,680,1240,607,1351,401,1.04,-.018,2],
  [166,1310,680,1140,600,1224,397,1.00,.01,3],[174,880,680,1120,595,1004,394,.97,-.014,1],
  [184,915,680,1160,590,1040,390,1.03,.018,2],[193,930,680,1180,587,1057,388,.97,-.014,6],
  [205,730,680,1140,587,940,387,.88,.012,7],[244,730,680,1140,585,941,385,.90,-.012,7],
  [281,730,680,1145,582,944,380,.85,.018,7],[297,730,680,1425,360,996,380,.81,-.01,7],
  [310,730,680,1690,190,1045,382,.81,0,7]
 ];
 const swings=[[48,0,-.06,1],[76,0,.07,-1],[106,1,-.91,1],[132,1,.85,1],[158,0,.07,-1],[184,0,-.1,1]];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 const facing=t=>t>=59&&t<86||t>=147&&t<172?-1:1;
 function actor(t,alpha=1){const [x,y,,,,,,,pose]=camera(shots,t);art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,550,{face:facing(t),alpha});}
 function draw({target:opponent,face,time}){
  const t=AlucardLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const flinch=Math.max(...Array.from(AlucardLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const finish=pulse(t,276,281,286,303),charge=pulse(t,202,216,270,281);
  frameClip();ctx.fillStyle='#11152c';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.1,-66,W+189,H+134);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.6,finish));
  const rushing=[[37,55],[66,83],[96,138],[149,169],[176,194]].some(([a,b])=>t>=a&&t<=b);
  if(rushing){actor(Math.max(0,t-5),.12);actor(Math.max(0,t-2),.22);}
  for(const [hit,n,angle,dir] of swings){
   const power=pulse(t,hit-5,hit,hit+1,hit+9);
   art.strike(n,tx-dir*72,ty-106,n?387:421,n?345:316,power,angle,dir);
  }
  for(const hit of [224,244,264])art.strike(3,tx-8,ty-106,302,302,pulse(t,hit-4,hit,hit+2,hit+10));
  for(let n=0;n<8;n++){
   const phase=((t-210+n*4)%27+27)%27/27,angle=n*Math.PI/4;
   const fromX=tx+Math.cos(angle)*155,fromY=ty-105+Math.sin(angle)*124;
   const toX=x+35,toY=y-214;
   const sx=mix(fromX,toX,ease(phase)),sy=mix(fromY,toY,ease(phase))-Math.sin(phase*Math.PI)*75;
   // The spirit's face is on the LEFT of the source, so leftward travel has zero rotation.
   art.strike(2,sx,sy,214,139,charge*Math.sin(phase*Math.PI)*.86,Math.atan2(toY-fromY,toX-fromX)-Math.PI);
  }
  art.glow(3,x+21,y-211,290+charge*120,290+charge*120,charge*.34);
  art.strike(3,tx-10,ty-106,720+finish*125,720+finish*125,finish);
  actor(t);
  target(opponent,tx+flinch*18,ty-flinch*18,-.10-flinch*.27-ease((t-282)/26)*1.44);
  ctx.restore();flash('210,224,255',Math.max(flinch*.11,finish*.22));bands(t,'#090d1a');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,171+time*6,142,1-time/AlucardLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

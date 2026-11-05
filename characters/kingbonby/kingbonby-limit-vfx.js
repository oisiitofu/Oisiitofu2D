'use strict';
const KingbonbyLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('kingbonby',['cutin','court','poses','motion','train','effects']);
 const shots=[
  [0,490,685,990,610,746,399,1.03,.012,0],[35,530,685,1000,610,770,399,1.03,-.014,0],
  [49,605,685,1010,607,811,397,1.02,.018,1],[77,635,685,1040,604,842,395,1.01,-.014,1],
  [105,665,685,1070,600,873,392,1.00,.018,1],[116,680,685,1090,600,890,392,.96,-.014,2],
  [121,730,540,1100,600,921,343,.94,-.018,3],[127,840,390,1110,595,981,295,.92,.013,4],
  [131,900,560,1120,600,1017,354,.95,.017,5],[133,900,685,1120,585,1018,389,.98,.024,6],
  [141,900,685,1150,600,1029,394,.96,-.014,2],[148,920,530,1180,600,1056,340,.92,-.018,3],
  [155,1010,360,1250,595,1137,285,.89,.013,4],[160,1100,535,1320,600,1217,342,.92,.014,5],
  [163,1100,685,1330,585,1221,389,.96,.025,6],[171,1080,685,1360,600,1227,395,.94,-.014,2],
  [180,1160,520,1430,600,1303,338,.89,-.018,3],[186,1270,330,1500,595,1392,273,.86,.013,4],
  [190,1370,530,1560,600,1472,341,.90,.014,5],[193,1370,685,1560,585,1472,389,.95,.026,6],
  [205,1090,685,1560,600,1370,396,.72,-.013,7],[223,1090,685,1560,580,1390,390,.68,.02,7],
  [246,1090,685,1560,574,1392,386,.68,-.02,7],[267,1090,685,1560,570,1397,382,.66,.014,7],
  [283,1090,685,1570,560,1407,377,.76,.023,7],[305,1090,685,1910,335,1473,378,.72,-.012,7],
  [320,1090,685,2210,160,1530,380,.72,0,7]
 ];
 const diceHits=[49,63,77,91,105],stomps=[133,163,193];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=KingbonbyLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const flinch=Math.max(...Array.from(KingbonbyLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const finish=pulse(t,278,283,290,312),transform=pulse(t,202,212,220,231);
  frameClip();ctx.fillStyle='#35203b';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.12,-66,W+189,H+134);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.7,finish));
  for(const hit of diceHits){
   const travel=ease((t-hit+14)/14);
   for(const n of [-1,1]){
    const dx=mix(x+159,tx+n*32,travel),dy=mix(y-233,ty-100+n*28,travel)-Math.sin(travel*Math.PI)*(96+n*17);
    art.strike(0,dx,dy,125,125*650/740,pulse(t,hit-14,hit-11,hit,hit+6),t*.12+n*1.2);
   }
   art.strike(1,tx-10,ty-100,235,205,pulse(t,hit-1,hit,hit+2,hit+9));
  }
  for(const hit of stomps){
   const power=pulse(t,hit-2,hit,hit+2,hit+12);
   art.strike(1,x+120,y-14,524,211,power);
   art.strike(1,tx-13,ty-102,330,290,power);
  }
  art.glow(3,x,y-160,370+transform*200,370+transform*200,transform*.58);
  if(t<224)art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,pose<4?479:681,{alpha:1-ease((t-210)/14)});
  // Front anchor is the cowcatcher, so the visible engine meets the victim at each hit.
  for(const [start,hit,end,dir,view,height] of [[207,223,237,1,0,760],[230,246,260,-1,0,760],[267,283,315,1,1,855]]){
   if(t<start||t>end)continue;
   const front=t<=hit?mix(tx-dir*1450,tx+dir*48,ease((t-start)/(hit-start))):mix(tx+dir*48,tx+dir*1250,ease((t-hit)/(end-hit)));
   const show=pulse(t,start,start+3,end-5,end);
   art.strike(2,front-dir*360,610,1010,235,show*.85,0,dir);
   art.grid('train',view,2,1,front,730,height,{anchorX:.91,face:dir,alpha:show});
  }
  for(const hit of [223,246])art.strike(3,tx-8,ty-106,521,521,pulse(t,hit-1,hit,hit+2,hit+11));
  art.strike(3,tx-9,ty-107,905+finish*140,905+finish*140,finish);
  target(opponent,tx+flinch*20,ty-flinch*20,-.10-flinch*.28-ease((t-284)/27)*1.45);
  ctx.restore();flash('255,218,158',Math.max(flinch*.12,finish*.24));bands(t,'#23152c');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(1,x,y,177+time*6,142,1-time/KingbonbyLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

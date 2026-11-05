'use strict';
const DonchanLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('donchan',['cutin','court','poses','effects']);
 const shots=[
  [0,487,648,991,628,732,426,1.08,-.01,0],
  [46,529,649,989,626,756,426,1.02,.012,1],
  [93,556,649,1017,622,793,419,.97,-.013,2],
  [117,545,649,1041,621,789,381,.86,.015,0],
  [161,607,649,1054,612,834,400,.95,-.016,2],
  [189,700,592,1121,607,896,385,.85,.015,3],
  [208,626,649,1340,438,927,410,.89,-.012,0],
  [245,589,649,1735,158,949,432,.88,0,0]
 ];
 const beats=[...DonchanLimitProfile.combo.keys()];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=DonchanLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const finale=pulse(t,177,194,200,222),lane=pulse(t,33,45,164,181);
  let flinch=0,beatPose=pose;
  for(const [i,hit] of beats.entries()){
   const tap=pulse(t,hit-2,hit,hit+1,hit+6);
   if(tap>flinch){flinch=tap;beatPose=1+i%2;}
  }
  frameClip();ctx.fillStyle='#312238';ctx.fillRect(0,0,W,H);art.image('court',-75-t*.10,-53,W+176,H+110);
  world(cx,cy,z,roll,face,t,Math.max(finale,flinch*.48));
  ctx.save();ctx.globalAlpha=lane*.78;ctx.fillStyle='#38243b';ctx.fillRect(575,333,708,74);
  ctx.strokeStyle='#eeb47b';ctx.lineWidth=4;ctx.strokeRect(575,333,708,74);
  ctx.beginPath();ctx.arc(650,370,27,0,Math.PI*2);ctx.stroke();ctx.restore();
  for(const [i,hit] of beats.entries()){
   const approach=pulse(t,hit-30,hit-22,hit,hit+3)*lane;
   if(approach>0)art.strike(i%2,mix(1253,650,ease((t-hit+30)/30)),370,78,59,approach);
  }
  art.grid('poses',beatPose,2,2,x,y,298);
  target(opponent,tx+flinch*19,ty-flinch*19,-.12-flinch*.18-ease((t-198)/36)*1.49);
  for(const [i,hit] of beats.entries()){
   const strike=pulse(t,hit-5,hit,hit+1,hit+7),travel=ease((t-hit+5)/5);
   if(strike>0)art.strike(i%2,mix(x+104,tx-27,travel),ty-115-(i%2)*21,147+strike*51,131,strike,0,-1);
  }
  art.strike(2,tx-6,ty-78,310+flinch*109,209,flinch*.84);
  art.strike(3,1129,497-finale*108,422+finale*586,339+finale*295,finale);
  ctx.restore();flash('255,220,162',finale*.24);bands(t,'#34243a');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,136+time*5,112,1-time/DonchanLimitProfile.contactHold*.6,0,-face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

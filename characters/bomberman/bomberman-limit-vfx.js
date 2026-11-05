'use strict';
const BombermanLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('bomberman',['cutin','court','poses','effects']);
 const shots=[
  [0,447,647,958,607,718,398,1.07,.014,0],
  [48,721,647,984,607,861,393,1.05,-.017,1],
  [66,612,647,1033,605,825,394,.96,.015,2],
  [84,610,647,1072,605,847,393,.91,-.014,1],
  [101,576,647,1109,605,847,392,.86,.016,3],
  [144,604,647,1159,602,891,391,.86,-.015,3],
  [175,702,647,1204,594,957,389,.83,.017,2],
  [190,752,647,1242,592,1003,390,.82,-.014,1],
  [212,724,647,1243,590,1002,430,.69,.012,3],
  [225,726,647,1259,574,1012,450,.68,.023,3],
  [244,726,647,1659,285,1097,430,.75,-.014,3],
  [261,726,647,1897,169,1155,382,.80,0,3]
 ];
 const chain=[[111,-131,11],[126,11,-72],[141,141,13],[156,37,75],[171,-74,7]];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=BombermanLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const charge=pulse(t,191,205,218,224),finish=pulse(t,219,224,229,249);
  const flinch=Math.max(...Array.from(BombermanLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  frameClip();ctx.fillStyle='#15204b';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.12,-65,W+189,H+132);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.59,finish));
  for(const [hit,dx,dy] of chain){
   const bx=tx+dx,by=ty+dy;
   art.strike(0,bx,by,128,128*650/740,pulse(t,82,89,hit-2,hit));
   art.strike(2,bx,by,339,298,pulse(t,hit-3,hit,hit+2,hit+10));
  }
  const firstFlight=ease((t-51)/19),kickFlight=ease((t-77)/19);
  art.strike(1,tx-43,ty-112,230,206,pulse(t,44,48,49,57));
  art.strike(0,mix(x+108,tx-27,firstFlight),y-52,192,192*650/740,pulse(t,51,55,68,71),firstFlight*.8);
  art.strike(2,tx-27,ty-81,420,369,pulse(t,68,71,74,83));
  art.strike(0,mix(x+108,tx-21,kickFlight),y-52,185,185*650/740,pulse(t,76,79,93,96),kickFlight*2.1);
  art.strike(2,tx-21,y-52,429,377,pulse(t,93,96,98,106));
  art.strike(1,tx-20,ty-75,449,377,pulse(t,184,188,191,201));
  art.glow(1,tx-13,ty-88,480+charge*209,360+charge*167,charge*.36);
  const megaWidth=395+charge*175,megaFlight=ease((t-190)/10);
  art.strike(0,mix(x+108,tx-16,megaFlight),647-(110+charge*55),megaWidth,megaWidth*650/740,pulse(t,192,199,219,224));
  art.strike(3,tx+7,ty-100,690+finish*474,606+finish*416,finish);
  art.grid('poses',pose,2,2,x,y,346);
  target(opponent,tx+flinch*24,ty-flinch*23,-.10-flinch*.30-ease((t-225)/28)*1.49);
  ctx.restore();flash('255,210,146',Math.max(flinch*.12,finish*.25));bands(t,'#151c40');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(1,x,y,156+time*6,118,1-time/BombermanLimitProfile.contactHold*.6,-.09,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

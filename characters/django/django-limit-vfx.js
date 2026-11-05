'use strict';
const DjangoLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('django',['cutin','court','poses','devices','effects']);
 const shots=[
  [0,480,660,990,611,738,395,1.07,.014,0],
  [45,530,660,1000,609,774,393,1.06,-.015,1],
  [62,555,660,1022,606,795,392,1.07,.015,1],
  [79,580,660,1046,604,817,390,1.07,-.015,1],
  [96,605,660,1070,602,840,388,1.07,.015,1],
  [119,500,685,1010,603,864,401,.86,-.014,2],
  [143,490,685,1010,603,868,401,.87,.014,2],
  [177,490,685,1010,603,874,394,.88,-.014,2],
  [211,490,685,1010,603,881,385,.89,.014,2],
  [225,490,685,1010,600,884,362,.83,-.014,3],
  [233,490,685,1030,585,888,353,.82,.02,3],
  [251,490,685,1210,350,910,357,.81,-.014,3],
  [268,490,685,1450,170,950,363,.82,0,3]
 ];
 const gunshots=[45,62,79,96],purification=[143,160,177,194,211];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=DjangoLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const flinch=Math.max(...Array.from(DjangoLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const establish=ease((t-105)/12),finish=pulse(t,227,232,242,262),charge=pulse(t,115,134,220,232);
  frameClip();ctx.fillStyle='#22213d';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.1,-66,W+189,H+134);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.55,finish));
  // The circle, opposing reflectors and open solar coffin reveal the purification setup.
  art.strike(1,1010,621,760,290,establish*.88);
  art.grid('devices',0,2,2,715,665,304,{alpha:establish});
  art.grid('devices',1,2,2,1370,665,304,{alpha:establish});
  art.grid('devices',2,2,2,1010,675,285,{alpha:establish});
  for(const hit of gunshots){
   const flight=ease((t-hit+9)/9),fromX=x+146,fromY=y-182,toX=tx-20,toY=ty-107;
   art.strike(0,mix(fromX,toX,flight),mix(fromY,toY,flight),264,264*650/740,pulse(t,hit-9,hit-7,hit,hit+6),Math.atan2(toY-fromY,toX-fromX));
  }
  art.glow(1,x+24,y-150,267+charge*100,251+charge*100,charge*.3);
  let beam=0;
  for(const hit of purification)beam=Math.max(beam,pulse(t,hit-6,hit,hit+2,hit+10));
  const strength=Math.max(beam,finish);
  art.strike(2,869,500,377,178+finish*74,strength);
  art.strike(2,1200,500,377,178+finish*74,strength,Math.PI);
  art.strike(1,1010,493,257+finish*180,244+finish*159,beam*.83);
  art.strike(3,1010,341,630,790,finish);
  let current=pose;
  if(t<107)current=gunshots.some(hit=>t>=hit-3&&t<=hit+4)?1:0;
  art.grid('poses',current,2,2,x,y,348);
  art.grid('devices',3,2,2,x+117,y-320,127,{alpha:establish});
  target(opponent,tx+flinch*17,ty-flinch*17,-.10-flinch*.23-ease((t-233)/28)*1.44);
  ctx.restore();flash('255,229,168',Math.max(flinch*.10,finish*.21));bands(t,'#1d1830');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,169+time*6,139,1-time/DjangoLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

"use strict";
const WonderLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('wonder',['cutin','court','poses','motion','avatars','effects']);
 const shots=[
 [0,450,690,960,610,710,390,1.02,0,0],[32,470,690,970,610,720,390,1.02,-.01,0],
 [42,620,690,990,605,800,385,.98,-.012,1],[54,800,690,1040,585,920,375,1.01,.014,2],
 [69,1300,690,1100,585,1200,375,.93,0,1],[75,1330,690,1110,585,1220,375,.98,0,1],
 [83,1200,690,940,580,1070,370,1.01,-.014,4],[98,850,580,1130,440,990,300,.91,-.02,3],
 [116,1050,390,1310,280,1180,220,.92,.015,3],[132,1200,320,1480,260,1340,210,.89,.01,3],
 [149,1100,500,1660,280,1380,250,.90,-.016,5],[165,1150,640,1720,510,1430,350,.87,-.01,6],
 [180,1200,690,1750,590,1470,380,.90,.016,6],[195,2070,520,1510,300,1790,250,.84,0,5],
 [210,2000,500,1450,280,1730,245,.90,-.016,5],[224,1490,450,2050,260,1560,250,.70,0,5],
 [239,1530,500,2090,280,1600,270,.70,.015,5],[253,1580,690,2180,450,1780,280,.73,-.01,7],
 [269,1660,690,2220,450,1840,280,.73,.014,7],[280,1640,690,2230,450,1840,280,.73,-.01,7],
 [292,1670,690,2230,450,1790,335,.72,.014,7],[306,1780,690,2340,450,1960,335,.72,-.01,7],
 [315,1800,690,2360,450,1980,335,.70,.018,7],[332,1800,690,2600,300,2070,325,.70,-.01,7],
 [350,1800,690,2860,130,2170,320,.70,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 const facing=t=>t>=73&&t<96||t>=193&&t<222?-1:1;
 function actor(t,alpha=1){const [x,y,,,,,,,pose]=camera(shots,t);art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,550,{face:facing(t),alpha});}
 function bullet(sx,sy,ex,ey,a){if(a<=0)return;const distance=Math.hypot(ex-sx,ey-sy),angle=Math.atan2(ey-sy,ex-sx),scale=distance/530;
  // Source shot: muzzle at(120,350), bullet tip(650,350) in740x650 cell.
  const dx=250*scale,dy=-25*scale;art.strike(1,sx+dx*Math.cos(angle)-dy*Math.sin(angle),sy+dx*Math.sin(angle)+dy*Math.cos(angle),740*scale,650*scale,a,angle);
 }
 function heroShots(t,a){const [x,y,tx,ty,,,,,pose]=camera(shots,t),dir=facing(t),scale=550/640;
  const points=pose===5?[[610,250]]:pose===6?[[545,372]]:[[620,220],[520,260]];
  for(const [px,py] of points)bullet(x+dir*(px-390)*scale,y+(py-614.4)*scale,tx,ty-95,a);
 }
 function persona(t,a){const [,,tx,ty]=camera(shots,t),scale=900/800,n=t<253?1:t<281?2:3;
  const [px,py]=n===1?[725,475]:n===2?[710,585]:[720,447];
  const angle=n===2?0:Math.atan2(140,650),ox=tx-(n===2?500:650),oy=ty-(n===2?345:235);
  // Tilt the complete airborne pose so the visible gold muzzles and shot direction agree.
  ctx.save();ctx.translate(ox,oy);ctx.rotate(angle);art.grid('avatars',n,2,2,-(px-450)*scale,-(py-768)*scale,900,{alpha:pulse(t,222,234,335,350)});ctx.restore();
  if(a>0){const points=n===1?[[725,450],[725,500]]:n===2?[[710,585]]:[[720,420],[720,477]];
   for(const [mx,my] of points){const dx=(mx-px)*scale,dy=(my-py)*scale;bullet(ox+dx*Math.cos(angle)-dy*Math.sin(angle),oy+dx*Math.sin(angle)+dy*Math.cos(angle),tx,ty-95,a);}}
 }
 function draw({target:opponent,face,time}){
  const t=WonderLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll]=camera(shots,t);
  const flinch=Math.max(...Array.from(WonderLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const finish=pulse(t,309,315,322,339),charge=pulse(t,285,303,309,316);
  frameClip();ctx.fillStyle='#1b0b12';ctx.fillRect(0,0,W,H);art.image('court',-80-t*.045,-58,W+185,H+116);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.6,finish));
  if(t>=96&&t<139){ctx.save();ctx.strokeStyle='#a1a9bd';ctx.lineWidth=3;ctx.globalAlpha=pulse(t,96,103,131,139);ctx.beginPath();ctx.moveTo(x+23,y-340);ctx.quadraticCurveTo(1050,-75,1190,-180);ctx.stroke();ctx.restore();}
  const shotPower=Math.max(...[149,180,210,239,269,292].map(hit=>pulse(t,hit-3,hit,hit+1,hit+5)));
  if(t>=222)persona(t,Math.max(shotPower,finish));
  for(const [hit,angle,dir] of [[54,0,1],[83,.05,-1],[116,-.8,1]])art.strike(0,tx-dir*65,ty-(hit===116?145:95),530,466,pulse(t,hit-5,hit,hit+1,hit+9),angle,dir);
  if(shotPower>0||finish>0)heroShots(t,Math.max(shotPower,finish));
  art.glow(3,x+180,y-300,280,246,charge*.4);
  art.strike(2,tx-95,ty-95,820,720,finish*.7);
  art.strike(3,tx,ty-95,1060,931,finish);
  actor(t);target(opponent,tx+flinch*18,ty-flinch*16,-.10-flinch*.25-ease((t-316)/30)*1.44);
  ctx.restore();flash('255,214,171',Math.max(flinch*.09,finish*.20));bands(t,'#160a13');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,185+time*5,163,1-time/WonderLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

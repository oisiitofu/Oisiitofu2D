'use strict';
const ReimuLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=ReimuLimitProfile;
 const art=assets('reimu',['cutin','court','poses','ofuda','finish','props','effects']);
 const sheets=['poses','ofuda','finish'];
 const shots=[
  [0,569,749,1115,747,840,431,.94,0,1],
  [28,688,749,1115,747,905,430,.94,0,1],
  [48,839,743,1162,714,998,415,.88,.014,2],
  [66,894,622,1187,687,1039,387,.84,-.019,3],
  [84,937,539,1246,672,1090,362,.81,.011,4],
  [102,1040,457,1274,621,1159,330,.80,.021,5],
  [121,1017,352,1332,553,1172,300,.76,-.026,6],
  [140,1070,297,1367,466,1216,272,.73,.019,7],
  [160,1126,283,1426,423,1276,251,.72,-.021,8],
  [181,1218,327,1499,404,1360,272,.70,0,9],
  [210,1227,462,1570,421,1401,320,.70,.022,10],
  [234,1227,629,1921,318,1526,341,.64,-.012,11],
  [268,1227,749,2256,160,1657,356,.61,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,7)));
  const finish=pulse(t,210,4,27);
  frameClip();
  ctx.fillStyle='#44314c';ctx.fillRect(0,0,W,H);
  art.image('court',-84-cx*.019,-86-cy*.10,W+237,H+183);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.49,finish));
  const seal=ease((t-73)/35)*(1-ease((t-187)/51));
  art.grid('props',1,2,2,1360,748,719,{alpha:seal*.56});
  for(const [frame,px,py] of [[66,1114,781],[84,1153,674],[102,1204,581],[121,1262,484],[140,1321,388]]){
   art.grid('props',0,2,2,px,py,268,{alpha:pulse(t,frame,5,50)});
  }
  art.grid('props',2,2,2,tx-85,ty-214,636,{alpha:pulse(t,189,23,27)});
  art.grid('props',3,2,2,tx+81,ty+48,614,{alpha:finish});
  target(opponent,tx,ty-hit*11,-.1-hit*.37-ease((t-211)/39)*1.43,2.60);
  art.grid(sheets[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,492);
  for(const [beat,kind,angle] of [[48,0,.02],[66,1,.13],[84,2,-.07],[102,1,.23],[121,2,.18],[140,0,.09],[160,0,-.15]]){
   art.strike(kind,tx-31,ty-105,kind===2?508:431,324,pulse(t,beat,3,8),angle);
  }
  art.strike(3,tx+85,ty-91,992,648,finish,.08);
  ctx.restore();
  flash('255,217,236',Math.max(hit*.045,finish*.16));bands(t,'#302338');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,170+time*5,141+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

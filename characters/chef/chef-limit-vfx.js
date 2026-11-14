'use strict';

const ChefLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=ChefLimitProfile;
 const art=assets('chef',['cutin','court','poses','cook','finish','props','effects']);
 const sheets=['poses','cook','finish'];
 const shots=[
  [0,575,754,1115,749,845,430,.94,0,1],
  [27,625,754,1115,749,866,430,.93,0,2],
  [48,822,754,1147,725,982,420,.88,-.018,3],
  [66,930,652,1192,694,1053,388,.85,.022,4],
  [84,1044,624,1257,698,1151,381,.82,-.016,5],
  [102,1146,614,1305,646,1227,367,.82,.021,6],
  [120,1210,617,1400,664,1304,368,.80,-.022,7],
  [138,1305,666,1451,688,1387,397,.80,.012,8],
  [157,1392,665,1556,619,1484,390,.78,-.019,9],
  [175,1492,623,1609,659,1549,382,.76,0,10],
  [198,1556,622,1749,604,1650,371,.71,.022,11],
  [220,1556,622,2055,409,1788,341,.66,0,12],
  [258,1556,622,2381,178,1900,312,.61,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,7)));
  const finish=pulse(t,198,4,23);
  frameClip();
  ctx.fillStyle='#533642';ctx.fillRect(0,0,W,H);
  art.image('court',-83-cx*.024,-92-cy*.058,W+250,H+183);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.45,finish));
  art.grid('props',0,2,2,mix(891,1234,ease((t-67)/57)),858,495,{alpha:ease((t-37)/16)});
  art.grid('props',0,2,2,1610,853,565,{alpha:ease((t-109)/19)});
  art.grid('props',1,2,2,x+132,y+56,418,{alpha:pulse(t,131,13,28)});
  art.grid('props',2,2,2,mix(x,tx,.74)+65,ty-98,366,{alpha:Math.max(pulse(t,66,5,13),pulse(t,138,6,13))*.87});
  target(opponent,tx,ty-hit*11,-.1-hit*.36-ease((t-199)/37)*1.44,2.62);
  art.grid(sheets[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,483);
  art.grid('props',3,2,2,mix(x+98,tx+32,ease((t-185)/14)),ty+26,433,{alpha:pulse(t,197,14,14)});
  for(const [beat,kind,angle] of [[48,0,.11],[66,1,.02],[84,0,-.15],[102,2,-.08],[120,0,.09],[138,1,.16],[157,2,-.11]]){
   art.strike(kind,tx-38,ty-100,kind===2?481:438,322,pulse(t,beat,3,8),angle);
  }
  art.strike(3,tx+56,ty-89,1043,650,finish,.10);
  ctx.restore();
  flash('255,235,189',Math.max(hit*.049,finish*.16));bands(t,'#3a2a37');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,170+time*5,139+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

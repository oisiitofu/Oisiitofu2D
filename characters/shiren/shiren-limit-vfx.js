"use strict";

const ShirenLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=ShirenLimitProfile;
 const art=assets('shiren',['cutin','court','poses','motion','dosukoi','props','effects']);
 const atlases=['poses','motion','dosukoi'];
 const shots=[
  [0,550,700,1080,727,828,420,.97,0,1],
  [34,550,700,1080,727,828,420,.97,0,1],
  [62,857,704,1127,708,1003,400,.89,.018,1],
  [79,879,715,1216,714,1046,404,.87,-.035,5],
  [101,977,749,1272,726,1125,421,.87,-.032,6],
  [127,1005,749,1280,736,1147,423,.89,0,3],
  [145,940,749,1270,730,1116,423,.89,.016,8],
  [164,957,751,1330,697,1145,413,.87,-.01,4],
  [178,1005,750,1404,723,1210,419,.86,0,9],
  [182,1104,744,1322,711,1218,415,.83,.026,10],
  [187,1165,749,1423,713,1284,416,.83,.026,11],
  [210,1195,750,1470,675,1326,409,.83,-.021,11],
  [240,1221,752,1510,692,1361,415,.85,.028,11],
  [269,1301,752,1480,709,1393,417,.82,-.015,9],
  [286,1365,751,1558,690,1461,417,.81,.017,12],
  [310,1389,751,1584,707,1485,418,.78,-.018,11],
  [331,1446,751,1620,698,1514,410,.74,.023,12],
  [350,1446,751,1820,491,1555,391,.70,0,9],
  [376,1446,751,2098,311,1648,387,.67,0,9]
 ];
 const pulse=(t,at,before,after)=>ease((t-at+before)/before)*(1-ease((t-at-1)/after));

 function obstacles(t){
  const stairs=ease((t-39)/12)*(1-ease((t-162)/15));
  art.grid('props',0,2,2,861,763,485,{alpha:stairs});
  const plate=ease((t-82)/14)*(1-ease((t-187)/8));
  art.grid('props',1,2,2,1182,759,265,{alpha:plate});
  const wall=ease((t-219)/22)*(1-ease((t-330)/10));
  art.grid('props',2,2,2,1660,763,730,{alpha:wall});
  for(const [hit,x,height] of [[187,1182,270],[286,1560,405],[331,1640,575]]){
   const travel=ease((t-hit)/18);
   art.grid('props',3,2,2,x+travel*166,759-travel*185,height,{alpha:pulse(t,hit+3,5,20)});
  }
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,4,11)));
  const finish=pulse(t,331,5,27);
  frameClip();
  ctx.fillStyle='#142727';ctx.fillRect(0,0,W,H);
  art.image('court',-88-cx*.022,-78-cy*.026,W+241,H+155);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.64,finish));
  obstacles(t);
  const bolt=ease((t-49)/13);
  art.strike(0,mix(x+106,tx-20,bolt),mix(y-141,ty-134,bolt),385,228,pulse(t,59,10,8));
  art.glow(2,x,y-111,412,295,pulse(t,174,11,17)*.63);
  art.strike(3,tx+23,ty-118,963,675,finish);
  target(opponent,tx,ty-hit*14,-.14-hit*.37-ease((t-333)/32)*1.52,2.76);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,pose>=9?505:442);
  for(const [beat,kind] of [[101,2],[145,1],[187,1],[240,2],[286,3]]){
   const trap=beat===145||beat===187;
   const impactX=trap?1182:tx-23,impactY=trap?y-52:ty-108;
   art.strike(kind,impactX,impactY,kind===3?515:358,kind===3?429:267,pulse(t,beat,4,12));
  }
  ctx.restore();
  flash('255,224,160',Math.max(hit*.061,finish*.17));bands(t,'#132024');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(2,x,y,175+time*5,148+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

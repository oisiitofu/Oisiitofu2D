"use strict";

const ReanLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=ReanLimitProfile;
 const art=assets('rean',['cutin','court','poses','awaken','valimar','props','effects']);
 const atlases=['poses','awaken','valimar'];
 const shots=[
  [0,547,745,1085,731,818,420,.96,0,1],
  [31,547,745,1085,731,818,420,.96,0,1],
  [61,877,747,1145,728,1018,425,.91,.02,1],
  [84,903,748,1205,738,1065,425,.89,-.02,2],
  [101,921,749,1213,726,1072,423,.89,.03,3],
  [121,921,749,1213,725,1072,419,.88,.014,4],
  [143,930,748,1195,703,1065,414,.88,-.02,5],
  [167,977,746,1239,641,1107,402,.87,-.029,6],
  [189,1006,746,1245,558,1129,362,.83,.036,7],
  [212,1017,748,1288,607,1164,387,.82,0,8],
  [227,1017,500,1402,634,1212,305,.69,-.028,9],
  [237,995,744,1457,689,1252,402,.69,.023,10],
  [259,1004,750,1513,704,1271,415,.70,.017,10],
  [285,1065,750,1544,690,1313,410,.72,-.013,11],
  [314,1082,749,1557,700,1320,406,.71,-.015,11],
  [331,1135,748,1527,685,1306,404,.69,.027,12],
  [354,1135,748,1806,474,1437,385,.66,0,12],
  [376,1135,748,2075,308,1530,382,.64,0,12]
 ];
 const pulse=(t,at,before,after)=>ease((t-at+before)/before)*(1-ease((t-at-1)/after));

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,4,10)));
  const finish=pulse(t,331,5,26);
  frameClip();
  ctx.fillStyle='#1d2836';ctx.fillRect(0,0,W,H);
  art.image('court',-89-cx*.022,-81-cy*.026,W+243,H+161);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.62,finish));
  art.grid('props',0,2,2,1017,747,719,{alpha:pulse(t,219,24,38)});
  art.grid('props',3,2,2,1017,740,721,{alpha:pulse(t,218,11,15)*.65});
  const debris=ease((t-237)/22);
  art.grid('props',2,2,2,1067+debris*108,738-debris*86,482,{alpha:pulse(t,239,3,26)});
  art.glow(1,x,y-118,474,355,pulse(t,138,15,25)*.63);
  art.glow(2,1017,655,927,445,pulse(t,228,19,16)*.63);
  art.strike(3,tx+29,ty-130,1009,703,finish,0,-1);
  if(pose>=9)art.grid('awaken',3,2,2,1017,748,455,{alpha:1-ease((t-220)/14)});
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,pose>=9?906:455);
  target(opponent,tx,ty-hit*13,-.13-hit*.35-ease((t-333)/33)*1.51,2.74);
  for(const [beat,kind,angle] of [[61,0,.04],[101,0,-.14],[143,1,.11],[189,1,-.61],[237,2,0],[285,2,.21]]){
   art.strike(kind,tx-32,ty-125,beat>=237?528:343,beat>=237?415:291,pulse(t,beat,4,12),angle);
  }
  ctx.restore();
  flash('232,221,253',Math.max(hit*.062,finish*.16));bands(t,'#15222d');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,175+time*5,145+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

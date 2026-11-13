"use strict";

const RagunaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=RagunaLimitProfile;
 const art=assets('raguna',['cutin','court','poses','field','finish','props','effects']);
 const atlases=['poses','field','finish'];
 const plots=[[1011,748,100,145],[1277,707,193,232]];
 const shots=[
  [0,535,747,1091,728,811,428,.94,0,1],
  [31,535,747,1091,728,811,428,.94,0,1],
  [57,868,748,1158,711,1015,421,.89,.017,2],
  [78,975,746,1260,735,1115,423,.86,0,3],
  [100,1011,748,1267,713,1142,426,.85,-.023,4],
  [123,1068,739,1299,730,1187,425,.83,-.019,5],
  [145,1138,709,1098,565,1130,394,.78,.027,6],
  [166,1202,680,1352,673,1273,386,.77,.018,5],
  [193,1277,707,1501,697,1400,405,.76,-.025,7],
  [215,1377,748,1533,724,1451,421,.79,-.011,8],
  [232,1410,748,1345,529,1417,382,.77,.019,8],
  [253,1363,748,1625,651,1491,409,.77,0,9],
  [271,1350,748,1680,646,1516,415,.78,-.02,10],
  [301,1357,748,1722,679,1538,422,.77,.019,11],
  [320,1355,749,1746,723,1550,432,.77,0,11],
  [337,1403,749,1790,676,1597,415,.72,-.02,12],
  [360,1403,749,2165,460,1752,377,.67,0,10],
  [392,1403,749,2407,251,1868,347,.62,0,1]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function field(t){
  for(const [x,y,seed,grow] of plots){
   const sprout=ease((t-grow+9)/26);
   art.grid('props',0,2,2,x,y+15,352,{alpha:ease((t-seed+6)/17)});
   art.grid('props',1,2,2,x,y,202+sprout*119,{alpha:sprout*(1-ease((t-338)/43))});
   art.grid('props',3,2,2,x,y-82-sprout*87,273,{alpha:pulse(t,grow,16,30)});
   art.strike(1,x,y-28,416,236,pulse(t,seed,3,12));
   art.strike(2,x,y-151,491,557,pulse(t,grow,5,14));
  }
 }
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,337,4,24);
  frameClip();
  ctx.fillStyle='#3a4f47';ctx.fillRect(0,0,W,H);
  art.image('court',-88-cx*.017,-80-cy*.022,W+229,H+166);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.52,finish));
  field(t);
  const cross=ease((t-323)/16);
  for(const [i,[px,py]] of plots.entries()){
   const direction=i===0?-.21:.22;
   art.strike(3,mix(px,tx,cross),mix(py-104,ty-133,cross),960,526,finish,direction);
  }
  target(opponent,tx,ty-hit*11,-.11-hit*.34-ease((t-338)/37)*1.42,2.76);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,502);
  for(const [beat,kind,angle] of [[57,0,0],[271,3,-.21],[301,3,.22]]){
   art.strike(kind,tx-21,ty-121,kind===3?551:416,324,pulse(t,beat,3,9),angle);
  }
  ctx.restore();
  flash('204,255,194',Math.max(hit*.056,finish*.16));bands(t,'#24392e');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,170+time*5,141+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

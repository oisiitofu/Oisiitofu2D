"use strict";

const HaseoLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=HaseoLimitProfile;
 const art=assets('haseo',['cutin','court','poses','phase','finish','props','effects']);
 const atlases=['poses','phase','finish'];
 const shots=[
  [0,535,749,1085,727,811,422,.93,0,1],
  [30,535,749,1085,727,811,422,.93,0,1],
  [52,842,749,1136,670,991,415,.89,-.023,2],
  [68,945,630,1167,548,1059,354,.85,.019,3],
  [84,1101,522,1374,531,1230,349,.83,.022,4],
  [105,1155,479,1427,432,1293,324,.80,0,5],
  [119,1258,401,1518,386,1387,294,.77,-.031,5],
  [136,1494,352,1600,471,1538,312,.76,.021,6],
  [152,1647,339,1401,464,1530,314,.74,.039,-7],
  [172,1541,425,1291,530,1421,355,.76,-.021,-6],
  [190,1387,472,1198,567,1309,390,.78,-.026,-7],
  [214,1286,399,1173,666,1228,411,.74,.01,-8],
  [243,1250,677,1089,732,1168,421,.76,.038,-9],
  [262,1194,749,997,712,1092,434,.79,0,-10],
  [277,1178,750,905,680,1044,430,.78,-.016,-10],
  [308,1089,749,812,733,947,431,.78,0,-11],
  [340,1037,749,727,662,887,416,.71,.022,-11],
  [365,1037,749,322,425,745,370,.64,0,-12],
  [394,1037,749,69,219,604,332,.61,0,-12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,340,4,25);
  frameClip();
  ctx.fillStyle='#252539';ctx.fillRect(0,0,W,H);
  art.image('court',-85-cx*.017,-80-cy*.022,W+225,H+165);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.55,finish));
  art.grid('props',0,2,2,1024,765,403,{alpha:.65});
  art.grid('props',2,2,2,1510,428,546,{alpha:pulse(t,146,28,50)*.8});
  art.grid('props',1,2,2,x-45,y-87,470,{alpha:pulse(t,107,14,25)});
  art.grid('props',3,2,2,tx-90,ty-53,553,{alpha:pulse(t,342,4,32)});
  art.glow(3,x-145,y-210,494,403,pulse(t,322,16,16)*.64);
  art.strike(3,mix(x-104,tx-32,ease((t-329)/11)),ty-118,920,774,finish,0,-1);
  for(const [beat,kind,angle,direction] of [[52,0,-.54,-1],[84,0,.25,-1],[119,1,-.22,1],[152,1,.14,-1],[190,1,-.18,-1],[243,2,-.17,-1],[277,2,.13,-1]]){
   art.strike(kind,tx+29,ty-121,kind===2?566:457,384,pulse(t,beat,3,9),angle,direction);
  }
  target(opponent,tx,ty-hit*10,.1+hit*.35+ease((t-341)/39)*1.51,2.74);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,504,{face:Math.sign(signedPose)});
  ctx.restore();
  flash('255,188,206',Math.max(hit*.055,finish*.17));bands(t,'#241c32');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,174+time*5,143+time*4,1-time/profile.contactHold*.63,0,-face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

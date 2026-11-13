"use strict";

const GranLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('gran',['cutin','court','poses','summon','finish','props','effects']);
 const atlases=['poses','summon','finish'];
 const shots=[
  [0,533,750,1115,729,818,430,.94,0,1],
  [30,533,750,1115,729,818,430,.94,0,1],
  [54,884,749,1173,705,1019,425,.88,-.019,2],
  [72,924,744,1234,717,1079,420,.89,0,1],
  [91,1036,746,1291,664,1169,411,.86,.022,2],
  [125,1041,736,1444,698,1238,417,.82,-.036,3],
  [150,900,721,1430,700,1175,415,.76,-.025,3],
  [171,784,749,1432,681,1105,407,.76,.027,4],
  [192,786,749,1450,721,1118,396,.74,0,5],
  [222,813,749,1492,663,1163,349,.70,-.03,5],
  [244,939,749,1509,715,1205,394,.74,.023,6],
  [260,1111,745,1498,692,1318,399,.78,-.029,7],
  [278,1181,747,1535,713,1378,410,.77,0,8],
  [298,1208,749,1579,669,1408,387,.75,.02,9],
  [320,1219,749,1589,729,1424,402,.74,0,9],
  [337,1348,749,1623,652,1486,396,.68,-.027,10],
  [357,1362,750,1968,458,1595,371,.63,0,11],
  [392,1362,750,2302,195,1751,338,.60,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=GranLimitProfile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(GranLimitProfile.combo.keys(),beat=>pulse(t,beat,3,10)));
  const finish=pulse(t,337,5,26);
  const arrival=ease((t-184)/48);
  frameClip();
  ctx.fillStyle='#304a63';ctx.fillRect(0,0,W,H);
  art.image('court',-88-cx*.018,-80-cy*.022,W+235,H+166);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.55,finish));
  const dragonPose=t<230?2:t<312?0:t<352?3:1;
  art.grid('props',dragonPose,2,2,mix(1900,1200,arrival),mix(82,609,arrival),1037,
   {alpha:arrival*(1-ease((t-345)/40))});
  art.glow(2,x-155,624,482,279,Math.max(pulse(t,130,13,24),pulse(t,170,16,19)));
  art.glow(3,1303,331,593,340,pulse(t,300,13,30)*.65);
  art.strike(3,tx-74,ty-195,1210,682,finish,.37);
  art.strike(0,tx-71,ty-130,729,575,finish,-.23);
  target(opponent,tx,ty-hit*11,-.1-hit*.36-ease((t-338)/37)*1.52,2.75);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,498);
  for(const [beat,kind,angle] of [[54,0,-.14],[91,0,-.63],[125,2,.12],[171,2,-.19],[222,1,.07],[260,0,-.21],[298,3,.37]]){
   art.strike(kind,tx-30,ty-121,kind===3?582:430,340,pulse(t,beat,3,9),angle);
  }
  ctx.restore();
  flash('221,247,255',Math.max(hit*.055,finish*.17));bands(t,'#1d3147');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,171+time*5,142+time*4,1-time/GranLimitProfile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

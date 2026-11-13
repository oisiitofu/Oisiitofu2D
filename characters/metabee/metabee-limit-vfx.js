"use strict";

const MetabeeLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('metabee',['cutin','court','poses','recoil','finish','props','effects']);
 const atlases=['poses','recoil','finish'];
 const shots=[
  [0,529,750,1092,731,810,427,.94,0,1],
  [30,529,750,1092,731,810,427,.94,0,1],
  [51,881,750,1179,699,1031,422,.89,-.017,2],
  [81,995,744,1316,691,1164,409,.85,.022,5],
  [101,919,644,1335,730,1128,394,.84,-.027,3],
  [118,799,549,1388,671,1095,361,.80,-.038,3],
  [137,724,748,1432,738,1074,412,.80,.018,4],
  [156,743,749,1499,710,1125,422,.80,.025,6],
  [176,796,748,1512,725,1160,421,.80,0,7],
  [197,856,749,1544,686,1204,402,.79,-.02,8],
  [218,913,749,1556,730,1232,420,.78,0,8],
  [243,916,749,1575,689,1244,406,.76,.022,9],
  [265,931,749,1593,729,1256,422,.77,0,10],
  [284,939,748,1615,674,1280,402,.75,-.024,10],
  [310,930,749,1613,727,1271,422,.75,0,9],
  [333,946,749,1642,679,1296,404,.70,-.027,11],
  [357,901,749,1988,478,1401,374,.64,0,12],
  [392,901,749,2273,215,1548,344,.59,0,1]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=MetabeeLimitProfile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(MetabeeLimitProfile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,333,5,23);
  frameClip();
  ctx.fillStyle='#303849';ctx.fillRect(0,0,W,H);
  art.image('court',-82-cx*.017,-79-cy*.022,W+226,H+159);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.50,finish));
  art.grid('props',0,2,2,x-110,y+12,419,{alpha:Math.max(pulse(t,138,4,22),finish*.83)});
  art.grid('props',1,2,2,x+140,y-99,325,{alpha:pulse(t,341,6,26)});
  art.grid('props',3,2,2,x+27,y-71,385,{alpha:pulse(t,315,18,12)});
  for(const [at,arc] of [[197,148],[284,260]]){
   const progress=ease((t-at+19)/19);
   art.grid('props',2,2,2,mix(x+116,tx,progress),mix(y-216,ty-92,progress)-Math.sin(progress*Math.PI)*arc,252,
    {alpha:pulse(t,at-6,13,9),anchorY:.5});
  }
  art.strike(3,(x+tx)/2+132,ty-129,1366,635,finish);
  for(const [beat,kind,angle] of [[51,0,0],[81,1,-.09],[118,1,.27],[156,1,0],[197,2,.07],[243,0,0],[284,2,-.14]]){
   art.strike(kind,tx-21,ty-124,kind===2?497:436,334,pulse(t,beat,3,9),angle);
  }
  target(opponent,tx,ty-hit*11,-.09-hit*.39-ease((t-334)/36)*1.48,2.75);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,446);
  ctx.restore();
  flash('244,240,194',Math.max(hit*.06,finish*.18));bands(t,'#262937');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,169+time*5,140+time*4,1-time/MetabeeLimitProfile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

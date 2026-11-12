"use strict";

const PiposaruLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=PiposaruLimitProfile;
 const art=assets('piposaru',['cutin','court','poses','motion','net','props','effects']);
 const atlas=['poses','motion','net'];
 const shots=[
  [0,528,750,1073,737,819,422,.97,0,1],
  [30,528,750,1073,737,819,422,.97,0,1],
  [58,875,748,1119,699,1012,419,.91,.015,1],
  [77,877,748,1161,665,1012,398,.89,-.025,2],
  [91,889,610,1197,656,1048,365,.86,-.037,3],
  [110,922,422,1218,650,1059,323,.84,-.037,3],
  [131,946,389,1192,580,1079,308,.84,.008,5],
  [155,961,384,1197,534,1076,303,.86,.021,5],
  [175,980,416,1172,553,1089,320,.87,-.025,4],
  [194,993,534,1210,491,1101,350,.87,-.075,6],
  [211,1051,725,1219,475,1132,396,.87,.018,7],
  [224,1010,748,1161,514,1089,383,.89,.033,8],
  [245,1097,587,1238,519,1152,353,.87,.045,9],
  [268,1185,404,1323,545,1238,343,.85,-.035,10],
  [290,1178,524,1370,567,1250,362,.82,.023,10],
  [310,1140,717,1368,626,1270,416,.78,0,11],
  [324,1130,750,1412,649,1287,414,.77,.024,11],
  [345,1122,749,1701,475,1340,398,.71,0,12],
  [374,1122,749,1962,319,1465,395,.68,0,12]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function glove(t,x,y,tx,ty){
  const out=ease((t-109)/22),back=ease((t-175)/19);
  const active=ease((t-111)/9)*(1-ease((t-184)/10));
  if(active<=0)return;
  const reach=out*(1-back);
  const handX=x+92,handY=y-198;
  const headX=mix(handX,tx-22,reach);
  const loop=Math.sin(Math.PI*ease((t-131)/44));
  const headY=mix(handY,ty-120,reach)-loop*138;
  ctx.save();ctx.globalAlpha*=active;
  ctx.strokeStyle='#27345d';ctx.lineWidth=17;ctx.beginPath();ctx.moveTo(handX,handY);
  ctx.quadraticCurveTo((handX+headX)/2,Math.min(handY,headY)-74*reach,headX,headY);
  ctx.stroke();ctx.strokeStyle='#b4e3ff';ctx.lineWidth=7;ctx.setLineDash([10,9]);ctx.stroke();
  ctx.restore();
  art.grid('props',1,2,2,headX,headY,174,{anchorY:.50,alpha:active});
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,324,6,25);
  const scan=ease((t-52)/9)*(1-ease((t-128)/19));
  const capture=ease((t-258)/13)*(1-ease((t-326)/16));
  frameClip();
  ctx.fillStyle='#142839';ctx.fillRect(0,0,W,H);
  art.image('court',-89-cx*.022,-81-cy*.026,W+243,H+161);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.58,finish));
  art.grid('props',0,2,2,968,754,198,{alpha:scan});
  art.glow(0,1025,705,470+Math.sin(t*.12)*99,162,scan*.66);
  art.grid('props',2,2,2,1383,757,572,{alpha:ease((t-269)/18)*(1-ease((t-333)/15))});
  art.glow(2,1368,ty-143,587,478,capture*.54);
  art.strike(3,tx+31,ty-126,940,698,finish);
  target(opponent,tx,ty-hit*10,-.14-hit*.35-ease((t-326)/35)*1.48,2.76);
  art.grid(atlas[Math.floor(pose/4)],pose%4,2,2,x,y,429,{face:Math.sign(signedPose)});
  glove(t,x,y,tx,ty);
  art.grid('props',3,2,2,tx-10,ty-109,244+capture*386,{anchorY:.54,alpha:capture});
  for(const [i,beat] of [...profile.combo.keys()].entries()){
   const effect=i===0?0:i===2||i===3?1:2;
   art.strike(effect,tx-24,ty-128,315+i*12,247+i*10,pulse(t,beat,3,10),i===2?.24:i===3?Math.PI-.4:-.16);
  }
  ctx.restore();
  flash('191,239,255',Math.max(hit*.061,finish*.17));
  bands(t,'#102236');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(2,x,y,177+time*5,147+time*4,1-time/profile.contactHold*.62,-.11*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

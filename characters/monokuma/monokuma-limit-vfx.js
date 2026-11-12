"use strict";

const MonokumaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=MonokumaLimitProfile;
 const art=assets('monokuma',['cutin','court','poses','motion','bat','props','effects']);
 const atlas=['poses','motion','bat'];
 const shots=[
  [0,530,750,1080,730,816,422,.97,0,1],
  [31,530,750,1080,730,816,422,.97,0,1],
  [48,840,605,1106,725,982,386,.89,-.03,2],
  [62,932,520,1107,705,1021,361,.88,.029,3],
  [82,970,521,1122,648,1056,351,.86,.033,4],
  [98,995,583,1251,618,1120,371,.86,-.034,5],
  [122,1095,750,1374,654,1234,419,.88,-.029,6],
  [144,1218,747,1432,706,1306,410,.89,.02,7],
  [166,1122,746,1366,723,1253,416,.87,.024,-8],
  [192,914,684,1266,688,1100,390,.83,-.03,8],
  [212,933,750,1272,658,1112,411,.83,-.005,9],
  [236,1042,750,1332,673,1208,415,.83,.02,10],
  [257,1041,744,1366,679,1214,407,.82,-.01,10],
  [275,1090,729,1402,696,1261,405,.81,.023,11],
  [296,1089,743,1415,707,1268,414,.81,.025,11],
  [310,1084,748,1442,703,1292,411,.79,.012,10],
  [329,1114,747,1460,683,1292,412,.77,-.03,11],
  [351,1105,748,1797,484,1439,390,.72,0,12],
  [376,1105,748,2031,317,1565,379,.68,0,12]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function machinePosition(t){
  const angle=-.84+ease((t-64)/79)*2.32+Math.max(0,t-143)*.034;
  return {x:1270+Math.cos(angle)*252,y:742+Math.sin(angle)*51,angle};
 }

 function tribunal(t){
  const dais=ease((t-32)/11)*(1-ease((t-145)/21));
  art.grid('props',0,2,2,959,754,412,{alpha:dais});
  const radius=277;
  const {x,y,angle}=machinePosition(t);
  const lever=ease((t-104)/17)*(1-ease((t-192)/20));
  const machine=ease((t-139)/17)*(1-ease((t-338)/23));
  ctx.save();ctx.globalAlpha*=Math.max(dais,machine*.88);
  ctx.translate(1250,719);ctx.scale(1,.22);
  ctx.fillStyle='#181524';ctx.beginPath();ctx.ellipse(0,53,radius+8,radius,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#925374';ctx.lineWidth=14;ctx.stroke();
  const surface=ctx.createLinearGradient(0,-radius,0,radius);
  surface.addColorStop(0,'#4c3048');surface.addColorStop(.45,'#272237');surface.addColorStop(1,'#563646');
  ctx.fillStyle=surface;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#e496d0';ctx.lineWidth=11;ctx.stroke();
  ctx.rotate(angle);
  for(let i=0;i<8;i++){
   ctx.rotate(Math.PI/4);
   ctx.fillStyle=i%2?'#6c3d74':'#bb4a85';ctx.fillRect(radius-48,-16,35,32);
   ctx.fillStyle='#b1758b';ctx.fillRect(72,-5,radius-126,10);
  }
  ctx.restore();
  art.grid('props',1,2,2,1302,754,256,{alpha:lever});
  art.grid('props',2,2,2,x,y,395,{alpha:machine,face:Math.cos(angle)>0?-1:1});
 }

 function balls(t,actorX,actorY,tx,ty){
  const arcs=[[192,189],[236,235],[275,234],[329,140]];
  for(const [beat,arc] of arcs){
   const from=machinePosition(beat-24);
   const sx=beat===329?actorX+158:from.x,sy=beat===329?actorY-169:from.y-251;
   const p=ease((t-beat+24)/24);
   const alpha=ease((t-beat+24)/5)*(1-ease((t-beat+1)/5));
   const x=mix(sx,tx,p),y=mix(sy,ty-125,p)-Math.sin(Math.PI*p)*arc;
   art.grid('props',3,2,2,x,y,153,{anchorY:.5,alpha});
  }
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,329,5,26);
  frameClip();
  ctx.fillStyle='#21172c';ctx.fillRect(0,0,W,H);
  art.image('court',-89-cx*.022,-81-cy*.026,W+243,H+161);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.58,finish));
  tribunal(t);
  balls(t,x,y,tx,ty);
  art.strike(3,tx+37,ty-134,965,691,finish);
  const depthScale=2.66-ease((t-63)/35)*(1-ease((t-113)/30))*.53;
  target(opponent,tx,ty-hit*11,-.13-hit*.33-ease((t-330)/35)*1.51,depthScale);
  art.grid(atlas[Math.floor(pose/4)],pose%4,2,2,x,y,420,{face:Math.sign(signedPose)});
  for(const [i,beat] of [...profile.combo.keys()].entries()){
   const kind=i===0?0:i<3?1:2;
   art.strike(kind,tx-19,ty-115,310+i*13,247+i*10,pulse(t,beat,3,10),i===3?-.48:i===4?.47:0);
  }
  ctx.restore();
  flash('249,212,241',Math.max(hit*.061,finish*.16));
  bands(t,'#211327');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,178+time*5,147+time*4,1-time/profile.contactHold*.62,-.12*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

"use strict";

const AstroLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=AstroLimitProfile;
 const art=assets('astro',['cutin','court','poses','motion','booster','props','effects']);
 const anchor={x:880,y:175},swingRadius=420;
 const shots=[
  [0,540,739,1190,729,847,408,.94,0,1],
  [30,540,739,1190,729,847,408,.94,0,1],
  [58,465,739,1188,726,805,403,.90,-.01,1],
  [74,541,578,1192,711,824,376,.86,-.017,2],
  [91,865,750,1247,665,984,371,.83,.014,3],
  [106,1117,677,1295,637,1129,358,.83,.015,4],
  [128,1182,524,1410,621,1276,361,.83,-.009,5],
  [152,1270,574,1483,610,1370,365,.85,.01,6],
  [167,1340,650,1479,654,1409,405,.85,0,7],
  [185,1343,699,1176,667,1264,405,.86,-.015,-6],
  [205,1190,739,1029,697,1112,416,.91,.012,-7],
  [228,1038,739,1192,693,1137,413,.92,.015,8],
  [249,887,731,1257,705,1102,412,.91,-.01,9],
  [266,990,720,1356,717,1170,414,.89,0,9],
  [279,1125,708,1353,694,1230,400,.88,.017,10],
  [291,1190,685,1390,693,1294,401,.86,-.015,11],
  [303,1380,620,1537,642,1415,367,.81,.022,11],
  [323,1615,615,1753,545,1579,366,.78,0,11],
  [343,1720,739,1984,418,1753,412,.76,0,12],
  [367,1751,739,2180,301,1839,411,.74,0,12]
 ];
 const poseAtlases=['poses','motion','booster'];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function spring(fromX,fromY,toX,toY,alpha,color){
  if(alpha<=0)return;
  const dx=toX-fromX,dy=toY-fromY,length=Math.max(1,Math.hypot(dx,dy));
  ctx.save();
  ctx.globalAlpha=alpha;ctx.lineJoin='round';ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(fromX,fromY);
  for(let i=1;i<=32;i++){
   const f=i/32;
   const coil=Math.sin(f*Math.PI*18)*Math.sin(f*Math.PI)*12;
   ctx.lineTo(fromX+dx*f-dy/length*coil,fromY+dy*f+dx/length*coil);
  }
  ctx.strokeStyle='#123249';ctx.lineWidth=15;ctx.stroke();
  ctx.strokeStyle=color;ctx.lineWidth=7;ctx.stroke();
  ctx.restore();
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  let [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  if(t>=74&&t<=106){
   const angle=mix(-.94,.60,ease((t-74)/32));
   x=anchor.x+Math.sin(angle)*swingRadius;
   y=anchor.y+Math.cos(angle)*swingRadius+155;
  }
  const pose=Math.abs(signedPose)-1;
  const beats=[...profile.combo.keys()];
  const hit=Math.max(...beats.map(beat=>pulse(t,beat,3,8)));
  const finish=pulse(t,303,4,23);
  frameClip();
  ctx.fillStyle='#09152d';ctx.fillRect(0,0,W,H);
  art.image('court',-85-cx*.023,-60-cy*.04,W+224,H+126);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.51,finish));
  const tether=ease((t-47)/12)*(1-ease((t-102)/10));
  const socketAlpha=1-ease((t-112)/19);
  if(socketAlpha>0){
   ctx.save();ctx.globalAlpha=socketAlpha;
   ctx.fillStyle='#15283d';ctx.fillRect(anchor.x-21,anchor.y-138,42,89);
   ctx.fillStyle='#5d8eac';ctx.fillRect(anchor.x-10,anchor.y-138,10,89);ctx.restore();
   art.grid('props',0,2,2,anchor.x,anchor.y,251,{anchorY:.5,alpha:socketAlpha});
  }
  art.grid('props',1,2,2,anchor.x-12,anchor.y+19,156,{anchorY:.5,alpha:tether});
  spring(x+81,y-201,anchor.x,anchor.y,tether,'#c1eaff');
  art.grid('props',3,2,2,1015,755,443,{alpha:pulse(t,248,38,73)});
  art.glow(1,x-225,y-145,715,382,pulse(t,294,16,31)*.72);
  art.strike(3,tx+56,ty-148,840,608,finish);
  target(opponent,tx,ty-hit*12,-.11-hit*.31-ease((t-304)/35)*1.48,2.87);
  for(const [index,beat] of beats.slice(0,4).entries()){
   const strength=pulse(t,beat,5,9);
   if(strength<=0)continue;
   const side=beat===185?-1:1;
   const fx=tx-side*64,fy=ty-139-index*11;
   spring(x+side*68,y-197,fx,fy,strength,index%2?'#a9f8ae':'#cde9ff');
   art.grid('props',1+index%2,2,2,fx,fy,194,{anchorY:.5,face:side,alpha:strength});
  }
  art.grid(poseAtlases[Math.floor(pose/4)],pose%4,2,2,x,y,425,{face:Math.sign(signedPose)});
  for(const [index,beat] of beats.entries())art.strike(index===4?2:0,tx-45,ty-142,335,289,pulse(t,beat,3,8));
  ctx.restore();
  flash('184,230,255',Math.max(hit*.065,finish*.18));
  bands(t,'#09162a');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,174+time*5,146+time*4,1-time/profile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

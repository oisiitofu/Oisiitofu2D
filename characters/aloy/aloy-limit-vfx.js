"use strict";

const AloyLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=AloyLimitProfile;
 const art=assets('aloy',['cutin','court','poses','motion','surge','machine','props','effects']);
 const atlas=['poses','motion','surge'];
 const shots=[
  [0,532,748,1085,731,817,422,.97,0,1],
  [31,532,748,1085,731,817,422,.97,0,1],
  [58,825,749,1085,702,988,424,.91,.011,1],
  [77,843,746,1109,695,998,416,.90,-.02,2],
  [98,922,602,1138,687,1037,375,.86,-.051,3],
  [121,1044,426,1174,647,1117,310,.81,-.069,4],
  [139,1162,418,1311,644,1228,343,.83,-.034,5],
  [155,1321,461,1306,663,1271,363,.86,.03,-5],
  [171,1439,539,1290,670,1333,386,.87,.037,-6],
  [191,1500,702,1248,695,1390,420,.88,.012,-7],
  [217,1579,736,1227,710,1442,422,.87,-.023,8],
  [243,1594,746,1228,711,1455,417,.86,.015,9],
  [266,1695,646,1236,681,1464,373,.82,-.028,-10],
  [287,1718,727,1205,698,1461,410,.78,.018,-11],
  [311,1746,740,1192,696,1431,406,.74,-.015,-11],
  [331,1760,742,1157,684,1431,409,.73,.013,-12],
  [354,1760,742,764,470,1308,392,.69,0,-12],
  [375,1760,742,509,313,1171,388,.66,0,-12]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function grapple(t,x,y){
  const tether=ease((t-79)/11)*(1-ease((t-110)/11));
  const armX=x+71,armY=y-327;
  if(tether>0){
   ctx.save();ctx.globalAlpha*=tether;ctx.beginPath();ctx.moveTo(armX,armY);
   ctx.quadraticCurveTo((armX+1069)/2-21,(armY+131)/2+19,1069,131);
   ctx.strokeStyle='#234459';ctx.lineWidth=13;ctx.stroke();ctx.strokeStyle='#a8e6ff';ctx.lineWidth=4;ctx.stroke();ctx.restore();
  }
  art.grid('props',0,2,2,1069,133,263,{anchorY:.5,alpha:pulse(t,97,24,41)});
  const glide=ease((t-111)/10)*(1-ease((t-127)/11));
  art.grid('props',1,2,2,x+12,y-371,470,{anchorY:.96,alpha:glide});
 }

 function arrows(t,x,y,tx,ty){
  for(const [beat,height,direction] of [[58,199,1],[139,208,1],[331,248,-1]]){
   const travel=ease((t-beat+10)/10);
   const alpha=ease((t-beat+11)/4)*(1-ease((t-beat)/3));
   if(alpha<=0)continue;
   const startX=x+122*direction,startY=y-height;
   const endX=tx-18*direction,endY=ty-121;
   const angle=Math.atan2(endY-startY,(endX-startX)*direction);
   ctx.save();ctx.translate(mix(startX,endX,travel),mix(startY,endY,travel));ctx.scale(direction,1);ctx.rotate(angle);
   art.grid('props',2,2,2,0,0,228,{anchorY:.48,alpha});
   ctx.restore();
  }
 }

 function tremortusk(t){
  const charge=ease((t-246)/84);
  const x=mix(1900,1381,charge),enter=ease((t-178)/20),leave=1-ease((t-342)/23);
  const pose=t<207?0:t<245?1:t<319?2:3;
  art.grid('machine',pose,2,2,x,743,1050,{alpha:enter*leave});
  art.glow(2,x-64,506,512,367,pulse(t,217,8,28)*.65);
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,331,5,25);
  frameClip();
  ctx.fillStyle='#20353f';ctx.fillRect(0,0,W,H);
  art.image('court',-89-cx*.022,-81-cy*.026,W+243,H+161);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.59,finish));
  grapple(t,x,y);
  tremortusk(t);
  arrows(t,x,y,tx,ty);
  const override=pulse(t,217,12,24);
  art.grid('props',3,2,2,1855,568,176,{anchorY:.58,alpha:override*.87});
  art.glow(2,1855,568,323,239,override*.66);
  art.strike(3,tx+41,ty-139,1015,706,finish);
  target(opponent,tx,ty-hit*11,-.13-hit*.33-ease((t-332)/34)*1.52,2.75);
  art.grid(atlas[Math.floor(pose/4)],pose%4,2,2,x,y,489,{face:Math.sign(signedPose)});
  for(const [i,beat] of [...profile.combo.keys()].entries()){
   const kind=i===1||i===3?1:i===4?2:i===5?3:0;
   art.strike(kind,tx-23,ty-128,328+i*13,263+i*10,pulse(t,beat,3,10),i===2?.9:i===3?2.45:0);
  }
  ctx.restore();
  flash('221,239,232',Math.max(hit*.057,finish*.16));
  bands(t,'#152532');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,177+time*5,147+time*4,1-time/profile.contactHold*.62,-.12*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

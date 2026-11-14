"use strict";

const JettLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=JettLimitProfile;
 const art=assets('jett',['cutin','court','poses','glide','finish','props','effects']);
 const sheets=['poses','glide','finish'];
 const shots=[
  [0,570,748,1100,748,835,423,.95,0,1],
  [30,570,748,1100,748,835,423,.95,0,1],
  [52,887,748,1132,730,1000,433,.91,.012,2],
  [72,902,748,1204,733,1065,430,.88,0,3],
  [91,946,520,1224,738,1105,376,.79,-.045,4],
  [105,986,393,1240,702,1129,330,.77,-.029,5],
  [145,1073,279,1302,728,1189,302,.71,.015,6],
  [181,1351,262,1341,676,1342,293,.70,.033,-7],
  [223,1543,281,1341,718,1446,302,.71,-.020,-7],
  [264,1521,312,1359,711,1444,324,.74,0,-8],
  [300,1479,352,1421,697,1455,350,.76,.026,-9],
  [337,1312,510,1501,673,1426,389,.76,-.022,10],
  [363,1128,748,1784,434,1425,416,.67,0,11],
  [400,1128,748,2100,278,1525,402,.61,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finisher=pulse(t,337,5,28);
  frameClip();
  ctx.fillStyle='#1b3448';ctx.fillRect(0,0,W,H);
  art.image('court',-80-cx*.019,-79-cy*.066,W+227,H+171);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.48,finisher));
  art.grid('props',0,2,2,798,741,725,{alpha:pulse(t,79,27,83)*.86});
  art.grid('props',1,2,2,952,762,791,{alpha:pulse(t,94,22,35)*.82});
  art.grid('props',2,2,2,x-46,y+38,484,{alpha:Math.max(pulse(t,52,3,15),pulse(t,363,3,29))});
  art.grid('props',3,2,2,x,y+117,523,{anchorY:.58,alpha:pulse(t,280,25,47)});
  target(opponent,tx,ty-hit*12,-.08-hit*.35-ease((t-338)/39)*1.42,2.62);
  art.grid(sheets[Math.floor(pose/4)],pose%4,2,2,x,y,502,{face:Math.sign(signedPose)});
  for(const [beat,kind,angle,direction] of [[52,1,.14,1],[105,0,.64,1],[145,0,1.02,1],[181,0,-1.25,-1],[223,0,-.9,-1],[264,0,-1.03,-1],[300,2,-1.14,-1]]){
   art.strike(kind,tx-30*direction,ty-114,kind===2?630:500,325,pulse(t,beat,4,10),angle,direction);
  }
  art.glow(2,tx-101,ty-182,838,540,pulse(t,329,11,18)*.47,.43);
  art.strike(3,tx-60,ty-105,1184,758,finisher,.15);
  ctx.restore();
  flash('189,238,255',Math.max(hit*.045,finisher*.15));bands(t,'#17263d');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(1,x,y,174+time*5,138+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

"use strict";

const OctaneLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=OctaneLimitProfile;
 const art=assets('octane',['cutin','court','poses','rebound','finish','props','effects']);
 const sheets=['poses','rebound','finish'];
 const shots=[
  [0,480,753,1130,745,805,429,.94,0,1],
  [30,480,753,1130,745,805,429,.94,0,1],
  [49,669,753,1155,720,926,421,.89,.019,2],
  [67,821,753,1215,747,1018,429,.86,0,3],
  [78,914,753,1246,724,1075,425,.84,0,3],
  [83,938,724,1250,695,1091,412,.83,-.03,4],
  [114,1221,626,1358,687,1282,394,.79,.027,5],
  [153,1584,626,1406,662,1473,395,.78,-.026,-5],
  [178,1672,753,1421,713,1535,423,.81,.025,-6],
  [195,1588,753,1452,745,1520,432,.81,0,-6],
  [209,1554,753,1431,733,1491,425,.80,0,-6],
  [216,1553,672,1411,710,1482,413,.77,.027,-7],
  [254,1346,408,1284,626,1314,336,.73,-.027,-8],
  [273,1154,367,1229,635,1191,326,.73,0,9],
  [291,1051,470,1201,658,1126,352,.76,.023,10],
  [336,1129,751,1238,698,1184,426,.72,-.032,10],
  [351,1129,753,1485,586,1294,417,.68,0,11],
  [402,1129,753,2196,260,1563,358,.61,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,336,5,26);
  frameClip();
  ctx.fillStyle='#523d32';ctx.fillRect(0,0,W,H);
  art.image('court',-84-cx*.018,-80-cy*.055,W+231,H+166);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.55,finish));
  art.grid('props',0,2,2,mix(755,922,ease((t-49)/24)),784,449,{alpha:ease((t-50)/7)});
  art.grid('props',0,2,2,1591,783,432,{alpha:pulse(t,206,29,75)});
  art.grid('props',1,2,2,925,763,572,{alpha:pulse(t,84,4,18)});
  art.grid('props',1,2,2,1574,764,556,{alpha:pulse(t,214,4,18)});
  art.grid('props',2,2,2,x-129*Math.sign(signedPose),y+14,440,{alpha:pulse(t,101,54,66)*.55,face:Math.sign(signedPose)});
  art.grid('props',3,2,2,tx,ty+49,590,{alpha:Math.max(pulse(t,179,3,17),finish)});
  target(opponent,tx,ty-hit*12,-.1-hit*.37-ease((t-337)/40)*1.45,2.58);
  art.grid(sheets[Math.floor(pose/4)],pose%4,2,2,x,y,505,{face:Math.sign(signedPose)});
  for(const [beat,kind,angle,dir] of [[49,1,.11,1],[83,1,-.12,1],[114,2,.03,1],[153,0,.08,-1],[216,1,.09,-1],[254,2,.23,-1],[291,0,.51,1]]){
   art.strike(kind,tx-dir*31,ty-106,kind===2?555:430,334,pulse(t,beat,4,10),angle,dir);
  }
  art.glow(2,x,y-102,685,456,pulse(t,318,18,20)*.57,1.52);
  art.strike(3,tx+35,ty-83,1142,739,finish);
  ctx.restore();
  flash('252,230,148',Math.max(hit*.05,finish*.17));bands(t,'#362a29');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(1,x,y,170+time*5,143+time*4,1-time/profile.contactHold*.65,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

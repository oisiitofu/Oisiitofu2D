'use strict';
const QuoteLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=QuoteLimitProfile;
 const art=assets('quote',['cutin','court','poses','boost','finish','props','effects']);
 const sheets=['poses','boost','finish'];
 const shots=[
  [0,615,744,1141,745,875,429,.93,0,1],
  [28,667,744,1141,745,902,429,.92,0,1],
  [48,759,744,1182,728,966,424,.89,-.013,2],
  [65,850,665,1221,704,1037,392,.85,.024,3],
  [82,1028,544,1271,675,1149,356,.81,-.021,4],
  [100,1344,461,1314,647,1328,326,.77,.019,5],
  [118,1424,446,1305,594,1366,320,.76,-.025,-6],
  [137,1280,543,1369,649,1324,350,.77,.017,7],
  [157,1314,705,1515,677,1419,405,.79,-.016,8],
  [182,1350,706,1589,729,1470,417,.76,0,9],
  [202,1350,706,1630,675,1490,407,.71,.023,10],
  [225,1350,706,1929,441,1623,364,.65,0,11],
  [259,1350,706,2227,238,1738,326,.61,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,7)));
  const finish=pulse(t,202,5,26);
  frameClip();
  ctx.fillStyle='#1f2d44';ctx.fillRect(0,0,W,H);
  art.image('court',-84-cx*.017,-92-(cy-410)*.30,W+244,H+184);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.48,finish));
  ctx.imageSmoothingEnabled=false;
  art.grid('props',0,2,2,1423,483,554,{alpha:pulse(t,110,37,32)});
  art.grid('props',0,2,2,1470,813,592,{alpha:ease((t-123)/27)});
  art.grid('props',1,2,2,x-114*Math.sign(signedPose),y+56,429,{alpha:Math.max(pulse(t,84,7,11),pulse(t,119,6,12))});
  art.grid('props',2,2,2,x+153,y-51,429,{anchorY:.6,alpha:pulse(t,186,22,19)});
  art.grid('props',3,2,2,mix(x,tx,.45),ty+63,557,{alpha:Math.max(pulse(t,137,6,23),finish)});
  target(opponent,tx,ty-hit*11,-.1-hit*.37-ease((t-203)/39)*1.44,2.60);
  art.grid(sheets[Math.floor(pose/4)],pose%4,2,2,x,y,475,{face:Math.sign(signedPose)});
  for(const [beat,kind,angle,dir] of [[48,0,.02,1],[65,1,.11,1],[82,2,.32,1],[100,1,.90,1],[118,2,-.78,-1],[137,1,.37,1],[157,0,-.17,1]]){
   art.strike(kind,tx-dir*29,ty-103,kind===1?497:451,323,pulse(t,beat,3,8),angle,dir);
  }
  art.strike(3,tx+250,ty-121,921,490,finish,-.07);
  ctx.restore();
  flash('207,244,255',Math.max(hit*.043,finish*.16));bands(t,'#1d293c');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,170+time*5,141+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

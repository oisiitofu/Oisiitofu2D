"use strict";

const LaharlLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=LaharlLimitProfile;
 const art=assets('laharl',['cutin','court','poses','ride','finish','props','effects']);
 const atlases=['poses','ride','finish'];
 const shots=[
  [0,525,752,1092,733,805,430,.92,0,1],
  [31,525,752,1092,733,805,430,.92,0,1],
  [52,848,750,1122,682,998,423,.90,-.025,2],
  [75,949,641,1172,540,1066,367,.86,-.022,3],
  [95,1094,485,1270,430,1190,325,.82,.014,2],
  [117,1200,301,1324,562,1262,347,.75,.021,4],
  [144,1396,329,1458,663,1413,411,.71,.049,5],
  [161,1462,359,1551,701,1502,431,.70,.04,6],
  [187,1594,438,1690,665,1632,430,.68,-.042,7],
  [206,1451,358,1758,691,1603,410,.68,-.025,-5],
  [229,1353,278,1815,680,1574,395,.64,.032,-6],
  [248,1415,253,1828,739,1612,405,.66,0,7],
  [270,1566,256,1857,708,1714,407,.69,.028,8],
  [291,1647,354,1883,725,1769,424,.68,-.041,9],
  [304,1672,491,1918,731,1791,457,.71,-.027,10],
  [324,1682,679,1966,736,1812,453,.72,.015,10],
  [334,1698,749,1994,710,1843,454,.67,-.032,11],
  [359,1698,749,2186,437,1922,388,.61,0,12],
  [392,1698,749,2345,185,1999,337,.58,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function meteors(t,x,y,tx,ty){
  const riding=(start,end)=>ease((t-start)/11)*(1-ease((t-end)/10));
  art.grid('props',0,2,2,x+43,y+128,481,{alpha:riding(126,164)});
  art.grid('props',1,2,2,x-46,y+119,522,{alpha:riding(193,232)});
  const fall=ease((t-253)/81);
  art.grid('props',1,2,2,mix(1588,tx,fall),mix(194,ty+51,fall),585+fall*178,
   {alpha:riding(244,333)});
  for(const [beat,dx,dy] of [[144,-76,53],[187,105,26],[229,-107,41],[304,145,60]]){
   const fall=ease((t-beat+7)/37);
   art.grid('props',2,2,2,tx+dx*(.7+fall),ty-185+dy+fall*209,486,{alpha:pulse(t,beat,7,33)});
  }
 }
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,334,4,25);
  frameClip();
  ctx.fillStyle='#231a32';ctx.fillRect(0,0,W,H);
  art.image('court',-82-cx*.017,-82-cy*.023,W+226,H+168);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.51,finish));
  meteors(t,x,y,tx,ty);
  art.glow(3,tx,ty-42,613,325,pulse(t,318,10,25)*.62);
  art.strike(3,tx+87,ty-106,1110,715,finish);
  target(opponent,tx,ty-hit*13,-.12-hit*.39-ease((t-335)/38)*1.51,2.75);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,478,{face:Math.sign(signedPose)});
  for(const [beat,kind,angle] of [[52,0,-1.02],[95,0,-1.22],[144,1,1.06],[187,2,.22],[229,1,1.17],[270,2,.66],[304,1,1.35]]){
   art.strike(kind,tx-24,ty-122,kind===1?526:409,324,pulse(t,beat,3,10),angle);
  }
  ctx.restore();
  flash('255,197,170',Math.max(hit*.06,finish*.18));bands(t,'#1e192a');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,172+time*5,143+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

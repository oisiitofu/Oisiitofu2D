"use strict";

const MaleniaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=MaleniaLimitProfile;
 const art=assets('malenia',['cutin','court','poses','dance','rot','props','effects']);
 const atlases=['poses','dance','rot'];
 const shots=[
  [0,565,748,1080,730,823,422,.96,0,1],
  [31,565,748,1080,730,823,422,.96,0,1],
  [61,844,748,1119,721,995,421,.88,-.018,1],
  [84,910,620,1200,692,1053,374,.87,.02,2],
  [101,961,459,1190,653,1080,328,.83,.016,3],
  [108,1068,443,1251,594,1160,325,.82,-.021,5],
  [129,1190,516,1439,637,1310,368,.83,-.025,6],
  [146,1394,526,1310,688,1341,379,.82,.031,-7],
  [164,1494,647,1256,711,1375,417,.84,.038,-7],
  [179,1317,710,1087,722,1216,426,.85,-.02,-8],
  [192,1057,739,903,723,999,425,.86,.012,-6],
  [209,1015,648,1231,700,1119,397,.82,.01,4],
  [229,1133,482,1332,681,1228,365,.79,-.036,9],
  [248,1261,458,1364,707,1301,339,.77,0,9],
  [268,1421,531,1339,708,1371,365,.78,.027,-10],
  [294,1348,660,1277,717,1322,410,.76,-.027,-10],
  [316,1265,749,1474,721,1356,425,.74,.014,11],
  [331,1265,749,1513,712,1389,422,.70,.02,11],
  [354,1265,749,1855,490,1519,387,.66,0,12],
  [376,1265,749,2144,302,1649,374,.63,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));

 function bloom(t,x,y){
  const opening=ease((t-321)/16);
  art.grid('props',0,2,2,x,y+40,660,{alpha:pulse(t,302,17,24)});
  art.grid('props',1,2,2,1294,795,572+opening*548,{alpha:pulse(t,334,11,33)});
  for(let i=0;i<4;i++){
   const drift=ease((t-319-i*5)/50);
   art.grid('props',2,2,2,1113+i*150+drift*108,545+i*24+drift*94,377-i*23,{alpha:pulse(t,337,11,33)*.72});
  }
  art.grid('props',3,2,2,1275,768,620,{alpha:pulse(t,318,4,16)});
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,4,9)));
  const finish=pulse(t,331,4,25);
  frameClip();
  ctx.fillStyle='#223739';ctx.fillRect(0,0,W,H);
  art.image('court',-89-cx*.019,-81-cy*.025,W+244,H+162);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.59,finish));
  bloom(t,x,y);
  art.glow(3,1273,659,601,458,pulse(t,229,8,17)*.6);
  art.strike(3,tx+38,ty-118,1080,716,finish);
  target(opponent,tx,ty-hit*12,-.13-hit*.35-ease((t-333)/34)*1.53,2.75);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,pose>=9?561:492,{face:Math.sign(signedPose)});
  for(const [beat,kind,angle,direction] of [[61,0,-.15,1],[108,0,.29,1],[129,1,.14,1],[164,1,-.19,-1],[192,1,.09,-1],[229,2,.11,1],[268,0,-.55,-1]]){
   art.strike(kind,tx-direction*29,ty-132,kind===1?500:389,kind===1?326:318,pulse(t,beat,3,10),angle,direction);
  }
  ctx.restore();
  flash('255,224,187',Math.max(hit*.06,finish*.17));bands(t,'#182b2e');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,175+time*5,145+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

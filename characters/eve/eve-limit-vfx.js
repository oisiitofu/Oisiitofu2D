"use strict";

const EveLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=EveLimitProfile;
 const art=assets('eve',['cutin','court','poses','tachy','finish','props','effects']);
 const atlases=['poses','tachy','finish'];
 const shots=[
  [0,527,749,1087,726,809,425,.93,0,1],
  [31,527,749,1087,726,809,425,.93,0,1],
  [52,852,749,1127,704,991,424,.90,.018,2],
  [69,896,748,1178,723,1042,429,.88,0,3],
  [78,935,748,1218,720,1079,429,.86,-.021,3],
  [86,1439,748,1218,680,1321,421,.83,.035,-3],
  [118,1381,748,1123,637,1256,410,.81,-.023,-4],
  [141,1422,644,1174,690,1301,412,.80,.021,-4],
  [157,1592,469,1254,709,1412,385,.76,.038,-5],
  [184,1579,476,1228,689,1402,375,.76,0,-5],
  [193,1543,459,1217,684,1376,367,.75,-.011,-5],
  [194,1538,457,1215,684,1372,366,.75,-.013,-6],
  [206,1478,432,1198,677,1328,355,.74,-.027,-6],
  [227,1282,518,1142,706,1209,391,.78,-.023,-7],
  [248,1098,655,1253,651,1181,404,.80,.032,8],
  [273,984,749,1343,722,1160,433,.81,0,9],
  [293,1036,749,1391,695,1218,426,.80,-.024,10],
  [316,1071,749,1423,726,1256,431,.77,0,10],
  [337,1144,749,1458,674,1304,417,.70,.023,10],
  [359,1144,749,1820,460,1427,384,.65,0,11],
  [394,1144,749,2125,238,1566,337,.61,0,1]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,337,4,25);
  const blink=pulse(t,82,3,6);
  frameClip();
  ctx.fillStyle='#27303f';ctx.fillRect(0,0,W,H);
  art.image('court',-84-cx*.017,-80-cy*.022,W+231,H+166);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.55,finish));
  art.grid('props',0,2,2,1620,642,686,{alpha:pulse(t,181,42,85)});
  art.grid('props',1,2,2,tx+ease((t-336)/32)*178,ty+40,562,{alpha:pulse(t,341,5,30)});
  art.grid('props',2,2,2,940,758,536,{alpha:blink});
  art.grid('props',2,2,2,1440,757,510,{alpha:pulse(t,86,4,16)});
  art.grid('props',3,2,2,x-57,y-72,412,{alpha:pulse(t,194,6,24)});
  art.glow(2,mix(x,tx,.55),ty-91,524,316,pulse(t,323,14,18)*.64);
  art.strike(3,tx+42,ty-108,1084,699,finish);
  for(const [beat,kind,angle,dir] of [[52,0,.05,1],[86,2,.09,-1],[118,1,-.24,-1],[157,2,-.47,-1],[206,0,.39,-1],[248,2,.45,1],[293,1,-.17,1]]){
   art.strike(kind,tx-dir*21,ty-113,kind===2?514:438,351,pulse(t,beat,3,9),angle,dir);
  }
  target(opponent,tx,ty-hit*11,-.1-hit*.37-ease((t-338)/39)*1.47,2.75);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,503,{face:Math.sign(signedPose),alpha:1-blink*.9});
  ctx.restore();
  flash('246,215,255',Math.max(hit*.055,finish*.17));bands(t,'#262638');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,171+time*5,142+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

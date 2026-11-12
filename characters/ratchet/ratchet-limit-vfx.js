"use strict";

const RatchetLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=RatchetLimitProfile;
 const art=assets('ratchet',['cutin','court','poses','motion','ryno','props','effects']);
 const atlas=['poses','motion','ryno'];
 const shots=[
  [0,537,753,1038,739,815,423,.97,0,1],
  [31,537,753,1038,739,815,423,.97,0,1],
  [62,863,748,1028,695,951,414,.91,-.018,2],
  [82,920,632,1067,579,991,351,.88,-.045,2],
  [97,1083,617,1287,550,1158,340,.88,-.04,3],
  [118,1249,749,1322,603,1201,419,.89,.015,3],
  [129,1364,751,1281,635,1251,408,.88,.02,3],
  [137,880,419,1170,677,1080,347,.77,-.068,5],
  [148,1073,488,1244,642,1146,371,.86,.041,6],
  [161,1336,614,1265,703,1220,399,.87,.027,-4],
  [174,1496,748,1299,731,1371,420,.90,.008,-7],
  [181,1532,746,1284,728,1385,422,.90,0,-8],
  [201,1569,748,1234,731,1401,417,.87,-.014,-9],
  [220,1518,753,1181,703,1347,408,.83,.009,-10],
  [245,1494,734,1189,720,1364,391,.82,-.023,-9],
  [265,1459,751,1185,718,1334,388,.79,0,-10],
  [290,1509,752,1145,732,1327,350,.71,-.013,-10],
  [313,1536,751,1145,732,1341,373,.74,.025,-11],
  [325,1549,753,1118,720,1334,420,.77,-.026,-11],
  [344,1543,753,736,489,1184,408,.70,0,-12],
  [374,1543,753,384,292,1015,390,.67,0,-12]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,8)));
  const finish=pulse(t,325,6,27);
  const pull=ease((t-255)/26)*(1-ease((t-311)/18));
  const fall=ease((t-292)/31);
  const intake=pulse(t,129,18,11),exit=pulse(t,136,13,15);
  const teleport=ease((t-122)/8)*(1-ease((t-136)/9));
  frameClip();
  ctx.fillStyle='#1c1633';ctx.fillRect(0,0,W,H);
  art.image('court',-91-cx*.018,-91-cy*.03,W+253,H+167);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.62,finish));
  art.grid('props',0,2,2,1350,762,333,{alpha:intake});
  art.grid('props',0,2,2,840,472,390,{alpha:exit,face:-1});
  art.grid('props',1,2,2,1117,128,913,{anchorY:.43,alpha:pull});
  art.glow(1,1110,140,1000,312,pull*.60);
  art.grid('props',1,2,2,tx-15,133,352,{anchorY:.46,alpha:pulse(t,199,12,23)});
  art.grid('props',2,2,2,tx-15,mix(133,ty-22,ease((t-197)/22)),286,{alpha:pulse(t,218,20,12)});
  art.grid('props',3,2,2,1116,mix(55,734,fall),805,{alpha:ease((t-281)/11)*(1-ease((t-326)/16))});
  art.glow(0,x-73,y-34,445,148,pulse(t,112,21,15)*.76);
  art.strike(3,1110,590,925,704,finish);
  target(opponent,tx,ty-hit*11,-.16-hit*.36-ease((t-326)/33)*1.52,2.73);
  art.grid(atlas[Math.floor(pose/4)],pose%4,2,2,x,y,491,{face:Math.sign(signedPose),alpha:1-teleport});
  for(const [i,beat] of [...profile.combo.keys()].entries()){
   const effect=i<3?0:i===4?2:1;
   const angle=i===0?-.94:i===1?.27:i===4?1.39:0;
   const fx=i===3||i===5?mix(x,tx,.24):tx-26;
   art.strike(effect,fx,ty-141,338+i*15,285+i*8,pulse(t,beat,3,10),angle);
  }
  ctx.restore();
  flash('255,207,152',Math.max(hit*.06,finish*.17));
  bands(t,'#17142a');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,177+time*5,147+time*4,1-time/profile.contactHold*.63,-.48*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

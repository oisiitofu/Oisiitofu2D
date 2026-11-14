'use strict';
const CojicojiLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=CojicojiLimitProfile;
 const art=assets('cojicoji',['cutin','court','poses','float','finish','props','effects']);
 const sheets=['poses','float','finish'];
 const shots=[
  [0,594,751,1114,750,854,426,.94,0,1],
  [28,674,751,1114,750,894,426,.93,0,2],
  [48,825,683,1170,728,997,402,.88,.021,3],
  [66,859,524,1213,692,1036,362,.83,-.024,4],
  [85,928,443,1257,637,1093,329,.79,.019,5],
  [105,1073,452,1308,607,1191,337,.78,-.019,6],
  [124,1258,356,1412,630,1335,312,.76,.023,7],
  [143,1514,411,1447,606,1480,323,.75,-.023,-8],
  [163,1572,499,1469,587,1520,361,.75,.021,-9],
  [181,1546,439,1475,617,1510,346,.74,0,-10],
  [210,1559,319,1548,590,1553,312,.68,.020,-10],
  [236,1474,546,1865,414,1632,353,.64,-.010,11],
  [268,1463,748,2235,227,1757,370,.61,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,7)));
  const finish=pulse(t,210,4,28);
  frameClip();ctx.fillStyle='#6d6089';ctx.fillRect(0,0,W,H);
  art.image('court',-86-cx*.021,-86-cy*.092,W+245,H+181);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.47,finish));
  art.grid('props',0,2,2,1110,499,646,{alpha:pulse(t,104,29,59)});
  art.grid('props',1,2,2,mix(x,tx,.46),ty-152,524,{alpha:pulse(t,149,32,55)});
  art.grid('props',2,2,2,1345,771,716,{alpha:ease((t-74)/48)*.48});
  art.grid('props',3,2,2,tx+91,ty+32,616,{alpha:finish});
  target(opponent,tx,ty-hit*11,-.1-hit*.36-ease((t-211)/40)*1.44,2.59);
  art.grid(sheets[Math.floor(pose/4)],pose%4,2,2,x,y,468,{face:Math.sign(signedPose)});
  for(const [beat,kind,angle,dir] of [[48,0,.14,1],[66,1,-.09,1],[85,0,.04,1],[105,1,.16,1],[124,2,.38,1],[143,0,-.07,-1],[163,2,-.29,-1]]){
   art.strike(kind,tx-dir*29,ty-102,kind===2?501:439,320,pulse(t,beat,3,8),angle,dir);
  }
  art.glow(2,tx-53,ty-218,666,511,pulse(t,199,11,15)*.59,1.25);
  art.strike(3,tx+92,ty-81,992,633,finish,.04);
  ctx.restore();flash('254,233,188',Math.max(hit*.042,finish*.16));bands(t,'#493b57');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,169+time*5,141+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

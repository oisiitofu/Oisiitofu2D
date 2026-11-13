"use strict";

const LaytonLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=LaytonLimitProfile;
 const art=assets('layton',['cutin','court','poses','stairs','finish','props','effects']);
 const atlases=['poses','stairs','finish'];
 const shots=[
  [0,511,750,1015,732,770,427,.96,0,1],
  [30,511,750,1015,732,770,427,.96,0,1],
  [54,798,750,1087,712,950,421,.88,.018,2],
  [77,885,750,1175,741,1031,420,.88,0,3],
  [93,967,742,1185,608,1043,402,.86,-.016,4],
  [110,891,697,1220,662,1034,394,.84,-.022,-5],
  [132,802,645,1237,460,1004,354,.80,-.031,-6],
  [152,707,592,1319,642,981,372,.76,.016,-7],
  [167,627,542,1383,536,994,348,.75,.028,-8],
  [190,547,509,1236,733,918,373,.72,0,9],
  [218,546,509,1182,585,890,362,.72,-.019,10],
  [240,552,509,1146,698,888,375,.71,0,10],
  [274,575,509,1203,637,900,369,.70,.019,11],
  [300,580,509,1240,711,924,376,.73,0,11],
  [328,580,509,1311,631,960,363,.68,-.018,12],
  [352,580,509,1711,475,1060,363,.64,0,1],
  [378,580,509,2040,281,1171,359,.61,0,1]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,10)));
  const finish=pulse(t,328,5,23);
  frameClip();
  ctx.fillStyle='#272731';ctx.fillRect(0,0,W,H);
  art.image('court',-89-cx*.018,-84-cy*.021,W+239,H+171);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.51,finish));
  art.grid('props',0,2,2,731,763,534);
  art.grid('props',1,2,2,694,517,259,{alpha:ease((t-144)/19)});
  art.grid('props',2,2,2,1231,756,720,{alpha:pulse(t,101,23,51)});
  art.grid('props',3,2,2,1320,760,890,{alpha:pulse(t,185,29,54)});
  art.glow(2,589,378,435,280,pulse(t,306,18,28)*.67);
  art.strike(3,tx,ty-131,1057,721,finish,.17);
  target(opponent,tx,ty-hit*10,-.08-hit*.42-ease((t-329)/32)*1.35,2.76);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,515,{face:Math.sign(signedPose)});
  for(const [beat,kind,angle] of [[54,0,0],[93,1,-1.57],[132,1,-1.57],[167,2,.38],[218,2,-.22],[274,1,-.95]]){
   art.strike(kind,tx,ty-114,kind===2?519:391,357,pulse(t,beat,3,10),angle);
  }
  ctx.restore();
  flash('255,226,159',Math.max(hit*.054,finish*.14));bands(t,'#252431');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,169+time*5,138+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

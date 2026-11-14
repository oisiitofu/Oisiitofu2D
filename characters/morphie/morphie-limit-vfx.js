'use strict';

const MorphieLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=MorphieLimitProfile;
 const art=assets('morphie',['cutin','court','poses','mass','finish','props','effects']);
 const sheets=['poses','mass','finish'];
 const shots=[
  [0,690,750,1114,747,901,425,.94,0,1],
  [28,690,750,1114,747,901,425,.94,0,2],
  [51,611,750,1167,728,889,420,.90,.018,2],
  [68,540,669,1213,713,879,389,.84,-.024,3],
  [85,676,637,1191,694,936,380,.82,.018,4],
  [104,793,452,1195,654,994,342,.79,-.027,5],
  [123,1023,330,1248,638,1135,305,.76,.029,6],
  [142,1358,747,1298,680,1328,414,.80,-.031,-7],
  [162,1458,748,1254,692,1356,413,.80,.025,-8],
  [182,1514,747,1184,735,1351,426,.77,0,-9],
  [197,1514,747,1188,741,1351,428,.74,-.014,-10],
  [211,1514,747,1089,666,1298,405,.70,.024,-11],
  [235,1514,747,742,456,1215,360,.64,0,-12],
  [271,1514,747,507,290,1133,330,.60,0,-12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,7)));
  const finish=pulse(t,211,5,24);
  frameClip();
  ctx.fillStyle='#35364e';ctx.fillRect(0,0,W,H);
  art.image('court',-86-cx*.020,-88-cy*.07,W+246,H+177);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.47,finish));
  art.grid('props',0,2,2,mix(x,tx,.42),mix(y,ty,.40)+20,551,{alpha:pulse(t,81,30,53)});
  art.grid('props',2,2,2,x+25,y+38,566,{alpha:pulse(t,190,18,23)});
  art.grid('props',1,2,2,tx+177,ty-48,1000,{alpha:pulse(t,210,13,23),face:-1});
  art.grid('props',3,2,2,tx-39,ty+49,598,{alpha:Math.max(pulse(t,142,3,13),finish)});
  target(opponent,tx,ty-hit*11,-.1-hit*.38+ease((t-212)/37)*1.43,2.61);
  art.grid(sheets[Math.floor(pose/4)],pose%4,2,2,x,y,497,{face:Math.sign(signedPose)});
  for(const [beat,kind,angle,dir] of [[51,0,0,1],[68,0,.10,1],[85,1,-.05,1],[104,1,.53,1],[123,0,.65,1],[142,2,.21,-1],[162,2,-.20,-1]]){
   art.strike(kind,tx-dir*31,ty-112,kind===0?509:461,325,pulse(t,beat,3,8),angle,dir);
  }
  art.strike(3,tx-69,ty-101,1108,720,finish,-.13,-1);
  ctx.restore();
  flash('248,227,177',Math.max(hit*.045,finish*.16));bands(t,'#2d2940');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,170+time*5,142+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

"use strict";

const SakuraLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=SakuraLimitProfile;
 const art=assets('sakura',['cutin','court','poses','motion','koubu','koubu-finish','effects']);
 const shots=[
  [0,566,745,1050,735,813,420,.97,0,1],
  [30,566,745,1050,735,813,420,.97,0,1],
  [49,645,745,1048,735,839,415,.99,0,1],
  [61,780,745,1055,703,911,399,.97,.012,2],
  [78,789,745,1065,672,923,387,.94,-.009,2],
  [92,831,745,1079,689,960,414,.94,.013,5],
  [108,778,746,1080,725,929,420,.96,0,6],
  [124,650,620,1087,735,865,374,.92,-.012,3],
  [139,492,543,1090,735,777,374,.88,0,4],
  [150,448,505,1092,735,766,363,.89,-.009,7],
  [160,464,528,1092,735,764,375,.88,0,8],
  [173,464,575,1092,735,770,411,.88,0,8],
  [193,562,746,1094,731,830,412,.89,-.01,8],
  [217,852,546,1112,662,982,330,.82,-.017,8],
  [230,984,452,1137,595,1030,295,.78,.012,8],
  [247,1174,539,1290,641,1170,342,.78,.016,8],
  [262,1259,660,1370,705,1262,391,.80,0,8],
  [277,1290,745,1442,722,1301,426,.81,-.012,8],
  [292,1284,745,1482,725,1310,425,.84,0,8],
  [310,1259,745,1495,720,1348,413,.83,-.009,8],
  [320,1302,745,1522,681,1378,401,.81,.017,8],
  [337,1305,745,1763,526,1445,394,.77,0,8],
  [369,1295,745,2050,294,1560,394,.74,0,8]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function drawKoubu(t,x,y){
  if(t<130)return;
  if(t<176){
   const progress=ease((t-130)/33);
   const machineY=mix(1010,746,progress);
   ctx.save();
   ctx.beginPath();ctx.rect(130,-320,690,1073);ctx.clip();
   art.grid('koubu',0,2,2,462,machineY,558,{alpha:ease((t-129)/11)});
   ctx.restore();
   return;
  }
  const [atlas,pose]=t<204?['koubu',1]:t<235?['koubu',2]:t<269?['koubu',3]:
   t<290?['koubu-finish',0]:t<317?['koubu-finish',1]:t<343?['koubu-finish',2]:['koubu-finish',3];
  art.grid(atlas,pose,2,2,x,t<193?746:y,602);
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const rise=pulse(t,61,4,11),reverse=pulse(t,92,4,12);
  const leap=pulse(t,217,5,12),drop=pulse(t,247,4,12),landing=pulse(t,277,5,15);
  const finish=pulse(t,320,6,26);
  const hit=Math.max(rise,reverse,leap,drop,landing);
  frameClip();
  ctx.fillStyle='#251019';ctx.fillRect(0,0,W,H);
  art.image('court',-76-cx*.026,-60-cy*.037,W+228,H+119);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.59,finish));

  const trap=ease((t-119)/20)*(1-ease((t-185)/14));
  if(trap>0){
   ctx.save();ctx.globalAlpha=trap;
   ctx.fillStyle='#170d16';
   ctx.beginPath();ctx.ellipse(460,747,238,52,0,0,Math.PI*2);ctx.fill();
   ctx.lineWidth=10;ctx.strokeStyle='#7d4435';ctx.stroke();
   ctx.restore();
  }
  art.strike(3,x+586,y-245,798,575,finish);
  target(opponent,tx,ty-hit*10,-.11-hit*.24-ease((t-321)/36)*1.45,2.86);
  if(t>=130)drawKoubu(t,x,y);
  if(t<176){
   const aboard=ease((t-155)/19);
   const alpha=1-aboard;
   const drawY=y+aboard*59;
   art.grid(pose<=4?'poses':'motion',(pose-1)%4,2,2,x,drawY,454,{alpha});
  }
  art.glow(2,456,722,535,430,pulse(t,145,20,33)*.54);
  art.glow(2,x-122,y-15,390,315,pulse(t,193,9,17)*.67);
  art.strike(0,tx-73,ty-231,525,434,rise,-.43);
  art.strike(0,tx-77,ty-189,492,411,reverse,.36);
  art.strike(0,tx-96,ty-257,484,404,leap,-.88);
  art.strike(1,tx-26,ty-224,444,579,drop,-.14);
  art.strike(2,x+136,y-21,610,391,landing);
  art.glow(0,x+120,y-224,422,356,pulse(t,309,16,15)*.43);
  art.strike(0,tx-35,ty-173,241,223,pulse(t,320,2,7),-.12);
  ctx.restore();
  flash('255,213,230',Math.max(hit*.074,finish*.17));
  bands(t,'#1a0c15');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,180+time*6,148+time*5,1-time/profile.contactHold*.62,-.25*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

"use strict";

const YumaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=YumaLimitProfile;
 const art=assets('yuma',['cutin','court','poses','motion','solution','shinigami','props','hazards','effects']);
 const atlas=['poses','motion','solution'];
 const shots=[
  [0,555,749,1068,730,826,420,.97,0,1],
  [31,555,749,1068,730,826,420,.97,0,1],
  [59,807,746,1114,706,984,420,.90,.024,1],
  [81,854,747,1131,717,1022,419,.92,-.026,2],
  [105,941,742,1193,690,1065,421,.89,.023,2],
  [125,961,581,1252,652,1108,361,.87,-.023,3],
  [146,1042,443,1297,622,1191,338,.84,-.052,4],
  [166,1133,437,1355,660,1248,352,.85,.016,5],
  [191,1271,586,1443,688,1349,400,.86,.049,6],
  [213,1282,744,1501,718,1391,423,.86,.014,7],
  [234,1276,751,1489,691,1390,426,.84,-.021,8],
  [255,1191,750,1547,702,1409,406,.79,-.025,9],
  [277,1129,749,1560,703,1401,414,.77,.022,10],
  [304,1189,715,1576,715,1418,408,.75,.016,10],
  [331,1339,723,1599,684,1454,416,.75,-.023,11],
  [352,1339,747,1828,460,1534,395,.70,0,12],
  [376,1339,747,2109,316,1632,386,.67,0,12]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function statement(index,label,x,y,alpha,face){
  art.grid('props',index,2,2,x,y,404,{anchorY:.52,alpha});
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;
  ctx.font='bold 31px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.strokeStyle='#201335';ctx.lineWidth=5;ctx.strokeText(label,0,-1);
  ctx.fillStyle='#f9efff';ctx.fillText(label,0,-1);ctx.restore();
 }

 function argumentsAndKey(t,x,y,tx,ty,face){
  const glide=ease((t-42)/19);
  const returnShot=ease((t-102)/20);
  const pinkX=mix(1360,701,glide);
  const blueX=mix(mix(1539,1085,ease((t-70)/35)),tx,returnShot);
  statement(0,'関係ない',pinkX,513,pulse(t,61,22,19),face);
  statement(1,'見ていない',blueX,mix(527,ty-132,returnShot),pulse(t,104,33,24),face);
  const slot=ease((t-134)/12);
  art.grid('props',2,2,2,x+mix(162,84,slot),y-mix(282,188,slot),170,{anchorY:.53,alpha:pulse(t,144,10,14)});
 }

 function wallAndPartner(t,tx,ty){
  const entrance=ease((t-220)/22)*(1-ease((t-352)/21));
  const step=ease((t-234)/72);
  const pose=t<248?0:t<273?1:t<291?2:t<313?1:3;
  art.grid('shinigami',pose,2,2,mix(949,1232,step),745,1048,{alpha:entrance});
  const wall=ease((t-248)/12)*(1-ease((t-326)/10));
  art.grid('hazards',0,2,2,1623,760,611,{alpha:wall});
  const collapse=ease((t-327)/21);
  const debris=ease((t-327)/6)*(1-ease((t-345)/16));
  art.grid('hazards',2,2,2,1630+collapse*279,735-collapse*158,571,{alpha:debris});
  const kick=ease((t-273)/10),approach=ease((t-257)/16);
  const ballX=mix(mix(1452,1370,approach),tx-36,kick);
  const ballY=mix(546,ty-126,kick)-Math.sin(Math.PI*kick)*62;
  art.grid('hazards',1,2,2,ballX,ballY,309,{
   anchorY:.5,alpha:pulse(t,277,20,13)
  });
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,331,5,25);
  frameClip();
  ctx.fillStyle='#201835';ctx.fillRect(0,0,W,H);
  art.image('court',-89-cx*.022,-81-cy*.026,W+243,H+161);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.59,finish));
  wallAndPartner(t,tx,ty);
  argumentsAndKey(t,x,y,tx,ty,face);
  art.glow(1,x+109,y-180,366,299,pulse(t,146,8,15)*.59);
  art.strike(3,tx+36,ty-125,988,691,finish);
  target(opponent,tx,ty-hit*11,-.13-hit*.35-ease((t-332)/35)*1.49,2.76);
  art.grid(atlas[Math.floor(pose/4)],pose%4,2,2,x,y,442,{face:Math.sign(signedPose)});
  for(const [i,beat] of [...profile.combo.keys()].entries()){
   const kind=i<2?0:i===2?1:i<5?2:3;
   art.strike(kind,tx-19,ty-126,330+i*13,259+i*9,pulse(t,beat,3,10),i===3?.58:i===4?-.25:0);
  }
  ctx.restore();
  flash('234,224,252',Math.max(hit*.059,finish*.17));
  bands(t,'#18132b');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(2,x,y,176+time*5,149+time*4,1-time/profile.contactHold*.63,-.08*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

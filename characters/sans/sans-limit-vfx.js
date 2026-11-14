"use strict";

const SansLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=SansLimitProfile;
 const art=assets('sans',['cutin','court','poses','gravity','finish','props','effects']);
 const sheets=['poses','gravity','finish'];
 const shots=[
  [0,570,748,1120,730,844,426,.94,0,1],
  [30,570,748,1120,730,844,426,.94,0,1],
  [56,713,748,1147,675,928,392,.88,-.027,2],
  [78,762,748,1165,316,962,376,.80,-.042,2],
  [96,820,748,1197,274,1017,353,.76,0,3],
  [135,992,748,1297,696,1149,420,.83,.027,4],
  [154,1139,732,1451,650,1292,400,.78,.06,5],
  [173,1274,605,1575,576,1423,369,.75,.15,6],
  [196,1356,529,1691,487,1524,339,.72,.13,7],
  [222,1308,512,1706,575,1508,350,.71,.07,7],
  [245,1203,561,1701,669,1452,388,.71,.04,8],
  [265,1138,679,1692,692,1417,411,.72,0,8],
  [302,1092,748,1693,693,1408,421,.69,-.026,9],
  [348,1092,748,1761,632,1448,413,.66,.023,10],
  [375,1092,748,2031,402,1530,387,.63,0,11],
  [410,1092,748,2279,255,1636,358,.61,0,12]
 ];
 const blasters=[[222,1980,375,2.62],[265,1372,432,.51],[302,1396,758,-.38]];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,348,5,29);
  frameClip();
  ctx.fillStyle='#13172b';ctx.fillRect(0,0,W,H);
  art.image('court',-86-cx*.018,-79-cy*.06,W+233,H+173);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.52,finish));
  ctx.save();ctx.globalAlpha=ease((t-30)/17)*.8;ctx.strokeStyle='#f0f5ff';ctx.lineWidth=4;ctx.strokeRect(674,186,1224,583);ctx.restore();
  for(const [beat,bx,by] of [[96,1190,329],[135,1271,767],[173,1775,716]]){
   art.grid('props',beat===173?0:1,2,2,bx,by,514,{alpha:pulse(t,beat,13,24)});
  }
  const inverted=ease((t-56)/25)*(1-ease((t-103)/24));
  target(opponent,tx,ty-hit*12,-.1+Math.PI*inverted-hit*.32-ease((t-349)/38)*1.42,2.55);
  art.grid(sheets[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,467);
  for(const [beat,kind,angle] of [[56,0,-.4],[96,1,.07],[135,1,-.12],[173,0,.34]]){
   art.strike(kind,tx-28,ty-104,kind===1?563:435,324,pulse(t,beat,4,10),angle);
  }
  for(const [beat,bx,by,angle] of blasters){
   const firing=pulse(t,beat,3,16),linger=pulse(t,beat,23,74)*.92;
   ctx.save();ctx.translate(bx,by-112);ctx.rotate(angle);
   art.grid('props',firing>.12?3:2,2,2,0,0,415,{anchorY:.5,alpha:Math.max(linger,finish*.73)});
   ctx.restore();
   art.strike(2,(bx+tx)/2,((by-112)+(ty-95))/2,680,303,firing,angle);
  }
  art.glow(2,tx-54,ty-153,803,468,pulse(t,338,12,16)*.54);
  art.strike(3,tx-34,ty-100,1182,725,finish,-.15);
  ctx.restore();
  flash('211,242,255',Math.max(hit*.05,finish*.16));bands(t,'#171729');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,170+time*5,142+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

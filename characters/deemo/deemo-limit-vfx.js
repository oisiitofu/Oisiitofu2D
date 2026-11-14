"use strict";

const DeemoLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=DeemoLimitProfile;
 const art=assets('deemo',['cutin','court','poses','branches','finish','props','effects']);
 const sheets=['poses','branches','finish'];
 const shots=[
  [0,632,758,1114,747,871,427,.94,0,1],
  [30,632,758,1114,747,871,427,.94,0,1],
  [52,829,747,1144,703,987,412,.91,-.018,2],
  [81,829,747,1219,671,1024,397,.88,.014,3],
  [115,829,747,1256,606,1043,370,.85,-.017,4],
  [149,829,747,1307,519,1068,350,.82,.014,3],
  [184,871,744,1422,456,1143,328,.77,-.021,5],
  [207,1005,657,1439,459,1217,305,.76,0,6],
  [231,1104,593,1490,444,1298,287,.74,.025,6],
  [252,1208,527,1528,387,1375,275,.73,-.022,7],
  [294,1307,433,1562,368,1452,251,.72,.018,8],
  [317,1364,403,1632,366,1510,240,.69,-.013,9],
  [344,1438,403,1742,313,1607,247,.66,.023,10],
  [372,1438,403,1975,196,1688,215,.62,0,11],
  [410,1438,403,2266,43,1804,201,.59,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,344,5,34);
  frameClip();
  ctx.fillStyle='#2b292c';ctx.fillRect(0,0,W,H);
  art.image('court',-84-cx*.023,-92-cy*.09,W+242,H+183);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.47,finish));
  art.grid('props',0,2,2,1040,772,555,{alpha:ease((t-28)/15)});
  art.grid('props',2,2,2,1164,773,664,{alpha:ease((t-63)/32)});
  art.grid('props',1,2,2,1360,562,640,{alpha:ease((t-125)/42)*.88});
  art.grid('props',3,2,2,1625,366,690,{alpha:ease((t-232)/68)*.84});
  target(opponent,tx,ty-hit*11,-.1-hit*.37-ease((t-345)/41)*1.43,2.61);
  art.grid(sheets[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,520);
  for(const [beat,kind,angle] of [[52,0,.03],[81,0,-.12],[115,1,-.12],[149,1,-.25],[184,2,-.17],[252,1,-.39],[294,2,-.15]]){
   art.strike(kind,tx-34,ty-111,kind===2?622:450,360,pulse(t,beat,4,12),angle);
  }
  art.glow(2,x+135,y-210,780,512,pulse(t,328,22,26)*.49,-.12);
  art.strike(3,tx+51,ty-99,1250,765,finish);
  ctx.restore();
  flash('255,226,163',Math.max(hit*.043,finish*.15));bands(t,'#26202c');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,170+time*5,140+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

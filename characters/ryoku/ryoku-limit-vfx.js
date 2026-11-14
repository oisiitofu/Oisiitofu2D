'use strict';
const RyokuLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=RyokuLimitProfile;
 const art=assets('ryoku',['cutin','court','poses','tea','finish','props','effects']);
 const sheets=['poses','tea','finish'];
 const shots=[
  [0,578,753,1113,750,847,426,.94,0,1],
  [28,644,753,1113,750,882,426,.94,0,1],
  [48,805,753,1149,727,978,417,.89,.018,2],
  [65,871,749,1191,705,1031,413,.85,-.019,3],
  [83,906,628,1228,690,1072,387,.83,.021,4],
  [101,1013,584,1293,650,1152,361,.82,-.023,5],
  [120,1107,694,1341,678,1224,402,.81,.018,6],
  [140,1237,595,1404,657,1319,363,.78,-.022,7],
  [159,1308,706,1463,691,1383,405,.79,.015,8],
  [182,1364,681,1516,724,1440,409,.75,0,9],
  [204,1430,742,1582,704,1506,415,.70,-.021,10],
  [227,1430,745,1859,485,1598,363,.66,0,11],
  [263,1430,745,2192,241,1764,328,.61,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,7)));
  const finish=pulse(t,204,4,28);
  frameClip();ctx.fillStyle='#536b62';ctx.fillRect(0,0,W,H);
  art.image('court',-83-cx*.018,-88-cy*.063,W+240,H+172);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.47,finish));
  art.grid('props',0,2,2,mix(888,1192,ease((t-49)/95)),793,449,{alpha:pulse(t,77,34,87)});
  art.grid('props',1,2,2,916,807,514,{alpha:pulse(t,96,40,76)});
  art.grid('props',3,2,2,1365,781,645,{alpha:ease((t-81)/25)});
  art.grid('props',2,2,2,1781,801,481,{alpha:ease((t-128)/35)});
  target(opponent,tx,ty-hit*10,-.1-hit*.36-ease((t-205)/39)*1.42,2.61);
  art.grid(sheets[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,458);
  for(const [beat,kind,angle] of [[48,0,.07],[65,1,-.08],[83,0,.09],[101,2,-.12],[120,1,.16],[140,0,-.15],[159,2,.09]]){
   art.strike(kind,tx-31,ty-102,kind===2?507:423,324,pulse(t,beat,3,8),angle);
  }
  art.strike(3,tx+137,ty-105,978,655,finish,.05);
  ctx.restore();flash('226,255,189',Math.max(hit*.044,finish*.16));bands(t,'#354c48');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,170+time*5,141+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

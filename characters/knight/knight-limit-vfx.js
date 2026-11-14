'use strict';
const KnightLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=KnightLimitProfile;
 const art=assets('knight',['cutin','court','poses','pogo','finish','props','effects']);
 const sheets=['poses','pogo','finish'];
 const shots=[
  [0,611,749,1124,749,869,425,.94,0,1],
  [29,683,749,1124,749,887,425,.94,0,2],
  [48,931,591,1180,721,1065,379,.83,-.018,3],
  [65,1167,566,1180,711,1172,368,.80,.032,4],
  [74,1167,393,1215,718,1192,308,.76,0,6],
  [83,1236,582,1238,731,1237,368,.79,-.026,5],
  [101,1412,364,1281,690,1348,300,.73,.027,-7],
  [121,1264,476,1244,676,1254,331,.77,-.03,-8],
  [141,1046,745,1267,732,1157,423,.81,.022,9],
  [162,1046,747,1393,665,1225,410,.77,-.018,10],
  [184,1095,747,1440,694,1273,421,.74,0,10],
  [211,1131,747,1518,603,1321,393,.69,.026,11],
  [236,1131,747,1842,302,1433,327,.63,0,12],
  [267,1131,747,2111,133,1518,295,.60,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,8)));
  const finish=pulse(t,211,4,28);
  frameClip();
  ctx.fillStyle='#1f263e';ctx.fillRect(0,0,W,H);
  art.image('court',-84-cx*.018,-86-cy*.059,W+247,H+179);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.49,finish));
  art.grid('props',0,2,2,1435,694,715,{alpha:pulse(t,100,34,42)*.75});
  art.grid('props',1,2,2,x+51,y+53,477,{alpha:Math.max(pulse(t,83,4,13),pulse(t,142,4,18))});
  art.grid('props',2,2,2,mix(x,tx,.68),ty+42,680,{alpha:pulse(t,176,28,38)});
  art.grid('props',3,2,2,tx+107,ty-121,553,{alpha:pulse(t,206,14,29)});
  target(opponent,tx,ty-hit*11,-.1-hit*.37-ease((t-212)/39)*1.43,2.59);
  art.grid(sheets[Math.floor(pose/4)],pose%4,2,2,x,y,483,{face:Math.sign(signedPose)});
  for(const [beat,kind,angle,dir] of [[48,0,.04,1],[65,1,0,1],[83,1,.10,1],[101,0,.19,-1],[121,1,-.08,-1],[141,2,.04,1],[162,2,-.19,1]]){
   art.strike(kind,tx-dir*32,ty-99,kind===1?408:532,kind===1?448:346,pulse(t,beat,4,8),angle,dir);
  }
  art.strike(3,tx+8,ty-203,1022,805,finish,-.08);
  ctx.restore();
  flash('213,230,255',Math.max(hit*.048,finish*.16));bands(t,'#191c33');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,171+time*5,141+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

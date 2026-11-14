"use strict";

const UlgrimLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=UlgrimLimitProfile;
 const art=assets('ulgrim',['cutin','court','poses','rift','finish','props','effects']);
 const atlases=['poses','rift','finish'];
 const shots=[
  [0,527,751,1087,729,809,425,.93,0,1],
  [31,527,751,1087,729,809,425,.93,0,1],
  [52,870,751,1124,706,997,424,.90,.016,2],
  [70,904,752,1194,725,1051,431,.88,0,1],
  [87,962,750,1267,681,1116,410,.86,-.027,4],
  [104,868,749,1307,714,1092,423,.84,.018,3],
  [128,768,750,1324,675,1046,411,.81,0,5],
  [148,727,750,1352,715,1037,416,.78,-.017,5],
  [173,1631,459,1374,667,1492,394,.75,.038,-6],
  [190,1590,503,1391,706,1492,413,.76,.023,-7],
  [212,1503,555,1299,663,1407,401,.77,-.026,-7],
  [234,1439,656,1210,714,1335,417,.81,0,-8],
  [249,1391,749,1155,701,1266,433,.83,.019,-2],
  [271,1377,749,1103,722,1247,430,.81,0,-9],
  [285,1334,749,1043,681,1192,421,.79,-.022,-10],
  [311,1310,749,1030,720,1180,429,.79,0,-10],
  [337,1264,750,937,674,1102,420,.71,.029,-11],
  [359,1264,750,601,490,952,385,.65,0,-12],
  [394,1264,750,307,246,836,340,.60,0,-12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,337,4,24);
  const crossing=ease((t-152)/10)*(1-ease((t-174)/10));
  frameClip();
  ctx.fillStyle='#29243c';ctx.fillRect(0,0,W,H);
  art.image('court',-86-cx*.017,-82-cy*.022,W+230,H+167);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.54,finish));
  art.grid('props',0,2,2,1555,696,694,{alpha:ease((t-132)/43)});
  art.grid('props',1,2,2,742,762,588,{alpha:pulse(t,149,32,30)});
  art.grid('props',1,2,2,1642,540,580,{alpha:pulse(t,173,21,42),face:-1});
  art.grid('props',1,2,2,tx-56,ty+41,610,{alpha:pulse(t,327,31,26)});
  art.grid('props',2,2,2,tx-ease((t-333)/29)*192,ty+66,548,{alpha:pulse(t,340,5,31)});
  art.glow(1,x,y-156,506,302,crossing*.75,0,Math.sign(signedPose));
  art.strike(3,tx-38,ty-117,1085,704,finish,-.07,-1);
  for(const [beat,kind,angle,dir] of [[52,0,.05,1],[87,2,-.42,1],[128,1,-.09,1],[173,1,.29,-1],[212,2,.33,-1],[249,0,-.03,-1],[285,2,-.18,-1]]){
   art.strike(kind,tx-20*dir,ty-115,kind===2?501:431,350,pulse(t,beat,3,9),angle,dir);
  }
  target(opponent,tx,ty-hit*11,.1+hit*.36+ease((t-338)/39)*1.48,2.75);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,508,{face:Math.sign(signedPose),alpha:1-crossing*.95});
  ctx.restore();
  flash('220,209,255',Math.max(hit*.054,finish*.16));bands(t,'#29243c');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,173+time*5,143+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

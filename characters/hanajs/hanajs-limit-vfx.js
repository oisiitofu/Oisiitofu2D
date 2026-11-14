'use strict';

const HanaLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('hanajs',['cutin','effects']);
 const portraits=HanaKit.forms.slice(1).map(id=>assets(id,['cutin']));
 const load=()=>Promise.all([art.load(),...portraits.map(portrait=>portrait.load())]);
 const shots=[
  [0,443,672,1094,670,769,430,.94,0,0],[34,708,672,1094,670,901,432,.97,0,12],
  [46,891,664,1101,659,996,429,1,.017,6],[64,962,632,1171,619,1066,407,.96,-.018,9],
  [83,1055,490,1243,564,1149,362,.9,.023,45],[103,1434,347,1274,545,1354,309,.85,-.024,-15],
  [123,1397,483,1214,551,1305,366,.89,.021,-13],[143,1013,557,1158,606,1085,391,.93,-.019,9],
  [167,864,637,1213,643,1039,423,.87,0,46],[197,1015,411,1267,583,1141,337,.85,-.02,43],
  [211,1147,517,1345,613,1241,378,.96,.023,45],[246,1151,672,1840,335,1441,402,.75,0,0]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function draw({attacker,target:opponent,face,time}){
  const t=HanaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...HanaLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,211,5,25),shift=Math.max(pulse(t,72,4,9),pulse(t,111,4,9),pulse(t,243,4,7));
  const startJob=HanaKit.index(attacker);
  const middleJob=startJob===1?0:1;
  const job=t<72||t>=243?startJob:t<111?middleJob:2;
  const id=HanaKit.forms[job];
  frameClip();
  const sky=ctx.createRadialGradient(W*.51,H*.36,25,W*.51,H*.36,W*.79);
  sky.addColorStop(0,'#6d4267');sky.addColorStop(.56,'#372e56');sky.addColorStop(1,'#171d33');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.57,finish));
  ctx.fillStyle='#34334a';ctx.fillRect(-1900,675,6300,620);
  for(let i=-8;i<16;i++){
   ctx.strokeStyle='#817397';ctx.lineWidth=3;ctx.strokeRect(i*238,675,220,42);
   ctx.fillStyle='#b18ba6';ctx.fillRect(i*238+24,681,38,4);
  }
  const sign=pose<0?-1:1,index=Math.abs(pose);
  art.glow(3,x,y-141,541,534,shift*.92);
  const thrust=Math.max(pulse(t,83,9,13),pulse(t,103,7,11),pulse(t,202,12,11));
  art.strike(2,x-sign*119,y-70,338,155,thrust*.81,.46,sign);
  const sprite={...attacker,characterId:id,character:CharacterData[id],x,y,
   face:sign*(HanaKit.flip({characterId:id},index)?-1:1),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,index,3.13);
  target(opponent,tx,ty-impact*13,-.1-impact*.37-ease((t-212)/27)*1.34,2.54);
  for(const [i,h] of hits.entries())art.strike([0,0,1,2,0,0][i],tx-12,ty-114,399+i*15,323,pulse(t,h,4,9),[-.28,.48,-.76,.29,.58,-.19][i]);
  art.strike(3,mix(x,tx,.64),mix(y-108,ty-111,.66),525+ease((t-211)/16)*566,459,finish,.31);
  art.strike(0,tx+104,ty-122,782,323,pulse(t,214,3,14),-.46);
  ctx.save();ctx.globalAlpha=pulse(t,213,4,16)*.67;ctx.strokeStyle='#ffe8f7';ctx.lineWidth=5;
  for(let i=0;i<5;i++){
   const start=65+i*31,reach=125+ease((t-210)/20)*(456+i*52);
   ctx.beginPath();ctx.moveTo(tx+start,ty-66+i*14);ctx.lineTo(tx+reach,ty-216+i*47);ctx.stroke();
  }
  ctx.restore();
  ctx.restore();flash('255,185,228',Math.max(impact*.12,shift*.19,finish*.22));bands(t,'#231d38');
  (startJob===0?art:portraits[startJob-1]).portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,168+time*4,146,1-time/23);}
 return {load,get prepared(){return art.prepared&&portraits.every(portrait=>portrait.prepared);},draw,drawContact};
})();

'use strict';

const HachiwareLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('hachiware',['cutin','effects','court','finish'],{revision:3});
 const shots=[
  [0,467,671,1048,672,755,433,.93,0,0],[37,699,671,1048,672,856,435,.96,-.01,8],
  [48,844,671,1054,661,954,435,1,.015,16],[65,900,671,1110,649,997,424,.97,-.023,31],
  [83,983,491,1147,580,1065,359,.91,.021,37],[103,1103,567,1124,623,1121,405,.95,-.022,19],
  [121,932,671,1173,662,1056,447,.97,.008,40],[142,972,671,1208,649,1090,429,.94,.025,23],
  [164,784,671,1240,668,1012,444,.86,-.025,0],[181,975,671,1242,668,1100,451,.93,-.006,7],
  [187,1008,666,1246,665,1163,445,1.04,-.018,66],[192,1063,663,1273,661,1220,443,1.11,.026,67],
  [199,1148,665,1397,590,1298,426,.99,.018,67],[209,1150,671,1558,472,1375,421,.84,.006,70],
  [224,1107,671,1774,385,1390,414,.78,0,0]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 const gust=(slot,x,y,w,h,strength,angle=0)=>art.strike(slot,x,y,w,h,strength,angle,1,'finish');
 function draw({attacker,target:opponent,face,time}){
  const t=HachiwareLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[48,65,83,103,121,142];
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,3,9))),finish=pulse(t,192,4,25);
  frameClip();
  const width=W+300,height=width*9/16;
  art.image('court',-(width-W)*.5-(cx-1000)*.09,-84-(cy-420)*.12,width,height);
  ctx.fillStyle='rgba(25,53,52,'+(pulse(t,191,10,26)*.27)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.49,finish));
  const spread=ease((t-192)/22);
  gust(2,mix(1450,1657,spread),612,mix(506,1129,spread),mix(368,547,spread),pulse(t,196,4,27)*.89,-.026);
  art.glow(0,tx+75,ty-75,575+spread*430,390,finish*.31,-.12);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.05);
  target(opponent,tx,ty-impact*13,-.09-impact*.37-ease((t-193)/26)*1.35,2.55);
  for(const [i,hit] of hits.entries()){
   const slot=i===4?2:i%2;
   const power=pulse(t,hit,4,9);
   const angle=[-.03,.25,-1.02,.93,0,-.2][i];
   if(i===2||i===3)gust(3,tx-22,ty-111,402,388,power,angle-.6);
   else art.strike(slot,tx-19,ty-114,350+i*18,260+i*12,power,angle);
   if(slot===2)art.glow(2,x+87,y-130,560,470,power*.62);
  }
  const forkX=x+206,forkY=y-80;
  gust(0,forkX+mix(188,491,spread),forkY-mix(3,119,spread),mix(397,1024,spread),
   mix(388,581,spread),pulse(t,192,2,14)*.94,-.19);
  gust(1,forkX+29,forkY,315,325,pulse(t,192,1,7)*.86,-.12);
  ctx.restore();flash('255,247,195',Math.max(pulse(t,121,1,3)*.29,finish*.18));bands(t,'#1a2d46');
  portraitPanel(t,-27,art.portrait);ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,152+time*4,143,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

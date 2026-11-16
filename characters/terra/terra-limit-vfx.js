'use strict';

const TerraLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('terra',['cutin','trance-cutin','effects','court','finish'],{revision:3});
 const shots=[
  [0,440,673,1059,674,770,420,.93,0,1],[32,669,673,1059,674,861,433,.98,-.011,22],
  [46,862,673,1068,661,963,438,1,.023,17],[63,833,673,1078,623,953,412,.97,-.021,36],
  [83,725,666,1098,552,914,366,.88,.016,25],[95,691,595,1107,565,851,370,1.045,-.012,39],
  [104,833,468,1122,545,979,333,.9,.022,42],[123,1011,363,1175,528,1095,306,.86,-.027,30],
  [144,1268,428,1157,566,1210,350,.87,.026,-28],[162,1421,502,1174,620,1289,380,.84,-.017,-38],
  [185,1381,608,1164,646,1293,393,.81,0,-32],[201,1411,577,1181,636,1284,397,1.03,-.008,-34],
  [206,1374,596,1136,636,1202,401,.95,.031,-34],[214,1398,611,957,491,1160,388,.81,.014,-34],
  [224,1365,645,772,390,1070,404,.76,-.008,-41],[238,1352,673,572,307,1051,427,.73,0,-1]
 ];
 const hits=[46,63,83,104,123,144];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 const spell=(slot,x,y,w,h,strength,angle=0)=>art.strike(slot,x,y,w,h,strength,angle,1,'finish');
 function draw({attacker,target:opponent,face,time}){
  const t=TerraLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9)));
  const flare=pulse(t,206,2,22);
  const alreadyInTrance=attacker.terraTrance>0;
  const shift=pulse(t,95,9,10),returnGlow=alreadyInTrance?0:pulse(t,229,6,8);
  frameClip();
  const width=W+342;
  art.image('court',-(width-W)*.5-(cx-1000)*.1,-104-(cy-404)*.13,width,width*9/16);
  ctx.fillStyle='rgba(29,8,29,'+(Math.max(shift*.22,pulse(t,205,19,28)*.53))+')';
  ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.6,flare));
  const casting=pulse(t,206,20,10);
  const fromX=x-91,fromY=y-153,aimX=1128,aimY=507;
  const ray=Math.atan2(aimY-fromY,aimX-fromX),spread=ease((t-206)/16);
  const plume=pulse(t,210,4,25);
  spell(2,mix(1060,779,spread),mix(510,413,spread),mix(519,1320,spread),
   mix(422,704,spread),plume*.85,Math.PI+.12);
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,
   inv:0,intangible:0,terraTrance:t<95?attacker.terraTrance:t<229?1:attacker.terraTrance};
  const change=Math.max(shift*(alreadyInTrance?.55:1),returnGlow);
  spell(0,x,y-244,mix(528,629,change),mix(617,786,change),change);
  art.glow(1,x,y-123,450,440,change*.43);
  drawSprite(sprite,1,Math.abs(pose)-1,3.1);
  target(opponent,tx,ty-impact*18,-.08-impact*.31+ease((t-207)/27)*1.39,2.6);
  for(const [i,hit] of hits.entries()){
   const slot=[0,1,2,3,0,3][i],power=pulse(t,hit,slot===1?6:4,10);
   art.strike(slot,tx-6,ty-(slot===2?281:118),slot===2?305:430,slot===2?625:306,power,[-.55,0,0,.28,-.22,-.78][i]);
  }
  const rayLength=mix(831,1160,spread);
  const rayX=fromX+Math.cos(ray)*rayLength*.433,rayY=fromY+Math.sin(ray)*rayLength*.433;
  spell(3,fromX,fromY,182,190,casting*.78,-.27);
  art.glow(3,rayX,rayY,rayLength+100,262,flare*.50,ray);
  spell(1,rayX,rayY,rayLength,mix(411,656,spread),flare,ray);
  spell(3,aimX,aimY,mix(420,712,spread),mix(405,703,spread),pulse(t,206,1,13),-.3);
  ctx.restore();flash('255,175,175',Math.max(impact*.1,shift*.25,flare*.23,returnGlow*.18));bands(t,'#161328');
  portraitPanel(t,25,(zoom,alpha)=>art.portrait(zoom,alpha,alreadyInTrance?'trance-cutin':'cutin'));
  ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,155+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

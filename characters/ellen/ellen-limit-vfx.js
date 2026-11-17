'use strict';

const EllenLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('ellen',['cutin','effects','court','motion']);
 const hits=[...EllenLimitProfile.combo.keys()];
 const shots=[
  [0,437,672,1112,668,777,427,.93,0,0],[30,685,672,1112,668,923,428,.95,-.013,33],
  [45,1004,667,1127,652,1070,420,1,.02,19],[62,1229,666,1162,605,1194,403,.92,-.017,-34],
  [81,1360,566,1199,553,1275,360,.9,.018,-18],[100,1232,431,1178,519,1201,320,.86,-.026,-25],
  [120,916,645,1211,576,1064,405,.91,.02,30],[140,1019,503,1287,594,1157,370,.9,-.023,36],
  [163,1018,669,1297,649,1139,431,.93,0,38],[183,1135,437,1314,539,1221,346,.82,-.012,36],
  [195,1122,377,1319,539,1223,329,.8,.017,37],[207,1114,479,1341,590,1233,368,.88,-.017,41],
  [212,1176,644,1356,652,1263,425,.98,.027,42],[225,1168,670,1527,451,1315,396,.8,.01,42],
  [242,1164,672,1825,319,1450,422,.74,0,0],[250,1164,672,1952,284,1471,429,.72,0,0]
 ];
 const pulse=(t,h,lead,tail)=>ease((t-h+lead)/lead)*(1-ease((t-h-2)/tail));

 function draw({attacker,target:opponent,face,time}){
  const t=EllenLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(h=>pulse(t,h,4,9))),finish=pulse(t,212,2,22);
  frameClip();
  const w=W+351,h=w*9/16,floor=H*.51+(672-cy)*z;
  art.image('court',-(w-W)*.5-(cx-1130)*.10,Math.min(-8,floor-h*.81),w,h);
  ctx.fillStyle='rgba(5,16,38,'+(pulse(t,207,19,35)*.46)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.56,finish));
  const rebound=pulse(t,181,10,11),spread=ease((t-212)/18),crest=mix(510,836,spread);
  art.strike(1,1046,648,682,420,Math.max(rebound*.84,pulse(t,49,9,10)*.79),.018);
  art.strike(1,mix(1372,1556,spread),662,mix(583,1197,spread),mix(397,508,spread),pulse(t,216,3,27)*.91);
  art.strike(3,mix(1352,1417,spread),668-crest*.36,mix(610,1158,spread),crest,finish*.92,.09);
  const sprite={...attacker,x,y,face:Math.sign(pose||1),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  if(!attacker.color&&t>=165&&t<227){
   const stance=t<180?0:t<210?1:2;
   art.grid('motion',stance,3,1,x,y,[362,374,343][stance],{anchorY:.92});
  }else drawSprite(sprite,1,Math.abs(pose),3.08);
  target(opponent,tx,ty-impact*15,-.11-impact*.36-ease((t-213)/25)*1.45,2.52);
  for(const [i,hit] of hits.entries()){
   const index=i===1||i===4?3:0,strength=pulse(t,hit,4,9);
   art.strike(index,tx,ty-109,412+i*17,302,strength,[-.15,.18,.67,.27,-.44,.83][i],Math.sign(tx-x)||1);
  }
  const close=ease((t-205)/7);
  art.strike(2,mix(x+110,1410,close),mix(y-152,522,close),mix(580,906,close),mix(649,497,close),
   pulse(t,212,8,13),mix(.41,-.10,close));
  art.glow(3,1355,508,490+spread*201,361,finish*.41);
  ctx.restore();
  flash('199,237,255',Math.max(impact*.12,pulse(t,212,1,7)*.17));
  bands(t,'#122742');portraitPanel(t,22,art.portrait);ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,154+time*4,142,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

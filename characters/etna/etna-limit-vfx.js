'use strict';

const EtnaLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('etna',['cutin','effects','court','motion','prinny']);
 const hits=[...EtnaLimitProfile.combo.keys()];
 const shots=[
  [0,425,662,1087,665,756,424,.93,0,0],[29,670,665,1087,665,874,424,.96,-.011,31],
  [45,970,666,1095,650,1017,423,1,.023,19],[62,1190,628,1130,626,1132,426,.91,-.022,-26],
  [80,1320,478,1158,572,1215,360,.87,.029,-28],[99,996,430,1197,586,1099,349,.89,-.020,32],
  [118,1045,641,1232,608,1141,405,.95,.014,23],[138,1013,669,1291,655,1152,431,.93,-.017,39],
  [158,946,660,1310,665,1110,431,.92,0,37],[180,1064,343,1320,666,1203,301,.78,-.029,38],
  [198,1220,326,1348,663,1275,329,.81,.011,41],[211,1236,667,1365,657,1316,426,1.06,.034,42],
  [220,1231,669,1534,552,1394,409,.86,.007,42],[238,1225,669,1810,372,1508,422,.75,0,43],
  [252,1221,669,1962,302,1570,435,.72,0,0]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function prinny(x,y,alpha,angle,face=1){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(face,1);
  const width=128,height=width*290/346;
  art.image('prinny',-width/2,-height/2,width,height,alpha);ctx.restore();
 }

 function draw({attacker,target:opponent,face,time}){
  const t=EtnaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(h=>pulse(t,h,3,9))),finish=pulse(t,211,2,22);
  frameClip();
  const w=W+350,h=w*9/16,floor=H*.51+(669-cy)*z;
  art.image('court',-(w-W)*.5-(cx-1160)*.1,Math.min(-6,floor-h*.8),w,h);
  ctx.fillStyle='rgba(34,8,34,'+(pulse(t,209,17,27)*.44)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.52,finish));
  const spread=ease((t-211)/18),crest=mix(507,851,spread),ground=669;
  art.strike(3,mix(1288,1481,spread),ground-crest*.39,mix(678,1195,spread),crest,finish,.12);
  const fall=pulse(t,209,9,7);
  art.strike(2,x+62,y-191,450,630,fall,.16);
  for(const [index,hit] of [62,99,138,220].entries()){
   const lead=index===3?22:13,progress=ease((t-hit+lead)/lead);
   const fromX=[1357,808,1294,1816][index],fromY=[583,203,60,231][index];
   const aimX=index===3?1509:tx,aimY=index===3?611:ty-107;
   prinny(mix(fromX,aimX,progress),mix(fromY,aimY,progress)-Math.sin(progress*Math.PI)*70,pulse(t,hit-2,lead,3),progress*2.4,index%2?1:-1);
   if(index===3)art.strike(1,aimX,aimY,mix(455,760,spread),mix(405,609,spread),pulse(t,hit,2,16),-.12);
  }
  const sprite={...attacker,x,y,face:Math.sign(pose||1),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  if(!attacker.color&&t>=170&&t<225){
   const stance=t<192?0:t<206?1:2;
   art.grid('motion',stance,3,1,x,y,[341,350,335][stance],{anchorY:.94});
  }else drawSprite(sprite,1,Math.abs(pose),3.0);
  target(opponent,tx,ty-impact*15,-.08-impact*.34-ease((t-211)/25)*1.41,2.53);
  for(const [i,hit] of hits.entries()){
   const strength=pulse(t,hit,4,9);
   art.strike(i%2===0?0:1,tx,ty-108,395+i*13,327,strength,[.2,-.22,.44,-.17,-.6,.04][i],i===2?-1:1);
  }
  art.glow(3,1282,597,493,358,pulse(t,211,2,10)*.47);
  ctx.restore();
  flash('255,169,174',Math.max(impact*.12,pulse(t,211,1,7)*.2));
  bands(t,'#28132d');portraitPanel(t,26,art.portrait);ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,154+time*4,140,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

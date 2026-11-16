'use strict';

const PreseaLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('presea',['cutin','effects','quarry','fault','motion']);
 const shots=[
  [0,435,668,1104,668,769,424,.94,0,0],[32,721,669,1104,668,913,424,.98,0,69],
  [46,912,668,1115,657,1014,429,1.01,.019,21],[64,994,669,1197,626,1096,422,.97,-.019,17],
  [83,1184,505,1215,564,1199,367,.89,.024,38],[103,1476,440,1288,554,1380,351,.87,-.024,-30],
  [123,1378,667,1202,630,1290,419,.94,.021,-19],[143,947,668,1173,642,1060,426,.98,-.016,25],
  [160,991,668,1228,657,1109,433,.91,0,40],[174,1100,667,1295,651,1198,432,.94,.02,33],
  [193,1248,337,1309,650,1279,313,.79,-.02,65],[214,1179,669,1302,648,1240,429,.96,.027,67],
  [231,1105,669,1544,464,1324,387,.84,.012,64],[251,1083,669,1947,333,1515,409,.76,0,0]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));

 function draw({attacker,target:opponent,face,time}){
  const t=PreseaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...PreseaLimitProfile.combo.keys()];
  const impact=Math.max(...hits.map(h=>pulse(t,h,4,9))),finish=pulse(t,214,5,25);
  frameClip();
  const width=W+384,height=width*9/16;
  const ground=H*.51+(671-cy)*z;
  art.image('quarry',-(width-W)*.48-(cx-1070)*.14,Math.min(-7,ground-height*.81),width,height);
  ctx.fillStyle='rgba(41,18,25,'+(finish*.23)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.59,finish));
  const mark=pulse(t,189,19,34);
  art.grid('fault',0,2,1,1300,671,565+mark*176,{anchorY:.55,alpha:mark*.84});
  const rise=ease((t-210)/15),epicenter=1302;
  art.grid('fault',1,2,1,epicenter+rise*118,657,640+rise*494,{anchorY:.58,alpha:finish*.8});
  art.strike(3,epicenter,672-(436+rise*547)*.435,459+rise*381,436+rise*547,finish,-.06);
  art.glow(3,epicenter+46,390,554+rise*496,656+rise*399,finish*.31,-.09);
  const sprite={...attacker,x,y,face:Math.sign(pose||1),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  if(!attacker.color&&t>=174&&t<216){
   const motion=t<180?0:t<202?1:2;
   art.grid('motion',motion,3,1,x,y,294,{anchorY:.95,face:sprite.face});
  }else drawSprite(sprite,1,Math.abs(pose),3.23);
  target(opponent,tx,ty-impact*14,-.11-impact*.37-ease((t-215)/26)*1.4,2.53);
  for(const [i,h] of hits.entries()){
   art.strike([0,0,2,1,0,2][i],tx,ty-115,389+i*16,322,pulse(t,h,4,9),
    [.1,.55,-.39,.26,-.37,.11][i],Math.sign(tx-x)||1);
  }
  art.strike(2,epicenter-113,561,371,299,pulse(t,174,3,11),.2);
  art.strike(1,epicenter-39,536,413,348,pulse(t,214,2,9),.02);
  ctx.restore();
  flash('255,195,133',Math.max(impact*.12,finish*.21));
  bands(t,'#221e26');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time}){art.strike(0,x,y,173+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

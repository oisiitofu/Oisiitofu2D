'use strict';

const AshLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('ash',['cutin','effects','duel','fonic','motion']);
 const shots=[
  [0,439,669,1120,667,780,428,.93,0,0],[29,714,669,1120,667,917,428,.98,0,40],
  [45,907,669,1119,656,1013,431,1,.019,41],[63,1005,598,1200,616,1103,402,.94,-.018,33],
  [81,1253,442,1241,550,1247,354,.86,.025,45],[100,1450,526,1238,579,1344,381,.9,-.024,-16],
  [119,1229,668,1116,637,1172,426,.98,.02,-44],[139,909,668,1124,640,1017,425,.98,-.018,46],
  [166,964,669,1227,660,1095,432,.9,0,40],[185,1047,669,1221,655,1134,430,.91,0,8],
  [199,1047,669,1244,647,1145,424,.92,-.012,8],[211,1081,669,1252,643,1166,430,.98,.026,52],
  [230,1020,669,1525,435,1265,399,.82,0,41],[247,1040,669,1858,323,1420,405,.76,0,0]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));

 function draw({attacker,target:opponent,face,time}){
  const t=AshLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...AshLimitProfile.combo.keys()];
  const impact=Math.max(...hits.map(h=>pulse(t,h,4,9))),finish=pulse(t,211,5,24);
  frameClip();
  const width=W+356,height=width*9/16;
  const floor=H*.51+(669-cy)*z;
  art.image('duel',-(width-W)*.49-(cx-1080)*.13,Math.min(-7,floor-height*.79),width,height);
  ctx.fillStyle='rgba(11,33,39,'+(finish*.23)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.55,finish));
  const charge=pulse(t,199,20,17),crest=pulse(t,185,4,10),spread=ease((t-211)/17);
  ctx.save();ctx.translate(1157,665);ctx.scale(1,.43);
  art.grid('fonic',0,2,1,0,0,635+charge*361,{anchorY:.52,alpha:Math.max(charge,finish*.92)});
  ctx.restore();
  art.glow(3,x+26,y-216,294+crest*285,410+crest*177,crest*.72,.04);
  art.grid('fonic',1,2,1,1196+spread*127,665,669+spread*459,{anchorY:.57,alpha:finish*.88});
  art.strike(3,1241+spread*52,667-(427+spread*433)*.43,529+spread*438,427+spread*433,finish,.04);
  const sprite={...attacker,x,y,face:Math.sign(pose||1),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  if(!attacker.color&&t>=177&&t<216){
   const motion=t<185?0:t<205?1:2;
   art.grid('motion',motion,3,1,x,y,[330,423,327][motion],{anchorY:.95,face:sprite.face});
  }else drawSprite(sprite,1,Math.abs(pose),3.15);
  target(opponent,tx,ty-impact*12,-.12-impact*.37-ease((t-212)/25)*1.4,2.54);
  for(const [i,h] of hits.entries()){
   art.strike([0,0,1,1,0,2][i],tx-6,ty-115,394+i*18,315,pulse(t,h,4,9),
    [-.16,-.6,.16,.51,-.2,.1][i],Math.sign(tx-x)||1);
  }
  art.strike(2,1177,564,401+spread*108,303,pulse(t,211,2,9),.09);
  ctx.restore();
  flash('231,255,207',Math.max(impact*.1,crest*.11,finish*.21));
  bands(t,'#14232b');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time}){art.strike(0,x,y,169+time*4,146,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

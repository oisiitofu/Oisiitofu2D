'use strict';

const NargacugaLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('nargacuga',['cutin','effects','bamboo','trace','motion']);
 const shots=[
  [0,414,670,1150,668,782,431,.87,0,0],[29,665,670,1150,668,907,431,.88,0,34],
  [46,915,652,1153,654,1034,427,.94,.018,16],[64,1335,640,1175,619,1255,420,.86,-.023,-19],
  [82,1417,457,1148,583,1283,359,.82,.019,-37],[101,890,584,1113,601,1002,395,.86,-.021,29],
  [121,1202,493,1284,566,1243,363,.84,.024,31],[141,1537,666,1232,638,1385,432,.88,-.018,-42],
  [169,1581,670,1287,657,1434,430,.82,0,-36],[188,1481,425,1289,651,1385,370,.76,-.01,-39],
  [205,1561,624,1259,653,1410,419,.94,-.027,-43],[214,1544,670,1241,646,1374,426,.95,.029,-43],
  [222,1547,670,1133,519,1322,417,.83,.012,-43],[232,1565,670,955,400,1257,404,.75,0,-37],
  [251,1576,669,546,305,1120,406,.72,0,-1]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));

 function draw({attacker,target:opponent,face,time}){
  const t=NargacugaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...NargacugaLimitProfile.combo.keys()];
  const impact=Math.max(...hits.map(h=>pulse(t,h,4,9))),finish=pulse(t,214,5,26);
  frameClip();
  const width=W+363,height=width*9/16,floor=H*.51+(669-cy)*z;
  art.image('bamboo',-(width-W)*.48-(cx-1150)*.13,Math.min(-8,floor-height*.8),width,height);
  ctx.fillStyle='rgba(8,8,22,'+(pulse(t,211,17,31)*.37)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.56,finish));
  const sprite={...attacker,x,y,face:Math.sign(pose||1),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  const pursuit=Math.max(pulse(t,64,7,9),pulse(t,101,8,10),pulse(t,188,11,13));
  art.grid('trace',0,2,1,x+82*sprite.face,y-157,425,{anchorY:.53,alpha:pursuit*.87,face:sprite.face});
  art.grid('trace',1,2,1,x-82*sprite.face,654,595,{anchorY:.56,alpha:pursuit*.62,face:sprite.face});
  const spread=ease((t-214)/17),sink=1241-spread*103;
  art.grid('trace',1,2,1,sink,671,686+spread*559,{anchorY:.55,alpha:finish*.79,face:-1});
  const crestHeight=mix(538,764,spread);
  art.strike(3,sink,670-crestHeight*.36,mix(686,1202,spread),crestHeight,finish,-.12,-1);
  art.glow(3,sink-113,551,655+spread*470,485,finish*.39,-.15,-1);
  if(!attacker.color&&t>=167&&t<221){
   const motion=t<180?0:t<204?1:2;
   art.grid('motion',motion,3,1,x,y,[556,534,567][motion],{anchorY:.95,face:sprite.face});
  }else drawSprite(sprite,1,Math.abs(pose),2.88);
  target(opponent,tx,ty-impact*13,-.1-impact*.4-ease((t-215)/25)*1.4,2.49);
  for(const [i,h] of hits.entries()){
   art.strike([1,0,1,0,2,1][i],tx,ty-110,393+i*19,302,pulse(t,h,4,9),
    [-.23,.42,.6,-.52,.27,.61][i],Math.sign(tx-x)||1);
  }
  art.strike(0,1314,516,615,427,pulse(t,214,4,8),1.08,-1);
  art.strike(1,1241,547,473+spread*121,397,pulse(t,214,2,9)*.93,.51,-1);
  ctx.restore();
  flash('186,209,255',Math.max(impact*.1,pulse(t,214,1,7)*.14));
  bands(t,'#131d2d');
  portraitPanel(t,34,art.portrait);
  ctx.restore();
 }

 function drawContact({x,y,time}){art.strike(1,x,y,174+time*4,149,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

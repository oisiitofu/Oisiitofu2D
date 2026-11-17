'use strict';

const CharlottaLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('charlotta',['cutin','effects','court','motion']);
 const hits=[...CharlottaLimitProfile.combo.keys()];
 const shots=[
  [0,455,674,1008,667,768,432,.94,0,0],[28,598,674,1008,667,792,433,.97,0,43],
  [46,849,670,1034,651,943,428,.99,.02,43],[62,904,633,1053,611,994,411,.95,-.017,47],
  [80,947,542,1101,545,1049,386,.91,.018,44],[99,1016,459,1138,507,1061,346,.89,-.025,45],
  [118,977,602,1191,569,1091,400,.93,.021,42],[138,927,674,1235,643,1083,427,.94,-.013,46],
  [162,873,675,1242,663,1061,432,.91,0,43],[177,942,675,1259,655,1085,429,1.04,-.022,43],
  [192,1012,666,1272,651,1143,422,1.08,.011,46],[206,1161,589,1328,542,1240,403,1.01,.032,44],
  [219,1292,503,1522,408,1362,381,.84,.011,45],[242,1190,675,1851,258,1420,424,.75,0,0]
 ];
 const pulse=(t,h,lead,tail)=>ease((t-h+lead)/lead)*(1-ease((t-h-2)/tail));

 function draw({attacker,target:opponent,face,time}){
  const t=CharlottaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(h=>pulse(t,h,4,9))),finish=pulse(t,206,2,22);
  frameClip();
  const w=W+322,h=w*9/16,floor=H*.51+(674-cy)*z;
  art.image('court',-(w-W)*.5-(cx-1100)*.09,Math.min(-10,floor-h*.81),w,h);
  ctx.fillStyle='rgba(13,24,53,'+(pulse(t,204,21,31)*.42)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.56,finish));
  const ready=pulse(t,177,8,9),rise=ease((t-206)/18),crest=mix(398,810,rise);
  art.strike(3,mix(1300,1428,rise),654-crest*.36,mix(592,1056,rise),crest,finish,-.20);
  art.glow(0,x+91,y-141,322,312,ready*.54);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  if(!attacker.color&&t>=164&&t<225){
   const stance=t<184?0:t<202?1:2;
   art.grid('motion',stance,3,1,x,y,[312,325,349][stance],{anchorY:.94});
  }else drawSprite(sprite,1,pose,3.12);
  target(opponent,tx,ty-impact*13,-.11-impact*.38-ease((t-207)/24)*1.38,2.51);
  for(const [i,hit] of hits.entries()){
   art.strike(i===0?0:1,tx-10,ty-113,411+i*18,306,pulse(t,hit,4,9),[0,.43,-.73,-.95,.37,-.04][i]);
  }
  art.strike(0,x+89,y-140,265,272,ready*.9,-.2);
  art.strike(2,mix(1294,1460,rise),mix(416,307,rise),mix(534,867,rise),mix(598,924,rise),finish,.09);
  ctx.restore();
  flash('223,233,255',Math.max(impact*.12,pulse(t,206,1,7)*.16));
  bands(t,'#122742');
  portraitPanel(t,23,(zoom,alpha)=>{
   ctx.translate(0,39);
   art.portrait(zoom,alpha);
  });
  ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,153+time*4,143,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

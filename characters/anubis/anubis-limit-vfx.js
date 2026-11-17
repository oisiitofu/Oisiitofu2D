'use strict';

const AnubisLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('anubis',['cutin','effects','ring','motion']);
 const hits=[...AnubisLimitProfile.combo.keys()];
 const shots=[
  [0,456,671,1100,668,779,431,.89,0,0],[31,697,661,1100,668,920,430,.89,-.013,34],
  [45,946,645,1104,641,1025,420,.9,.017,23],[58,886,647,1137,599,1021,405,.88,0,34],
  [59,1336,681,1141,592,1040,405,.87,0,-34],[62,1280,628,1146,581,1201,396,.91,.02,-27],
  [77,1374,620,1195,529,1223,380,.9,0,-34],[78,1033,374,1200,528,1230,380,.84,0,34],
  [80,1035,433,1207,530,1122,358,.87,-.022,30],[98,1230,481,1282,551,1259,382,.84,.017,38],
  [116,1111,448,1305,594,1263,406,.88,0,34],[117,1506,511,1310,609,1273,406,.87,0,-34],
  [119,1468,506,1321,590,1396,396,.9,.019,-23],[139,1174,555,1362,609,1268,406,.88,-.025,25],
  [170,1080,506,1391,665,1230,332,.79,0,34],[171,1379,290,1391,665,1230,320,.77,0,43],
  [190,1381,319,1396,673,1377,303,.78,-.014,43],[214,1401,319,1396,661,1398,293,.82,.03,45],
  [227,1406,391,1568,485,1439,350,.76,.011,45],[251,1364,638,1885,312,1508,422,.73,0,0]
 ];
 const shifts=[[59,887,508,1336,536],[78,1374,481,1033,236],[117,1111,312,1506,359],[171,1080,365,1379,153]];
 const pulse=(t,h,lead,tail)=>ease((t-h+lead)/lead)*(1-ease((t-h-2)/tail));

 function draw({attacker,target:opponent,face,time}){
  const t=AnubisLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(h=>pulse(t,h,3,9)));
  const charge=pulse(t,209,21,6),finish=pulse(t,214,2,22),spread=ease((t-214)/18);
  frameClip();
  const width=W+352,height=width*9/16,floor=H*.51+(669-cy)*z;
  art.image('ring',-(width-W)*.5-(cx-1200)*.1,Math.min(6,floor-height*.79),width,height);
  ctx.fillStyle='rgba(23,5,25,'+Math.max(charge*.31,finish*.25)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.58,finish));
  for(const [h,ox,oy,dx,dy] of shifts){
   art.strike(0,ox,oy,372,346,pulse(t,h-2,3,7),-.11);
   art.strike(0,dx,dy,369,381,pulse(t,h,2,7),.11,-1);
  }
  const pointX=1396,ground=669;
  const blastHeight=mix(393,812,spread);
  art.strike(3,pointX,ground-blastHeight*.36,mix(560,1250,spread),blastHeight,finish,.04);
  const sprite={...attacker,x,y,face:Math.sign(pose||1),attack:null,mode:'Idle',state:'idle',grounded:false,inv:0,intangible:0};
  if(!attacker.color&&t>=171&&t<230){
   const stance=t<183?0:t<207?1:2;
   art.grid('motion',stance,3,1,x,y,[485,490,499][stance],{anchorY:.93});
  }else drawSprite(sprite,1,Math.abs(pose),2.75);
  target(opponent,tx,ty-impact*15,-.1-impact*.34-ease((t-215)/24)*1.38,2.47);
  for(const [i,h] of hits.entries()){
   const strength=pulse(t,h,4,9);
   art.strike(1,tx,ty-111,440+i*19,280,strength,[.07,.28,-.99,.65,-.33,-.44][i],i===1||i===4?-1:1);
  }
  const burst=pulse(t,214,1,11);
  const barrelY=y-52,muzzleX=x+52;
  art.glow(3,muzzleX,barrelY,271,235,charge*.76);
  art.strike(2,(muzzleX+pointX)*.5,(barrelY+ground)*.5,409,ground-barrelY+115,burst,.11);
  ctx.restore();
  flash('255,149,157',Math.max(impact*.12,pulse(t,214,1,7)*.19));
  bands(t,'#1a132b');portraitPanel(t,-25,art.portrait);ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(1,x,y,170+time*4,137,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

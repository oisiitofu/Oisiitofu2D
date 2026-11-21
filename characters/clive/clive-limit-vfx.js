'use strict';

const CliveLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('clive',['cutin','effects','court','ifrit','finish'],{revision:3});
 const shots=[
  [0,411,674,1039,671,730,433,.94,0,1],[35,668,674,1039,671,855,424,.97,-.013,35],
  [46,846,641,1059,649,944,422,.98,.025,10],[64,925,611,1106,627,1013,414,.95,-.017,8],
  [84,992,675,1157,572,1076,407,.96,.02,19],[104,943,562,1197,556,1065,391,.89,-.019,15],
  [123,1022,444,1245,519,1145,333,.89,.025,11],[143,1145,522,1314,596,1230,368,.94,-.022,18],
  [163,1123,674,1366,637,1244,426,.9,0,4],[186,1148,674,1371,650,1263,435,.88,-.017,19],
  [196,1137,674,1382,636,1245,408,.96,-.016,19],[204,1230,650,1394,630,1304,398,.94,.025,9],
  [215,1239,665,1581,522,1410,391,.81,.009,18],[239,1235,674,1953,361,1572,404,.74,0,1]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function draw({attacker,target:opponent,face,time}){
  const t=CliveLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...CliveLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,204,2,19),charge=pulse(t,193,25,13);
  frameClip();
  const width=W+360;
  art.image('court',-(width-W)*.5-(cx-1030)*.12,-102-(cy-408)*.13,width,width*9/16);
  ctx.fillStyle='rgba(13,12,35,'+pulse(t,204,29,31)*.51+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.58,finish));
  const ice=pulse(t,104,7,16);
  art.strike(2,980,566,426,296,ice);
  const apparition=ease((t-168)/25)*(1-ease((t-196)/10));
  const lift=ease((t-167)/27);
  art.image('ifrit',x-384,y-753-lift*70,770,770,apparition*.67);
  art.glow(3,x+63,y-161,487,561,charge*.62,-.24);
  const spread=ease((t-204)/19);
  const focusX=1396,focusY=570,plume=pulse(t,208,4,22);
  art.strike(1,focusX+196+spread*75,focusY-250-spread*30,394+spread*113,740+spread*124,plume,-.12,1,'finish');
  art.strike(2,focusX+63+spread*141,648,735+spread*471,253+spread*96,pulse(t,211,4,23),0,1,'finish');
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,3.14);
  target(opponent,tx,ty-hit*13,-.09-hit*.36-ease((t-205)/27)*1.36,2.52);
  for(const [i,h] of hits.entries()){
   const slot=[0,0,1,2,0,3][i];
   art.strike(slot,tx-11,ty-120,400+i*12,324,pulse(t,h,4,10),[.28,-.62,0,.13,.71,-.26][i]);
  }
  art.strike(0,x+161+spread*210,y-184-spread*59,599+spread*294,419+spread*122,finish,-.25,1,'finish');
  art.strike(3,focusX,focusY,286+spread*79,278,pulse(t,204,1,9),.07,1,'finish');
  ctx.restore();
  flash('255,165,113',Math.max(hit*.1,finish*.25));bands(t,'#221421');
  portraitPanel(t,27,(zoom,alpha)=>art.portrait(zoom,alpha));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,170+time*4,150,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

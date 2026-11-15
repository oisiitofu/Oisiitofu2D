'use strict';

const ZackLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('zack',['cutin','effects','court'],{revision:2});
 const shots=[
  [0,406,674,1066,673,736,431,.94,0,1],[34,674,674,1066,673,866,441,.98,-.017,53],
  [46,860,674,1068,662,963,445,1.02,.018,17],[63,927,665,1097,613,1012,409,.97,-.018,19],
  [81,1004,586,1194,555,1099,368,.94,.028,23],[100,1092,493,1258,491,1175,319,.89,-.023,27],
  [120,1191,442,1378,458,1285,292,.88,.018,26],[141,1241,543,1490,593,1366,365,.95,.03,31],
  [155,1261,674,1504,586,1382,430,.9,-.013,44],[175,1324,674,1513,622,1418,439,.95,-.023,21],
  [191,1382,674,1530,662,1460,432,1.02,.025,17],[221,1476,674,2027,358,1630,404,.79,0,1]
 ];
 const hits=[46,63,81,100,120,141];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=ZackLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9))),finish=pulse(t,191,5,25);
  frameClip();
  const width=W+380;
  art.image('court',-(width-W)*.5-(cx-1050)*.14,-102-(cy-416)*.14,width,width*9/16);
  world(cx,cy,z,roll,face,t,Math.max(impact*.63,finish));
  const sweep=ease((t-191)/20);
  art.strike(3,tx+80+sweep*180,ty-123-sweep*54,605+sweep*620,422+sweep*88,finish,-.22);
  art.glow(1,tx+105+sweep*325,ty-122-sweep*80,605+sweep*483,409,finish*.65,-.17);
  art.glow(0,x+108,y-140,520,284,pulse(t,191,15,6)*.69,-.41);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,3.05);
  target(opponent,tx,ty-impact*15,-.12-impact*.39-ease((t-191)/27)*1.31,2.55);
  for(const [i,hit] of hits.entries()){
   const slot=i%3;
   art.strike(slot,tx-30,ty-126,434+i*13,315+i*5,pulse(t,hit,4,9),[-.12,-.7,-.95,.7,.15,1.02][i],slot===0?-1:1);
  }
  art.strike(0,tx-35,ty-132,350+sweep*155,212,pulse(t,191,2,11),-.64,-1);
  ctx.restore();
  flash('255,209,148',Math.max(impact*.13,finish*.2));bands(t,'#161c2c');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,161+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

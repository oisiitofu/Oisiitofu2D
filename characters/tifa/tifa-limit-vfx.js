'use strict';

const TifaLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('tifa',['cutin','effects','court'],{revision:2});
 const shots=[
  [0,375,666,950,666,709,442,1,0,1],
  [31,561,666,950,666,736,439,.98,0,29],
  [44,727,666,950,666,822,444,.97,-.021,19],
  [50,769,666,957,666,853,443,1.04,.016,7],
  [59,805,666,965,666,883,449,.99,.013,19],
  [66,887,666,1011,663,939,448,1.04,.023,18],
  [76,900,666,1034,648,957,419,.97,0,11],
  [83,924,660,1046,593,988,390,.98,-.024,9],
  [93,981,566,1064,530,1024,320,.91,-.04,5],
  [101,979,493,1111,539,1045,315,.92,.034,14],
  [113,1229,422,1092,544,1158,322,.88,-.029,-6],
  [121,1237,496,1059,590,1144,382,.96,-.034,-20],
  [141,1191,621,957,686,1074,434,.93,.027,-9],
  [153,1048,666,932,666,991,447,.93,-.014,-12],
  [173,819,666,1006,666,910,439,.94,-.024,21],
  [185,850,666,1018,666,944,434,1.05,-.02,18],
  [194,864,666,1048,655,954,423,1.1,.023,7],
  [215,867,666,1485,355,1131,354,.83,.011,7],
  [230,867,666,1768,229,1280,390,.81,0,1]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function draw({attacker,target:opponent,face,time}){
  const t=TifaLimitProfile.shotTime(time);
  const [x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...[50,66,83,101,121,141].map(hit=>pulse(t,hit,3,9)));
  const finish=pulse(t,194,4,26);
  frameClip();
  const width=W+262,height=width*9/16;
  art.image('court',-(width-W)*.5-(cx-910)*.09,-71-(cy-418)*.09,width,height);
  world(cx,cy,z,roll,face,t,Math.max(impact*.62,finish));
  const charge=pulse(t,178,20,13);
  art.glow(3,x+85,y-101,366,310,charge*.63);
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.2);
  target(opponent,tx,ty-impact*13,-.07-impact*.38-ease((t-196)/35)*1.36,2.9);
  for(const [index,hit] of [50,66,83,101,121,141].entries()){
   const angle=[0,.2,-.78,-.3,.82,.36][index];
   art.strike(index%3,tx-24,ty-118,365+index*23,293+index*12,pulse(t,hit,3,8),angle);
  }
  art.strike(3,tx+36,ty-124,487+510*ease((t-194)/15),319+183*ease((t-194)/15),finish,.14);
  art.glow(0,tx+44,ty-118,375,285,pulse(t,195,3,15)*.72);
  ctx.restore();
  flash('255,150,105',Math.max(impact*.12,finish*.22));bands(t,'#1a101c');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-16)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,139+time*5,138,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

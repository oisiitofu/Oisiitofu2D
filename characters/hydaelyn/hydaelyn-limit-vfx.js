'use strict';

const HydaelynLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('hydaelyn',['cutin','effects','court','crystal'],{revision:2});
 const shots=[
  [0,447,672,1111,672,787,436,.91,0,1],[31,629,605,1111,672,867,405,.92,-.02,40],
  [47,918,553,1118,658,1020,404,.96,.022,17],[65,964,365,1142,594,1047,340,.9,-.02,18],
  [84,1199,273,1140,524,1182,309,.85,.027,-32],[104,1408,455,1149,514,1278,346,.9,-.026,-43],
  [124,1367,376,1097,560,1222,326,.89,.021,-36],[145,1000,302,1055,589,1040,351,.9,-.018,39],
  [165,771,351,1087,646,930,378,.84,0,35],[191,752,324,1120,653,987,391,.77,0,44],
  [209,738,337,1131,590,972,368,.81,.016,39],[246,763,672,1655,271,1150,405,.74,0,1]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function draw({attacker,target:opponent,face,time}){
  const t=HydaelynLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...HydaelynLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,209,6,26),growth=ease((t-156)/35);
  frameClip();
  const width=W+370;
  art.image('court',-(width-W)*.5-(cx-1000)*.12,-101-(cy-404)*.14,width,width*9/16);
  world(cx,cy,z,roll,face,t,Math.max(hit*.57,finish));
  const fade=growth*(1-ease((t-210)/14));
  const spread=ease((t-209)/19);
  const crystalWidth=122+growth*216,crystalHeight=219+growth*388;
  art.image('crystal',1115-crystalWidth*.5,608-crystalHeight,crystalWidth,crystalHeight,fade*.92);
  art.glow(1,1115,568,470+growth*250,360+growth*180,fade*.54);
  art.glow(3,tx-4,ty-340,652+spread*460,882,finish*.75);
  art.strike(3,tx,ty-349,503+spread*290,840+spread*91,finish);
  art.glow(2,tx+80*spread,ty-40,625+spread*572,241,finish*.76);
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,2.68);
  target(opponent,tx,ty-hit*15,-.13-hit*.33-ease((t-209)/28)*1.44,2.46);
  for(const [i,h] of hits.entries()){
   const slot=[0,0,1,2,0,2][i],direction=i===2||i===3||i===4?-1:1;
   art.strike(slot,tx-13,ty-119,414+i*12,314,pulse(t,h,4,9),[.17,.82,.22,-.4,-.78,.59][i],direction);
  }
  art.strike(1,tx-10,ty-83,312+spread*105,264,pulse(t,209,2,11),-.09);
  art.strike(2,tx+20*spread,ty-40,462+spread*500,216,pulse(t,211,3,16),.04);
  ctx.restore();flash('232,245,255',Math.max(hit*.1,finish*.24));bands(t,'#111e37');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,170+time*4,150,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

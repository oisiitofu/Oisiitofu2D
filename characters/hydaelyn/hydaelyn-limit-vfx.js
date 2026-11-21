'use strict';

const HydaelynLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('hydaelyn',['cutin','effects','court','crystal','finish'],{revision:3});
 const shots=[
  [0,447,672,1111,672,787,436,.91,0,1],[31,629,605,1111,672,867,405,.92,-.02,40],
  [47,918,553,1118,658,1020,404,.96,.022,17],[65,964,365,1142,594,1047,340,.9,-.02,18],
  [84,1199,273,1140,524,1182,309,.85,.027,-32],[104,1408,455,1149,514,1278,346,.9,-.026,-43],
  [124,1367,376,1097,560,1222,326,.89,.021,-36],[145,1000,302,1055,589,1040,351,.9,-.018,39],
  [165,771,351,1087,646,930,378,.84,0,35],[191,752,324,1120,653,987,391,.77,0,44],
  [201,719,328,1127,639,968,385,.83,-.008,44],[209,724,314,1131,590,989,352,.85,.016,39],
  [219,701,337,1302,484,1064,343,.78,.007,39],[234,720,501,1538,333,1173,364,.73,0,35],
  [246,763,672,1655,271,1250,405,.74,0,1]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function draw({attacker,target:opponent,face,time}){
  const t=HydaelynLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...HydaelynLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,209,2,21),growth=ease((t-156)/35);
  frameClip();
  const width=W+370;
  art.image('court',-(width-W)*.5-(cx-1000)*.12,-101-(cy-404)*.14,width,width*9/16);
  ctx.fillStyle='rgba(5,17,56,'+pulse(t,208,24,34)*.54+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.57,finish));
  const fade=growth*(1-ease((t-209)/7));
  const spread=ease((t-209)/19);
  const crystalWidth=122+growth*216,crystalHeight=219+growth*388;
  art.image('crystal',1115-crystalWidth*.5,608-crystalHeight,crystalWidth,crystalHeight,fade*.92);
  art.glow(1,1115,568,470+growth*250,360+growth*180,fade*.54);
  const focusX=1131,focusY=472,column=pulse(t,211,3,23);
  art.strike(0,focusX+75,202-spread*24,325+spread*111,805+spread*174,column,0,1,'finish');
  art.strike(1,focusX+spread*69,629,695+spread*559,223+spread*88,pulse(t,213,4,23),0,1,'finish');
  art.strike(3,focusX+111,focusY-210,288,412,pulse(t,209,3,11),.13,1,'finish');
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,2.68);
  target(opponent,tx,ty-hit*15,-.13-hit*.33-ease((t-209)/28)*1.44,2.46);
  for(const [i,h] of hits.entries()){
   const slot=[0,0,1,2,0,2][i],direction=i===2||i===3||i===4?-1:1;
   art.strike(slot,tx-13,ty-119,414+i*12,314,pulse(t,h,4,9),[.17,.82,.22,-.4,-.78,.59][i],direction);
  }
  art.strike(2,focusX,focusY,259+spread*106,266,pulse(t,209,1,9),-.09,1,'finish');
  ctx.restore();flash('232,245,255',Math.max(hit*.1,finish*.14));bands(t,'#111e37');
  portraitPanel(t,30,(zoom,alpha)=>art.portrait(zoom,alpha));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,170+time*4,150,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

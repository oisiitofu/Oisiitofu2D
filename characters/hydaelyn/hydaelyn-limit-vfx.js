'use strict';

const HydaelynLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('hydaelyn',['cutin','effects']);
 const shots=[
  [0,447,672,1111,672,787,436,.91,0,1],[31,629,605,1111,672,867,405,.92,-.02,40],
  [47,918,553,1118,658,1020,404,.96,.022,17],[65,964,365,1142,594,1047,340,.9,-.02,18],
  [84,1199,273,1140,524,1182,309,.85,.027,-32],[104,1408,455,1149,514,1278,346,.9,-.026,-43],
  [124,1367,376,1097,560,1222,326,.89,.021,-36],[145,1000,302,1055,589,1040,351,.9,-.018,39],
  [165,771,351,1087,646,930,378,.84,0,35],[191,752,324,1120,653,987,391,.77,0,44],
  [209,738,337,1131,590,972,368,.81,.016,39],[246,763,672,1655,271,1150,405,.74,0,1]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function crystal(x,y,r,alpha){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.globalAlpha=alpha;
  const paint=ctx.createLinearGradient(-r,-r,r,r);
  paint.addColorStop(0,'#f4fffc');paint.addColorStop(.52,'#9ae0ff');paint.addColorStop(1,'#467bcb');
  ctx.fillStyle=paint;ctx.strokeStyle='#e6faff';ctx.lineWidth=5;
  ctx.beginPath();ctx.moveTo(0,-r*1.48);ctx.lineTo(r*.49,-r*.38);
  ctx.lineTo(r*.39,r*.61);ctx.lineTo(0,r);ctx.lineTo(-r*.41,r*.54);
  ctx.lineTo(-r*.55,-r*.36);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,-r*1.48);ctx.lineTo(0,r);
  ctx.moveTo(-r*.55,-r*.36);ctx.lineTo(0,-r*.22);ctx.lineTo(r*.49,-r*.38);ctx.stroke();ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=HydaelynLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...HydaelynLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,209,6,26),growth=ease((t-156)/35);
  frameClip();
  const sky=ctx.createRadialGradient(W*.51,H*.35,20,W*.51,H*.35,W*.75);
  sky.addColorStop(0,'#627ec1');sky.addColorStop(.5,'#283d69');sky.addColorStop(1,'#132133');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.57,finish));
  for(let i=0;i<15;i++)crystal(i*298-1350,542+i%4*29,76+i%5*15,.32);
  ctx.fillStyle='#203b58';ctx.fillRect(-1600,675,6000,620);
  crystal(1115,505,239*growth,growth*(1-ease((t-211)/16))*.91);
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,2.68);
  target(opponent,tx,ty-hit*15,-.13-hit*.33-ease((t-209)/28)*1.44,2.46);
  for(const [i,h] of hits.entries())art.strike([0,0,1,2,0,2][i],tx-13,ty-119,414+i*12,314,pulse(t,h,4,9),[.17,.82,.22,-.4,-.78,.59][i]);
  const after=ease((t-208)/5)*(1-ease((t-216)/16)),reach=145+ease((t-209)/19)*594;
  art.strike(3,tx,ty-280,490+ease((t-209)/16)*648,785,finish);
  ctx.save();ctx.globalAlpha=after*.78;ctx.strokeStyle='#eafcff';ctx.lineWidth=8;
  ctx.beginPath();ctx.ellipse(tx,ty-35,reach,reach*.3,0,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<18;i++){
   const a=i*2.4,r=reach*(.31+(i%4)*.15);
   crystal(tx+Math.cos(a)*r,ty-85+Math.sin(a)*r*.65,15+i%5*2,after*.84);
  }
  ctx.restore();
  ctx.restore();flash('232,245,255',Math.max(hit*.1,finish*.24));bands(t,'#111e37');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,170+time*4,150,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

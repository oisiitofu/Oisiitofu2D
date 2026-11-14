'use strict';
const NamineLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('namine',['cutin','effects']);
 const shots=[
  [0,446,669,1120,669,791,430,.89,0,31],[34,519,669,1120,669,826,434,.93,0,44],
  [46,601,669,1118,656,858,432,.98,.015,33],[64,633,654,1181,603,908,414,.96,-.016,34],
  [82,589,601,1245,558,918,370,.87,.019,37],[101,706,541,1218,570,962,369,.9,-.021,43],
  [121,826,627,1176,609,1001,413,.93,.019,41],[141,864,668,1250,593,1064,424,.94,-.018,46],
  [168,743,668,1271,632,1013,435,.86,0,44],[197,754,668,1237,626,994,422,.94,.026,43],
  [232,754,668,1790,339,1228,409,.77,0,0]
 ];
 const leaves=[[832,482],[1186,354],[1421,496],[612,495],[1001,559],[1313,381]];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function paper(x,y,angle,alpha){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;
  ctx.fillStyle='#fcf2d5';ctx.strokeStyle='#9aaccd';ctx.lineWidth=4;
  ctx.fillRect(-43,-58,86,116);ctx.strokeRect(-43,-58,86,116);
  ctx.beginPath();ctx.moveTo(-26,15);ctx.quadraticCurveTo(-11,-15,4,12);
  ctx.quadraticCurveTo(18,-9,28,1);ctx.moveTo(-26,28);ctx.lineTo(17,28);ctx.stroke();
  ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=NamineLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...NamineLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,197,5,25);
  frameClip();
  const sky=ctx.createRadialGradient(W*.49,H*.36,16,W*.49,H*.36,W*.73);
  sky.addColorStop(0,'#d6d8ed');sky.addColorStop(.57,'#777fa3');sky.addColorStop(1,'#3a476b');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.45,finish));
  ctx.fillStyle='#636e95';ctx.fillRect(-1600,674,6000,600);
  ctx.strokeStyle='#aab8d5';ctx.lineWidth=3;
  for(let i=-10;i<16;i++)ctx.strokeRect(i*207,674,195,35);
  for(const [i,h] of hits.entries()){
   const [px,py]=leaves[i],flight=ease((t-h+15)/15),alpha=pulse(t,h-2,16,8);
   const ex=mix(px,tx,flight),ey=mix(py,ty-117,flight);
   ctx.save();ctx.globalAlpha=alpha*.85;ctx.lineWidth=4;ctx.strokeStyle='#fff4ce';
   ctx.beginPath();ctx.moveTo(x+60,y-137);ctx.quadraticCurveTo(px,py-128,ex,ey);ctx.stroke();ctx.restore();
   paper(ex,ey,i*.65+t*.081,alpha);
  }
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.2);
  target(opponent,tx,ty-hit*12,-.09-hit*.34-ease((t-198)/27)*1.37,2.55);
  for(const [i,h] of hits.entries())art.strike(i%3,tx-12,ty-115,345+i*16,294,pulse(t,h,4,9),i*.45);
  const radius=76+389*(1-ease((t-179)/18)),seal=pulse(t,194,24,15);
  for(let i=0;i<8;i++){
   const a=t*.052+i*Math.PI/4;
   const px=tx+Math.cos(a)*radius,py=ty-128+Math.sin(a)*radius*.63;
   ctx.save();ctx.globalAlpha=seal*.74;ctx.strokeStyle='#fff2c1';ctx.lineWidth=5;
   ctx.beginPath();ctx.moveTo(x+70,y-147);ctx.quadraticCurveTo(px-90,py-111,px,py);ctx.stroke();ctx.restore();
   paper(px,py,a,seal);
  }
  art.strike(3,tx,ty-116,499+ease((t-197)/18)*478,437,finish,.19);
  ctx.restore();flash('252,242,214',Math.max(hit*.1,finish*.24));bands(t,'#272d50');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,168+time*4,146,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

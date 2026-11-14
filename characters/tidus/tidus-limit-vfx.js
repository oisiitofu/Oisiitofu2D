'use strict';

const TidusLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('tidus',['cutin','effects']);
 const shots=[
  [0,374,672,1020,672,700,430,.94,0,1],[34,690,672,1020,672,854,433,.94,-.017,6],
  [45,847,672,1030,654,934,437,1,.022,17],[62,916,662,1080,613,997,412,.97,-.02,19],
  [80,994,567,1185,547,1087,360,.91,-.026,25],[99,1092,462,1255,527,1173,326,.88,.023,30],
  [119,1199,415,1341,522,1270,308,.88,-.029,28],[139,1288,592,1425,563,1356,376,.92,.02,27],
  [162,1044,672,1454,617,1250,427,.87,-.017,7],[181,1038,520,1442,626,1241,350,.89,.023,46],
  [191,1120,434,1462,615,1291,333,.93,-.019,46],[199,1118,445,1480,621,1299,352,.87,.015,60],
  [234,1116,672,1995,337,1465,414,.77,0,1]
 ];
 const hits=[45,62,80,99,119,139],pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=TidusLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hit=Math.max(...hits.map(h=>pulse(t,h,4,9))),finish=pulse(t,199,5,25);
  frameClip();
  const sky=ctx.createRadialGradient(W*.53,H*.32,20,W*.53,H*.32,W*.76);
  sky.addColorStop(0,'#357cb3');sky.addColorStop(.52,'#1f527b');sky.addColorStop(1,'#101b3e');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.54,finish));
  ctx.strokeStyle='#73bee0';ctx.lineWidth=5;
  for(let i=0;i<5;i++){
   ctx.beginPath();ctx.ellipse(1110,669,603+i*267,210+i*37,0,Math.PI,2*Math.PI);ctx.stroke();
  }
  ctx.fillStyle='#1b4a70';ctx.fillRect(-1500,674,6100,520);
  ctx.strokeStyle='#7bbfdf';ctx.lineWidth=3;
  for(let i=0;i<13;i++){
   const px=i*370-1340,py=675+(i%3)*33;
   ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px+112,py-24,px+261,py);ctx.stroke();
  }
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,3.12);
  target(opponent,tx,ty-hit*13,-.13-hit*.33-ease((t-200)/29)*1.35,2.52);
  for(const [i,h] of hits.entries())art.strike(i%3,tx-14,ty-125,383+i*14,315,pulse(t,h,4,10),[-.21,.52,-.77,.9,-.44,.23][i]);
  const flight=ease((t-191)/8),throwUp=ease((t-164)/25);
  const bx=mix(mix(x+28,x+104,throwUp),tx,flight),by=mix(mix(y-47,y-114,throwUp),ty-111,flight);
  const ballAlpha=ease((t-165)/5)*(1-ease((t-199)/3));
  if(ballAlpha>0){
   ctx.save();ctx.translate(bx,by);ctx.rotate(t*.2);ctx.globalAlpha=ballAlpha;
   ctx.fillStyle='#e9f7e1';ctx.strokeStyle='#216da2';ctx.lineWidth=6;
   ctx.beginPath();ctx.arc(0,0,36,0,Math.PI*2);ctx.fill();ctx.stroke();
   ctx.beginPath();ctx.ellipse(0,0,25,14,1,0,Math.PI*2);ctx.stroke();
   ctx.beginPath();ctx.moveTo(-32,15);ctx.lineTo(28,-22);ctx.stroke();ctx.restore();
  }
  const spray=ease((t-197)/6)*(1-ease((t-204)/18));
  ctx.save();ctx.globalAlpha=spray*.9;ctx.fillStyle='#c1f9ff';
  for(let i=0;i<21;i++){
   const age=ease((t-197)/22),angle=i*2.4,reach=85+age*(170+i%5*42);
   const px=tx+Math.cos(angle)*reach,py=ty-110+Math.sin(angle)*reach*.73;
   ctx.beginPath();ctx.ellipse(px,py,10+i%4,4,angle,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  art.strike(3,tx,ty-121,500+ease((t-199)/17)*472,507,finish,.12);
  ctx.restore();flash('181,234,255',Math.max(hit*.11,finish*.24));bands(t,'#101e36');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,163+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

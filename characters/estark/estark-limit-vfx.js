'use strict';
const EstarkLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('estark',['cutin','effects']);
 const shots=[
  [0,411,685,1129,676,797,437,.85,0,1],[32,591,685,1129,676,860,430,.86,-.016,12],
  [47,838,685,1144,663,991,434,.91,.028,17],[67,936,686,1218,634,1091,419,.89,-.026,18],
  [87,1062,682,1304,587,1179,400,.91,.022,21],[108,918,681,1415,631,1170,423,.87,-.024,43],
  [128,1091,681,1438,625,1264,417,.91,.019,35],[149,1209,656,1481,631,1348,405,.89,.025,31],
  [172,1106,686,1548,651,1327,437,.82,0,62],[192,1107,648,1548,651,1328,403,.85,-.02,25],
  [208,1248,685,1534,632,1390,412,.94,.027,19],[244,1272,685,2021,381,1565,413,.75,0,1]
 ];
 const pulse=(t,h,lead,tail)=>ease((t-h+lead)/lead)*(1-ease((t-h-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=EstarkLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...EstarkLimitProfile.combo.keys()],shock=Math.max(...hits.map(h=>pulse(t,h,4,10)));
  const finish=pulse(t,208,5,27);
  frameClip();
  const sky=ctx.createRadialGradient(W*.53,H*.42,12,W*.53,H*.42,W*.78);
  sky.addColorStop(0,'#963d42');sky.addColorStop(.53,'#522842');sky.addColorStop(1,'#1c172b');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(shock*.69,finish));
  for(let i=0;i<13;i++){
   const px=i*338-990,top=170+(i*89)%286;
   ctx.fillStyle=i%2?'#422338':'#54293a';ctx.fillRect(px,top,225,690-top);
   ctx.strokeStyle='#905053';ctx.lineWidth=6;ctx.strokeRect(px+15,top+13,195,34);
  }
  ctx.fillStyle='#342536';ctx.fillRect(-1800,686,6300,720);
  const quake=Math.max(pulse(t,47,2,10),pulse(t,149,3,13),finish);
  if(quake>0){
   ctx.save();ctx.globalAlpha=quake;ctx.strokeStyle='#ef9270';ctx.lineWidth=7;
   for(const side of [-1,1]){
    ctx.beginPath();ctx.moveTo(x,686);ctx.lineTo(x+side*131,706);ctx.lineTo(x+side*236,694);
    ctx.lineTo(x+side*396,760);ctx.stroke();
   }
   ctx.restore();
  }
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,2.83);
  target(opponent,tx,ty-shock*16,-.1-shock*.39-ease((t-209)/27)*1.39,2.49);
  for(const [i,h] of hits.entries()){
   art.strike([0,0,0,1,0,2][i],tx-28,ty-123,430+i*13,326,pulse(t,h,4,10),[.56,-.7,.28,-.13,.88,-.27][i]);
  }
  const span=587+ease((t-207)/17)*514;
  art.strike(3,tx,ty-144,span,334,finish,-.74);
  art.strike(3,tx,ty-144,span,334,finish,.73,-1);
  art.strike(2,tx,ty-107,481,429,pulse(t,211,3,18));
  ctx.save();ctx.globalAlpha=pulse(t,210,2,16)*.85;ctx.fillStyle='#ffb374';
  for(let i=0;i<17;i++){
   const a=i*2.4,r=(72+i%5*23)*(1+ease((t-208)/18)*2.7);
   const px=tx+Math.cos(a)*r,py=ty-104+Math.sin(a)*r*.77;
   ctx.beginPath();ctx.moveTo(px,py-9);ctx.lineTo(px+9,py+8);ctx.lineTo(px-7,py+5);ctx.closePath();ctx.fill();
  }
  ctx.restore();
  ctx.restore();flash('255,166,123',Math.max(shock*.12,finish*.24));bands(t,'#1c1326');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(2,x,y,171+time*4,149,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

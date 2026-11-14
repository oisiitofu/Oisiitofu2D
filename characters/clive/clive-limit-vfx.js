'use strict';

const CliveLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('clive',['cutin','effects']);
 const shots=[
  [0,411,674,1039,671,730,433,.94,0,1],[35,668,674,1039,671,855,424,.97,-.013,35],
  [46,846,641,1059,649,944,422,.98,.025,10],[64,925,611,1106,627,1013,414,.95,-.017,8],
  [84,992,675,1157,572,1076,407,.96,.02,19],[104,943,562,1197,556,1065,391,.89,-.019,15],
  [123,1022,444,1245,519,1145,333,.89,.025,11],[143,1145,522,1314,596,1230,368,.94,-.022,18],
  [163,1123,674,1366,637,1244,426,.9,0,4],[186,1148,674,1371,650,1263,435,.88,-.017,19],
  [204,1182,660,1394,630,1288,408,.91,.025,9],[239,1182,674,1953,361,1506,404,.77,0,1]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function draw({attacker,target:opponent,face,time}){
  const t=CliveLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...CliveLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,204,5,28),charge=pulse(t,193,25,13);
  frameClip();
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#272032');sky.addColorStop(.58,'#71434d');sky.addColorStop(1,'#bb643f');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.58,finish));
  for(let i=0;i<16;i++){
   const px=i*309-1470,py=334+i%5*49;
   ctx.fillStyle=i%2===0?'#472633':'#58303a';
   ctx.beginPath();ctx.moveTo(px-100,675);ctx.lineTo(px,py+81);ctx.lineTo(px+73,py);
   ctx.lineTo(px+225,675);ctx.fill();
  }
  ctx.fillStyle='#3d2937';ctx.fillRect(-1700,676,6500,600);
  const ice=pulse(t,104,7,16);
  art.strike(2,980,566,356,180,ice);
  art.glow(3,x+63,y-146,553,507,charge*.8,-.24);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,3.14);
  target(opponent,tx,ty-hit*13,-.09-hit*.36-ease((t-205)/27)*1.36,2.52);
  for(const [i,h] of hits.entries()){
   const slot=[0,0,1,2,0,3][i];
   art.strike(slot,tx-11,ty-120,400+i*12,324,pulse(t,h,4,10),[.28,-.62,0,.13,.71,-.26][i]);
  }
  const burst=ease((t-201)/7)*(1-ease((t-207)/17)),spread=150+680*ease((t-204)/19);
  const rising=ease((t-200)/6);
  for(const [offset,height,delay] of [[-169,480,2],[0,735,0],[172,552,3]]){
   const power=pulse(t,204+delay,5,21);
   if(power<=0)continue;
   const px=tx+offset,base=ty-47,tip=base-height*rising;
   const flame=ctx.createLinearGradient(px,base,px,tip-1);
   flame.addColorStop(0,'#fff7a8');flame.addColorStop(.34,'#ffb54b');flame.addColorStop(1,'#d22c36');
   ctx.save();ctx.globalAlpha=power*.93;ctx.fillStyle=flame;
   ctx.beginPath();ctx.moveTo(px-114,base);
   ctx.bezierCurveTo(px-161,base-160*rising,px+82,tip+119,px-21,tip);
   ctx.bezierCurveTo(px+83,tip+120,px+156,base-137*rising,px+105,base);
   ctx.closePath();ctx.fill();ctx.restore();
  }
  art.strike(3,tx-13,ty-84,416+320*ease((t-203)/18),248,finish*.85,-.09);
  ctx.save();ctx.globalAlpha=burst*.78;ctx.strokeStyle='#ffc372';ctx.lineWidth=8;
  ctx.beginPath();ctx.ellipse(tx,ty-69,spread,spread*.33,0,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#ffcb80';
  for(let i=0;i<24;i++){
   const px=tx+(i%2?1:-1)*spread*(.3+i%7*.1),py=ty-110-(i*83)%454;
   ctx.fillRect(px,py,5+i%4,11+i%9);
  }
  ctx.restore();ctx.restore();
  flash('255,165,113',Math.max(hit*.1,finish*.25));bands(t,'#221421');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,170+time*4,150,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

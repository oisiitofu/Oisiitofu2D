'use strict';

const NoctisLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('noctis',['cutin','effects']);
 const shots=[
  [0,409,671,1036,670,723,428,.93,0,1],[34,583,671,1036,670,813,429,.96,-.01,13],
  [45,574,670,1036,669,812,429,.96,0,14],[46,844,651,1047,664,945,426,.99,.022,7],
  [64,920,628,1113,625,1017,412,.96,-.017,9],[78,914,626,1142,597,1028,411,.88,0,14],
  [81,914,626,1143,586,1028,411,.88,0,14],[82,1278,337,1143,586,1210,298,.87,.024,-12],
  [102,1241,526,1134,590,1188,366,.94,-.018,-17],[119,1225,520,1087,577,1156,365,.88,0,-14],
  [121,1225,520,1087,577,1156,365,.88,0,-14],[122,729,474,1087,577,929,351,.9,.023,11],
  [142,836,601,1118,629,977,414,.95,-.018,7],[168,747,671,1148,656,945,430,.86,0,1],
  [195,827,645,1184,632,1021,422,.99,.024,9],[232,819,673,1697,317,1200,406,.76,0,1]
 ];
 const warps=[[46,874,529],[82,1272,211],[122,732,326]];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function blade(x,y,angle,scale,alpha){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);ctx.globalAlpha=alpha;
  ctx.fillStyle='#b9f5ff';ctx.strokeStyle='#4aa5ff';ctx.lineWidth=4;
  ctx.beginPath();ctx.moveTo(-18,-8);ctx.lineTo(61,-9);ctx.lineTo(92,0);ctx.lineTo(61,9);
  ctx.lineTo(-18,8);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#5788cb';ctx.fillRect(-30,-17,9,34);ctx.fillRect(-50,-5,24,10);ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=NoctisLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...NoctisLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,3,9)));
  const finish=pulse(t,195,5,24);
  frameClip();
  const sky=ctx.createRadialGradient(W*.58,H*.36,0,W*.58,H*.36,W*.7);
  sky.addColorStop(0,'#3b5980');sky.addColorStop(.54,'#232f55');sky.addColorStop(1,'#11152a');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.51,finish));
  ctx.fillStyle='#1a263b';ctx.fillRect(-1600,674,5800,680);
  ctx.strokeStyle='#718aa4';ctx.lineWidth=3;
  for(let i=-8;i<14;i++){
   const px=i*273;ctx.beginPath();ctx.moveTo(px,675);ctx.lineTo(px*1.27,1180);ctx.stroke();
  }
  for(const [h,dx,dy] of warps){
   const flight=ease((t-h+12)/12);
   blade(mix(x+60,dx,flight),mix(y-121,dy,flight),-.27+flight*.49,1,pulse(t,h,12,5));
   art.strike(1,dx,dy,278,352,pulse(t,h,2,8));
  }
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.16);
  target(opponent,tx,ty-hit*12,-.08-hit*.34-ease((t-196)/27)*1.38,2.56);
  for(const [i,h] of hits.entries()){
   art.strike(i%2===0?0:2,tx-16,ty-118,428,326,pulse(t,h,3,9),[-.25,.44,1.19,-.62,.77,-.2][i]);
  }
  const orbit=1-ease((t-184)/11);
  for(let i=0;i<9;i++){
   const a=i*Math.PI*2/9+t*.05;
   blade(tx+Math.cos(a)*(71+395*orbit),ty-116+Math.sin(a)*(55+228*orbit),a+Math.PI,1.14,pulse(t,193,29,7));
  }
  art.strike(3,tx,ty-112,381+320*ease((t-193)/19),353,finish*.81,t*.06);
  for(const angle of [-.79,.24,1.03]){
   art.strike(0,tx,ty-115,695,282,pulse(t,197,3,13),angle);
  }
  ctx.restore();flash('173,228,255',Math.max(hit*.1,finish*.22));bands(t,'#121b37');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,168+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

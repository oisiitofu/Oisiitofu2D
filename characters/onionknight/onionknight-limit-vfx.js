'use strict';

const OnionKnightLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('onionknight',['cutin','effects']);
 const shots=[
  [0,385,673,1008,671,696,430,.94,0,1],[29,622,673,1008,671,819,431,.95,-.012,23],
  [44,832,669,1023,662,930,438,1,.02,17],[60,926,656,1089,621,1012,418,.94,-.02,18],
  [77,1095,607,1201,586,1148,390,.94,.018,23],[96,1351,499,1228,541,1290,346,.87,-.027,-31],
  [106,1403,573,1198,576,1301,400,.87,0,-41],[115,1381,674,1169,638,1275,429,.92,.015,-17],
  [135,1302,674,1110,604,1206,415,.89,-.018,-21],[155,1292,674,1064,591,1172,402,.91,.018,-18],
  [176,1261,674,1002,659,1129,413,.86,-.014,-41],[196,1257,674,976,628,1109,404,.92,.021,-43],
  [232,1257,674,482,314,893,397,.75,0,-1]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function sigil(x,y,r,angle,color,alpha){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=5;
  for(const sides of [4,6]){
   ctx.beginPath();
   for(let i=0;i<sides;i++){
    const a=i*2*Math.PI/sides;const px=r*Math.cos(a),py=r*Math.sin(a);
    if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);
   }
   ctx.closePath();ctx.stroke();
  }
  ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=OnionKnightLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...OnionKnightLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,196,5,25),swap=Math.max(pulse(t,27,7,8),pulse(t,70,6,8),pulse(t,106,7,8),pulse(t,226,5,7));
  frameClip();
  const sky=ctx.createRadialGradient(W*.58,H*.39,20,W*.58,H*.39,W*.77);
  sky.addColorStop(0,'#754d76');sky.addColorStop(.57,'#413456');sky.addColorStop(1,'#201e38');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.57,finish));
  ctx.fillStyle='#373045';ctx.fillRect(-1900,676,6500,650);
  ctx.strokeStyle='#9d8d9c';ctx.lineWidth=3;
  for(let i=-10;i<18;i++)ctx.strokeRect(i*232,676,217,38);
  const job=t<27||t>=226?onionknightJob(attacker):t<70?0:t<106?1:2;
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0,onionJob:job};
  sigil(x,y-98,145,t*.055,['#ffd9b2','#9cc9ff','#ffd5fa'][job],swap);
  drawSprite(sprite,1,Math.abs(pose)-1,3.2);
  target(opponent,tx,ty-hit*14,-.13-hit*.34+ease((t-196)/26)*1.35,2.55);
  for(const [i,h] of hits.entries())art.strike([0,0,0,0,1,2,3][i],tx+14,ty-116,401+i*13,319,pulse(t,h,4,9),[-.31,.43,-.51,.87,.18,0,.08][i]);
  for(const [i,angle] of [-.79,.15,.97].entries())art.strike(i+1,tx,ty-132,622,491,finish,angle);
  sigil(tx,ty-119,118+ease((t-196)/18)*306,t*.11,'#fff4cb',finish*.66);
  ctx.restore();flash('255,232,233',Math.max(hit*.1,swap*.15,finish*.2));bands(t,'#25182e');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,169+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

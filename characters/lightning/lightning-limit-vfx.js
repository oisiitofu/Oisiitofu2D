'use strict';

const LightningLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('lightning',['cutin','effects']);
 const shots=[
  [0,391,672,1051,672,721,431,.94,0,1],[32,693,669,1051,672,875,431,.98,-.014,35],
  [44,869,668,1064,655,970,434,1,.019,7],[59,929,646,1103,630,1016,418,.97,-.018,8],
  [74,902,574,1113,593,1008,382,.95,.027,14],[90,1116,423,1161,563,1138,332,.9,-.021,11],
  [106,1321,494,1188,571,1254,362,.93,.026,-9],[122,1377,629,1207,636,1291,418,.96,-.019,-13],
  [139,1130,629,1011,597,1071,413,.98,.021,-16],[154,951,498,1085,601,1017,350,.91,-.021,17],
  [178,1006,405,1100,633,1052,347,.94,.025,12],[209,1115,672,1644,328,1269,403,.77,0,1]
 ];
 const hits=[44,59,74,90,106,122,139],pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=LightningLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hit=Math.max(...hits.map(h=>pulse(t,h,3,8))),finish=pulse(t,178,4,23);
  frameClip();
  const sky=ctx.createLinearGradient(0,0,W,H);
  sky.addColorStop(0,'#152437');sky.addColorStop(.59,'#41345f');sky.addColorStop(1,'#7a435d');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.61,finish));
  ctx.fillStyle='#32263e';ctx.fillRect(-1600,673,6080,560);
  for(let i=0;i<17;i++){
   const bx=i*258-1130,top=300+(i%4)*41;
   ctx.fillStyle=i%2===0?'#322941':'#49324e';ctx.fillRect(bx,top,180,673-top);
   ctx.strokeStyle='#936783';ctx.lineWidth=4;ctx.strokeRect(bx+19,top+22,138,43);
  }
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.18);
  target(opponent,tx,ty-hit*14,-.1-hit*.38-ease((t-179)/26)*1.35,2.55);
  for(const [i,h] of hits.entries()){
   const power=pulse(t,h,3,8);
   if(i===2||i===5){
    const sx=x+Math.sign(pose)*106,sy=y-127,dx=tx-sx,dy=ty-126-sy;
    art.strike(2,sx+dx*.5,sy+dy*.5,Math.hypot(dx,dy)+75,124,power,Math.atan2(dy,dx));
   }else art.strike(i%2,tx,ty-116,429+i*12,320,power,[-.42,.62,0,-1.2,.46,0,.16][i]);
  }
  const branches=ease((t-176)/5)*(1-ease((t-181)/12));
  ctx.save();ctx.globalAlpha=branches*.77;ctx.strokeStyle='#e8dfff';ctx.lineWidth=5;
  ctx.beginPath();
  for(const side of [-1,1]){
   ctx.moveTo(tx,ty-194);ctx.lineTo(tx+side*139,ty-255);
   ctx.lineTo(tx+side*242,ty-231);ctx.lineTo(tx+side*398,ty-335);
  }
  ctx.stroke();ctx.restore();
  art.strike(3,tx-13,ty-244,580+ease((t-180)/13)*315,590,finish,.11);
  art.strike(1,tx+114,ty-123,745,318,pulse(t,183,3,15),-.11);
  ctx.restore();flash('219,194,255',Math.max(hit*.11,finish*.24));bands(t,'#171427');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,168+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

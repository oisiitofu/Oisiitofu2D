'use strict';

const LightningLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('lightning',['cutin','effects','court'],{revision:2});
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
  const width=W+350;
  art.image('court',-(width-W)*.5-(cx-1025)*.12,-101-(cy-414)*.14,width,width*9/16);
  world(cx,cy,z,roll,face,t,Math.max(hit*.61,finish));
  const spread=ease((t-178)/17);
  const charge=pulse(t,177,17,4);
  art.glow(2,x+38,y-163,332,230,charge*.75,-1.04);
  art.glow(3,tx-14,ty-365,477+spread*343,810,finish*.72,.08);
  art.strike(3,tx-7,ty-360,432+spread*245,775+spread*135,finish,.06);
  art.glow(1,tx+95*spread,ty-77,615+spread*321,348,finish*.56,-.09);
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.18);
  target(opponent,tx,ty-hit*14,-.1-hit*.38-ease((t-179)/26)*1.35,2.55);
  for(const [i,h] of hits.entries()){
   const power=pulse(t,h,3,8);
   if(i===2||i===5){
    const sx=x+Math.sign(pose)*106,sy=y-127,dx=tx-sx,dy=ty-126-sy;
    art.strike(2,sx+dx*.5,sy+dy*.5,Math.hypot(dx,dy)+75,124,power,Math.atan2(dy,dx));
   }else art.strike(i%2,tx,ty-116,429+i*12,320,power,[-.42,.62,0,-1.2,.46,0,.16][i],i>=4?-1:1);
  }
  const strike=pulse(t,178,2,12);
  art.strike(0,tx-32,ty-145,435+spread*172,318,strike,-.42);
  art.strike(1,tx+91,ty-103,522+spread*271,258,pulse(t,181,3,11),-.17);
  ctx.restore();flash('219,194,255',Math.max(hit*.11,finish*.24));bands(t,'#171427');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,168+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

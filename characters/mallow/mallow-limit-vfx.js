'use strict';
const MallowLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('mallow',['cutin','court','poses','star','effects']);
 const shots=[
  [0,561,653,873,624,719,455,1.16,-.025,0],
  [45,570,650,942,602,756,432,1.10,.034,1],
  [68,520,645,982,593,752,414,1.05,-.039,2],
  [90,488,613,1004,610,751,406,.95,.028,3],
  [112,486,648,1005,592,749,411,1.02,.043,4],
  [134,486,649,1007,590,751,406,1.06,-.042,4],
  [155,488,648,1009,584,757,401,1.01,.041,4],
  [174,475,623,1013,606,764,390,.94,-.039,3],
  [183,474,633,1100,550,795,418,1.10,.027,4],
  [214,478,650,1434,297,873,433,.95,-.01,5],
  [253,486,649,1703,186,890,448,.93,0,5]
 ];
 const landings=[
  [89,113,837,-118,968,497,0,193],
  [113,133,968,497,1000,495,223,240],
  [133,154,1000,495,1017,492,265,301],
  [154,179,1017,492,1037,484,404,480]
 ];
 function bouncingStar(t){
  for(const [i,[from,to,x0,y0,x1,y1,height,endSize]] of landings.entries()){
   if(t<from||t>=to)continue;
   const p=unit((t-from)/(to-from));
   const size=mix(i?landings[i-1][7]:endSize,endSize,ease(p));
   const x=mix(x0,x1,p),y=mix(y0,y1,height?p:p*p)-Math.sin(Math.PI*p)*height-size*.32;
   const spin=(from===89?0:Math.PI*2*p)+t*.019;
   ctx.save();ctx.translate(x,y);ctx.rotate(spin);
   art.image('star',-size*.5,-size*.5,size,size,ease((t-89)/6));ctx.restore();
  }
 }
 function sparkle(t,x,y,opacity){
  if(!opacity)return;
  ctx.save();
  for(let i=0;i<27;i++){
   const p=unit((t-179-i%4)/44),angle=i*2.39996;
   const px=x+Math.cos(angle)*p*(260+i%7*80),py=y+Math.sin(angle)*p*(245+i%5*55)-Math.sin(p*Math.PI)*120;
   const size=4+i%5*3.4;
   ctx.save();ctx.translate(px,py);ctx.rotate(angle+t*.062);ctx.globalAlpha=opacity*(.49+i%5*.12);
   ctx.fillStyle=['#fff0a2','#a4f4ff','#ffa9f0'][i%3];
   ctx.beginPath();ctx.moveTo(0,-size);ctx.lineTo(size*.30,-size*.28);ctx.lineTo(size,0);
   ctx.lineTo(size*.30,size*.28);ctx.lineTo(0,size);ctx.lineTo(-size*.30,size*.28);
   ctx.lineTo(-size,0);ctx.lineTo(-size*.30,-size*.28);ctx.closePath();ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  const s=1.036+time*.001,opacity=ease(t/4)*(1-ease((t-23)/10));
  if(!opacity)return;
  ctx.save();ctx.beginPath();ctx.moveTo(0,102);ctx.lineTo(W,141);ctx.lineTo(W,718);ctx.lineTo(0,680);ctx.closePath();ctx.clip();
  art.portrait(s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=MallowLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const burst=ease((t-176)/7)*(1-ease((t-189)/28));
  const thunder=ease((t-63)/12)*(1-ease((t-79)/16));
  frameClip();ctx.fillStyle='#362951';ctx.fillRect(0,0,W,H);
  art.image('court',-118-t*.19,-106+ease((t-70)/49)*72,W+305,H+166);
  world(cx,cy,z,roll,face,t,Math.max(burst,thunder*.24));
  const hop=[113,133,154].reduce((sum,at)=>sum+Math.sin(Math.PI*unit((t-at)/15))*54,0);
  target(opponent,tx,ty-hop,-.08+Math.sin(t*.15)*.11-ease((t-180)/30)*1.43);
  art.grid('poses',index,3,2,x,y,319);
  art.strike(0,973,351,339+thunder*138,405+thunder*176,thunder*.90);
  bouncingStar(t);
  for(const [,at,,,ex,ey,,size] of landings){
   const rebound=ease((t-at)/3)*(1-ease((t-at-4)/13));
   art.strike(1,ex,ey+67,212+size*.6,146,rebound*.91);
   art.glow(2,ex,ey+142,208+size*.51,97,rebound*.63);
  }
  art.strike(3,1033,476,443+burst*620,334+burst*268,burst*.92);
  sparkle(t,1033,478,ease((t-179)/5)*(1-ease((t-196)/32)));
  ctx.restore();flash('255,226,159',Math.max(burst*.20,thunder*.09));
  bands(t,'#251e43');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/MallowLimitProfile.contactHold;
  art.strike(3,x,y,138+48*p,133,1-p*.55,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

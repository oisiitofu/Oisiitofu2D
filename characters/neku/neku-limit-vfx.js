'use strict';
const NekuLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('neku',['cutin','court','poses','shiki','cat','effects']);
 const shots=[
  [0,473,651,883,623,680,455,1.12,-.045,0],
  [34,487,650,877,626,696,451,1.20,.02,1],
  [56,516,645,904,612,715,455,1.13,-.043,2],
  [75,584,625,936,583,757,444,1.10,.066,3],
  [96,562,646,950,589,781,451,1.04,-.036,1],
  [117,600,644,939,578,810,445,1.06,.062,2],
  [139,606,645,967,591,824,437,1.02,-.063,3],
  [160,650,634,982,600,834,443,.97,-.055,4],
  [173,694,622,989,606,842,441,1.05,.022,4],
  [184,744,637,993,607,869,462,1.24,.095,4],
  [198,758,647,1121,502,893,458,1.08,-.036,4],
  [222,768,649,1354,379,912,448,.98,-.031,5],
  [246,768,651,1525,275,907,449,.99,0,5]
 ];
 const colors=['#fb4eac','#6cf2ff','#ffe96b'];
 function panelBoundary(t){
  const enter=ease((t-60)/25),exit=ease((t-153)/28);
  return mix(W+230,W*.56,enter)+exit*(W*.55);
 }
 function panels(t){
  const alpha=ease((t-58)/13)*(1-ease((t-163)/19));if(!alpha)return;
  const x=panelBoundary(t);
  ctx.save();ctx.globalAlpha=alpha;
  ctx.beginPath();ctx.moveTo(x+118,0);ctx.lineTo(W,0);ctx.lineTo(W,H);ctx.lineTo(x-138,H);ctx.closePath();ctx.clip();
  art.image('court',-170+Math.sin(t*.028)*52,-83,W+317,H+156,.82);
  ctx.fillStyle='#d5319229';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#1b092c66';
  for(let y=54;y<H;y+=25)for(let col=0;col<26;col++){
   const px=W-col*25+(y%2)*12.5;
   if(px>=x-158)ctx.fillRect(px,y,4+col*.11,4+col*.11);
  }
  ctx.restore();
  ctx.save();ctx.globalAlpha=alpha;
  for(const [color,width] of [['#0c0918',28],['#ffdef5',8],['#f14bab',3]]){
   ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x+118,0);ctx.lineTo(x-138,H);ctx.stroke();
  }
  ctx.restore();
 }
 function badges(t,x,y){
  const show=ease((t-131)/14)*(1-ease((t-179)/7));if(!show)return;
  ctx.save();ctx.translate(x,y);
  for(let n=0;n<3;n++){
   const a=n*TAU/3+t*.053,r=mix(86,154,show);
   ctx.save();ctx.translate(Math.cos(a)*r,Math.sin(a)*r*.51);
   ctx.rotate(a*.77);ctx.globalAlpha=show;
   ctx.fillStyle='#261839';ctx.strokeStyle=colors[n];ctx.lineWidth=5;
   ctx.beginPath();ctx.arc(0,0,25,0,TAU);ctx.fill();ctx.stroke();
   ctx.beginPath();ctx.moveTo(-11,0);ctx.lineTo(0,-11);ctx.lineTo(11,0);ctx.lineTo(0,11);ctx.closePath();ctx.fillStyle=colors[n];ctx.fill();
   ctx.restore();
  }
  ctx.restore();
 }
 function speedInk(t,x,y,power){
  if(power<=0)return;
  ctx.save();ctx.translate(x,y);
  for(let n=0;n<32;n++){
   const a=n*TAU/32+Math.sin(n*34)*.1;
   const r=172+(n%7)*43+(t-178)*6.7;
   const size=37+n%11*19;
   ctx.save();ctx.rotate(a);
   ctx.globalAlpha=power*(.45+n%5*.12);
   ctx.fillStyle=n%4===0?'#100b22':colors[n%3];
   ctx.beginPath();ctx.moveTo(r,0);ctx.lineTo(r+size,2+n%7);ctx.lineTo(r+size,-2-n%4);ctx.closePath();ctx.fill();
   ctx.restore();
  }
  ctx.restore();
 }
 function partner(t,tx,ty){
  const alpha=ease((t-47)/19)*(1-ease((t-192)/21));if(!alpha)return;
  const slide=ease((t-137)/37),x=1243-slide*90,y=630-Math.sin(slide*Math.PI)*52;
  art.grid('shiki',t<93?0:t<141?1:2,3,1,x,y,333,{face:-1,alpha});
  if(t<77)return;
  const launch=ease((t-79)/20),final=ease((t-149)/32),exit=ease((t-187)/19);
  const cx=mix(x-86,tx+35,launch)-final*73,cy=mix(y-141,ty-176,launch)-Math.sin(launch*Math.PI)*124-final*47;
  const size=140+final*198;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.24+final*.49);ctx.scale(-1,1);
  art.image('cat',-size/2,-size/2,size,size,alpha*(1-exit));ctx.restore();
 }
 function cutin(t,time){
  if(t>=31)return;
  const a=ease(t/5)*(1-ease((t-24)/7)),s=1+time*.001;
  ctx.save();ctx.beginPath();ctx.moveTo(0,97);ctx.lineTo(W,59);ctx.lineTo(W,688);ctx.lineTo(0,750);ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,a);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=NekuLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const hit=t>=183?unit(1-(t-183)/12):0;
  const fusion=ease((t-176)/10)*(1-ease((t-191)/29));
  frameClip();ctx.fillStyle='#1a142b';ctx.fillRect(0,0,W,H);
  art.image('court',-113-t*.15,-80,W+283,H+145);
  ctx.save();if(face===-1){ctx.translate(W,0);ctx.scale(-1,1);}panels(t);ctx.restore();
  world(cx,cy,z,roll,face,t,Math.max(hit,fusion*.72));
  partner(t,tx,ty);
  target(opponent,tx,ty,.10+hit*.66-ease((t-192)/30)*1.30);
  art.grid('poses',index,3,2,x,y,350);
  badges(t,x+145,y-161);
  const psychic=ease((t-43)/7)*(1-ease((t-58)/16));
  art.effect(0,793,484,790,246,psychic,-.13);
  const lightning=Math.max(ease((t-61)/7)*(1-ease((t-73)/14)),ease((t-113)/9)*(1-ease((t-126)/13)));
  art.effect(1,841,478,654,244,lightning);
  const punch=ease((t-94)/7)*(1-ease((t-101)/17));
  art.effect(2,tx,ty-120,493,322,punch,-.13,-1);
  if(fusion>0){
   art.effect(1,921,484,1100,323,fusion*.70);
   art.effect(3,1015,485,811+fusion*400,500+fusion*245,fusion*.80);
   speedInk(t,1003,492,fusion*.98);
  }
  ctx.restore();flash('255,219,176',hit*.22+fusion*.10);
  bands(t,'#160d24');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/NekuLimitProfile.contactHold;
  art.effect(0,x,y,163+52*p,99,1-p*.62,-.12,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

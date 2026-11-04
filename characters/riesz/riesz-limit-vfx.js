'use strict';
const RieszLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('riesz',['cutin','court','sky','poses','rocks','effects']);
 const shots=[
  [0,447,647,872,622,675,459,1.13,-.026,0],
  [34,488,647,878,624,694,447,1.21,.022,1],
  [54,546,641,912,623,710,449,1.12,-.034,2],
  [78,493,645,932,559,717,419,.98,-.061,0],
  [97,523,613,953,480,754,411,.93,.031,3],
  [115,578,521,952,470,752,360,.91,-.074,3],
  [134,605,440,966,451,735,347,1.10,-.095,4],
  [153,639,432,969,466,771,365,1.02,.08,4],
  [174,683,535,977,585,822,416,.97,.049,3],
  [189,721,620,987,608,881,469,1.20,-.06,2],
  [204,733,648,1071,546,908,463,1.04,.033,5],
  [224,743,650,1301,388,923,448,.91,-.031,5],
  [254,745,651,1518,268,930,454,.89,0,5]
 ];
 function swirl(t,x,y,weight){
  if(weight<=0)return;
  ctx.save();ctx.translate(x,y);
  for(let n=0;n<6;n++){
   const phase=t*.067+n*1.06,r=68+n*37;
   ctx.strokeStyle=n%3?'#affef2':'#fff0b8';ctx.lineWidth=1.8+(n%3);
   ctx.globalAlpha=weight*(.56-n*.045);
   ctx.beginPath();
   for(let j=0;j<=42;j++){
    const q=j/42,a=phase+q*TAU*.87,s=r*(.4+.6*q);
    const px=Math.cos(a)*s,py=-n*61-q*115+Math.sin(a)*s*.20;
    if(j===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
   }
   ctx.stroke();
  }
  ctx.restore();
 }
 function stone(n,x,y,h,rotation,alpha=1){
  ctx.save();ctx.translate(x,y);ctx.rotate(rotation);
  art.grid('rocks',n%3,3,1,0,0,h,{anchorY:.5,alpha});ctx.restore();
 }
 function lift(t,x,y){
  const strength=ease((t-61)/28)*(1-ease((t-131)/20));
  if(!strength)return;
  for(let n=0;n<14;n++){
   const a=t*.081+n*2.39996,age=(t-61+n*6)%90/90,r=79+age*147;
   stone(n,x+Math.cos(a)*r,y-age*632+Math.sin(a)*51,34+n%4*14, a,strength*(.32+Math.sin(a)*.22+age*.55));
  }
 }
 function fall(t,x,y){
  for(let n=0;n<9;n++){
   const start=148+n*4+(n%3)*3,p=(t-start)/(20+n%3*5);
   if(p<0||p>=1.28)continue;
   const lateral=Math.sin(n*2.39996)*360,px=x+lateral*(1-p*.68),py=y-730+735*p*p;
   if(p<1){
    stone(n,px,py,61+n%4*27,n+t*.052);
    art.effect(0,px-lateral*.10,py-105,212,51,unit(p*3)*.57,Math.PI*.46);
   }else art.effect(3,x+lateral*.32,y-22,245,113,unit((1.28-p)/.28)*.73);
  }
 }
 function lastMeteor(t,x,y){
  const p=(t-165)/23;
  if(p<0||p>=1)return;
  const px=x+245*(1-p),py=y-940*(1-p*p);
  art.effect(0,px+43,py-145,470,96,ease(p*2)*.82,1.27);
  stone(1,px,py,200+130*p,-.31+p*1.39);
 }
 function cutin(t,time){
  if(t>=31)return;
  const s=1+time*.001,alpha=ease(t/5)*(1-ease((t-24)/7));
  ctx.save();ctx.beginPath();ctx.moveTo(0,117);ctx.lineTo(W,55);ctx.lineTo(W,691);ctx.lineTo(0,752);ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,alpha);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=RieszLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const gust=ease((t-48)/43)*(1-ease((t-169)/27));
  const sky=ease((t-107)/18)*(1-ease((t-158)/16));
  const strike=ease((t-181)/7)*(1-ease((t-196)/26));
  const impact=t>=187?unit(1-(t-187)/15):0;
  frameClip();ctx.fillStyle='#25455a';ctx.fillRect(0,0,W,H);
  art.image('court',-105-t*.16,-78+sky*105,W+250,H+178);
  art.image('sky',-87,-38+(1-sky)*57,W+180,H+95,sky);
  ctx.fillStyle='rgba(12,34,67,'+(strike*.23)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact,strike*.57));
  art.effect(1,912,344,370+gust*380,420+gust*375,gust*.68);
  swirl(t,914,628,gust);lift(t,913,627);
  target(opponent,tx,ty,.15+gust*.34-impact*.73-ease((t-198)/23));
  art.grid('poses',index,3,2,x,y,346);
  fall(t,1000,628);lastMeteor(t,996,550);
  const thrust=ease((t-48)/6)*(1-ease((t-56)/14));
  art.effect(0,tx-59,ty-125,600,190,thrust,.03);
  art.effect(2,996,375,576+strike*310,529+strike*321,strike*.82,.02);
  art.effect(3,997,632,773+strike*460,228+strike*110,strike*.86);
  ctx.restore();flash('231,252,197',impact*.23);bands(t,'#101e2e');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/RieszLimitProfile.contactHold;
  art.effect(0,x,y,165+50*p,87,1-p*.56,-.09,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

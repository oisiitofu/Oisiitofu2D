'use strict';
const ElliotLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('elliot',['cutin','court','past','poses','fei','effects']);
 const shots=[
  [0,462,653,915,622,692,454,1.14,-.037,0],
  [34,488,649,910,624,714,456,1.20,.035,0],
  [56,520,648,918,621,739,448,1.10,-.039,0],
  [78,649,640,938,616,811,440,1.06,.063,1],
  [94,765,619,958,602,866,438,1.15,.055,1],
  [110,818,553,973,592,896,421,.99,-.079,2],
  [126,1050,543,989,597,963,423,1.04,.068,3],
  [142,1061,618,1006,570,979,446,1.13,-.066,4],
  [159,1094,625,1027,580,989,438,1.05,-.049,4],
  [176,1093,583,1010,587,962,420,1.10,.079,3],
  [189,1102,620,1010,595,997,448,1.19,-.071,4],
  [202,1072,648,1215,450,1003,448,1.04,.026,5],
  [226,1046,650,1396,333,1012,453,.93,-.026,5],
  [251,1042,650,1551,243,1024,456,.93,0,5]
 ];
 function past(t,face){
  if(t<73)return;
  const swap=ease((t-73)/38),returning=ease((t-223)/29);
  const size=swap*(1-returning),x=W*(face===1?.63:.37),y=H*.50;
  if(!size)return;
  ctx.save();ctx.beginPath();ctx.ellipse(x,y,5+size*1320,10+size*940,0,0,TAU);ctx.clip();
  art.image('past',-101,-85,W+230,H+157);
  ctx.restore();
  const rim=ease((t-75)/9)*(1-ease((t-96)/15));
  if(!rim)return;
  ctx.save();ctx.globalAlpha=rim;
  ctx.strokeStyle='#c4fdf0';ctx.lineWidth=4+rim*8;
  ctx.beginPath();ctx.ellipse(x,y,5+size*1320,10+size*940,0,0,TAU);ctx.stroke();ctx.restore();
 }
 function fairy(t,x,y){
  const open=ease((t-37)/31),aim=ease((t-115)/47);
  const fx=mix(x+113,867,open)-aim*230,fy=mix(y-222,400,open)-aim*60+Math.sin(t*.17)*12;
  const artIndex=t<38?0:t<113?1:2;
  art.grid('fei',artIndex,3,1,fx,fy,153,{anchorY:.51});
  return [fx,fy];
 }
 function fragments(t,x,y,power){
  if(!power)return;
  ctx.save();
  for(let n=0;n<30;n++){
   const a=n*2.39996,p=unit((t-178-n%4)/37),r=31+p*(139+n%7*61),size=3+n%8;
   ctx.save();ctx.translate(x+Math.cos(a)*r,y+Math.sin(a)*r*.49-p*80);ctx.rotate(a+t*.04);
   ctx.globalAlpha=power*(1-p)*.83;ctx.fillStyle=n%2?'#f6cd83':'#a1efff';
   ctx.beginPath();ctx.moveTo(-size,0);ctx.lineTo(0,-size*1.8);ctx.lineTo(size,0);ctx.lineTo(0,size*1.4);ctx.closePath();ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  if(t>=30)return;
  const s=1+time*.001,a=ease(t/5)*(1-ease((t-23)/7));
  ctx.save();ctx.beginPath();ctx.moveTo(0,108);ctx.lineTo(W,65);ctx.lineTo(W,687);ctx.lineTo(0,755);ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,a);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=ElliotLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const gate=ease((t-46)/26)*(1-ease((t-104)/24));
  const hit=t>=187?unit(1-(t-187)/14):0;
  const final=ease((t-179)/9)*(1-ease((t-196)/29));
  frameClip();ctx.fillStyle='#26343b';ctx.fillRect(0,0,W,H);
  art.image('court',-95-t*.15,-79,W+251,H+143);past(t,face);
  world(cx,cy,z,roll,face,t,Math.max(hit,gate*.38));
  art.effect(1,866,437,570+gate*186,637+gate*86,gate*.87);
  target(opponent,tx,ty,-.12+hit*.50-ease((t-193)/27)*1.02);
  const vanishes=ease((t-87)/11)*(1-ease((t-103)/11));
  art.grid('poses',index,3,2,x,y,352,{face:t>=126&&t<190?-1:1,alpha:1-vanishes*.85});
  const [fx,fy]=fairy(t,x,y);
  const slash=ease((t-126)/8)*(1-ease((t-140)/19));
  art.effect(0,tx-38,ty-115,730,296,slash*.86,-.16,-1);
  const flight=ease((t-172)/13),arrow=flight*(1-ease((t-187)/14)),dx=tx-fx,dy=ty-113-fy;
  art.effect(2,mix(fx,tx,flight),mix(fy,ty-113,flight),370,99,arrow*.97,Math.atan2(dy,dx));
  art.effect(0,1008,504,1020+final*320,295+final*100,final*.73,.16,-1);
  art.effect(3,1002,486,881+final*421,475+final*177,final*.72);
  fragments(t,1006,495,final);
  ctx.restore();flash('216,252,237',hit*.22+gate*.09);
  bands(t,'#15232b');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/ElliotLimitProfile.contactHold;
  art.effect(0,x,y,157+56*p,95,1-p*.59,-.09,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

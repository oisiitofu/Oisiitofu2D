'use strict';
const Zero3LimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('zero3',['cutin','court','poses','dragon','effects']);
 const shots=[
  [0,469,654,906,627,679,451,1.06,-.035,0],
  [34,513,652,898,628,683,452,1.16,.025,1],
  [58,471,486,916,622,664,418,.95,-.062,2],
  [83,521,398,920,620,704,379,.88,-.088,2],
  [112,612,371,947,618,761,378,.90,.034,2],
  [137,645,392,986,618,785,404,.96,.025,2],
  [157,678,429,1001,607,810,417,1.01,.05,3],
  [174,756,420,1004,606,825,423,1.04,-.055,3],
  [186,871,514,1008,603,895,443,1.14,-.09,3],
  [197,969,644,1025,610,966,461,1.27,.064,4],
  [212,1013,647,1140,492,975,446,.98,.042,4],
  [232,1011,653,1320,385,976,449,.88,-.023,5],
  [261,1005,654,1580,258,997,460,.89,0,5]
 ];
 function song(t,x,y){
  ctx.save();ctx.translate(x,y);
  for(const at of [87,102,117,129]){
   const p=(t-at)/36;
   if(p<0||p>=1)continue;
   ctx.save();ctx.rotate(-.56+at*.01);ctx.scale(1,.48);
   ctx.strokeStyle='#ffe6da';ctx.shadowColor='#ff8d9d';ctx.shadowBlur=13;
   ctx.globalAlpha=(1-p)*.9;ctx.lineWidth=2+(1-p)*4;
   for(const offset of [0,17]){ctx.beginPath();ctx.arc(0,0,90+p*420+offset,0,TAU);ctx.stroke();}
   ctx.restore();
  }
  ctx.restore();
 }
 function petals(t,x,y,power){
  if(power<=0)return;
  ctx.save();
  for(let n=0;n<54;n++){
   const age=(t+n*6.72)%61/61,theta=n*2.39996;
   const speed=age*(110+n%9*46),rise=age*(220+n%8*29);
   ctx.save();ctx.translate(x+Math.cos(theta)*speed,y-rise+Math.sin(theta)*speed*.38);ctx.rotate(theta+t*.08);
   ctx.globalAlpha=power*(1-age)*.86;ctx.fillStyle=n%3?'#f47a96':'#fff0e6';
   ctx.beginPath();ctx.moveTo(-8,0);ctx.quadraticCurveTo(4,-12,12,0);ctx.quadraticCurveTo(4,8,-8,0);ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  if(t>=30)return;
  const s=1+time*.0011,alpha=ease(t/6)*(1-ease((t-23)/7));
  ctx.save();ctx.beginPath();ctx.moveTo(0,112);ctx.lineTo(W,69);ctx.lineTo(W,704);ctx.lineTo(0,758);ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,alpha);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=Zero3LimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const impact=t>=194?unit(1-(t-194)/16):0;
  const bloom=ease((t-201)/12)*(1-ease((t-224)/25));
  const breath=ease((t-131)/9)*(1-ease((t-154)/14));
  frameClip();ctx.fillStyle='#1b121b';ctx.fillRect(0,0,W,H);
  const rise=ease((t-40)/61)*(1-ease((t-166)/50));
  art.image('court',-102-t*.16,-112+rise*94,W+293,H+161);
  world(cx,cy,z,roll,face,t,Math.max(impact,bloom*.65,breath*.35));
  const flight=ease((t-34)/20)*(1-ease((t-169)/25));
  const drX=x-105+ease((t-136)/29)*79,drY=y+119-ease((t-137)/38)*152;
  art.grid('dragon',t<78?0:t<132?1:2,3,1,drX,drY,480+rise*62,{anchorY:.72,alpha:flight});
  song(t,tx,ty-151);
  target(opponent,tx,ty,-.10+breath*.22-impact*.51-ease((t-201)/26)*1.08);
  if(breath>0){
   const fromX=drX+197,fromY=drY-213;
   const dx=tx-fromX,dy=ty-88-fromY;
   art.effect(1,fromX+dx*.54,fromY+dy*.54,Math.hypot(dx,dy)*1.53,264,breath,Math.atan2(dy,dx));
   art.effect(3,tx,ty-45,340,264,breath*.64);
  }
  art.grid('poses',index,3,2,x,y,345);
  if(t>=176&&t<218){
   const slash=ease((t-176)/12)*(1-ease((t-195)/23));
   art.effect(0,tx-45,ty-105,1040+slash*380,462,slash,.72);
  }
  art.effect(2,1040,480,745+bloom*320,596+bloom*210,bloom*.88);
  art.effect(3,1041,615,899+bloom*230,294+bloom*170,bloom*.91);
  petals(t,1018,655,bloom*.93+breath*.23);
  ctx.restore();
  flash('255,200,178',impact*.29+bloom*.12);
  bands(t,'#100b13');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/Zero3LimitProfile.contactHold;
  art.effect(0,x,y,162+55*p,89,1-p*.58,-.2,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const RinLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('rin',['cutin','court','poses','effects']);
 const shots=[
  [0,548,657,865,620,715,451,1.18,-.026,0],
  [39,579,650,939,604,747,440,1.14,.043,0],
  [64,586,647,959,612,740,432,1.23,-.035,1],
  [96,553,654,966,613,744,447,1.16,.021,2],
  [119,573,650,975,615,757,431,1.12,-.039,2],
  [132,672,646,985,614,824,429,1.06,.028,3],
  [144,814,639,1040,579,883,424,1.10,-.032,3],
  [152,968,638,1131,550,955,429,1.12,.034,4],
  [160,1123,638,1188,510,999,423,.98,-.032,4],
  [176,1154,641,1375,390,1032,413,.93,.013,5],
  [206,1158,642,1538,231,1018,435,.96,.004,5],
  [230,1159,644,1722,189,1032,447,.94,0,5]
 ];
 function wake(t,opacity){
  if(!opacity)return;
  for(const delay of [13,9,5]){
   const [x,y,,,,,,,pose]=camera(shots,t-delay);
   art.grid('poses',pose,3,2,x,y,386,{alpha:opacity*(.49-delay*.021)});
  }
 }
 function petals(t,force){
  if(!force)return;
  ctx.save();
  for(let i=0;i<35;i++){
   const speed=4+i%8*2.1,cycle=(t*speed+i*117)%1780;
   const x=-148+cycle,y=175+i%10*53+Math.sin(i+t*.043)*47;
   ctx.save();ctx.translate(x,y);ctx.rotate(i*2.39996+t*.17);
   ctx.globalAlpha=force*(.31+i%5*.11);ctx.fillStyle=i%3?'#d1df6f':'#fff5ad';
   ctx.beginPath();ctx.ellipse(0,0,3+i%3,9+i%6,0,0,TAU);ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  const s=1.036+time*.001,opacity=ease(t/4)*(1-ease((t-23)/9));
  if(!opacity)return;
  ctx.save();ctx.beginPath();ctx.moveTo(0,152);ctx.lineTo(W,86);ctx.lineTo(W,652);ctx.lineTo(0,725);
  ctx.closePath();ctx.clip();
  art.portrait(s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=RinLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const cut=ease((t-150)/5)*(1-ease((t-160)/22));
  const breeze=ease((t-82)/48)*(1-ease((t-170)/37));
  const sprint=ease((t-121)/12)*(1-ease((t-153)/17));
  frameClip();ctx.fillStyle='#253733';ctx.fillRect(0,0,W,H);
  art.image('court',-105-ease((t-124)/46)*103,-100+ease((t-48)/78)*43,W+315,H+161);
  world(cx,cy,z,roll,face,t,cut);
  const grass=ease((t-95)/37)*(1-ease((t-178)/29));
  art.glow(2,699,581,1312,271,grass*.75,.03);
  target(opponent,tx,ty,-.06+Math.sin(t*.14)*.08-ease((t-156)/29)*1.36);
  wake(t,sprint);art.grid('poses',index,3,2,x,y,386);
  const early=ease((t-39)/4)*(1-ease((t-45)/13));
  art.strike(0,859,484,340,226,early*.87,-.23);
  art.glow(1,x-154,y-140,537,152,sprint*.91,.01);
  art.strike(0,1167,456,444+cut*197,315+cut*75,cut*.78,-.18);
  art.strike(3,1148,443,388+cut*376,334+cut*213,cut*.76);
  const edge=ease((t-154)/6)*(1-ease((t-169)/30));
  art.glow(1,1168,446,767+edge*419,125+edge*31,edge*.84,-.05);
  petals(t,breeze*.69);
  ctx.restore();flash('220,246,159',cut*.15);bands(t,'#18241d');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/RinLimitProfile.contactHold;
  art.strike(0,x,y,150+48*p,134,1-p*.52,-.25,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const OdioLimitVFX=(()=>{
 const {assets,ease,unit,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('odio',['cutin','court','poses','sin','effects']);
 const shots=[
  [0,472,653,915,624,713,453,1.18,-.042,0],
  [33,534,648,921,620,732,455,1.16,.032,1],
  [56,550,650,935,622,732,449,1.20,-.045,2],
  [78,560,647,949,614,753,420,1.01,.057,2],
  [99,554,612,962,606,756,387,.86,-.049,3],
  [121,575,572,981,606,772,367,.79,.035,3],
  [145,602,578,1004,583,796,402,.90,.061,3],
  [161,628,600,1000,612,807,433,1.00,-.060,3],
  [182,656,612,997,610,823,435,1.12,.057,4],
  [196,665,622,1059,568,852,445,1.08,-.069,4],
  [211,664,644,1258,438,867,437,.94,.029,5],
  [236,675,649,1480,303,904,451,.87,-.026,5],
  [257,677,652,1603,258,916,458,.89,0,5]
 ];
 function fractures(t,x,y,power){
  if(!power)return;
  ctx.save();ctx.translate(x,y);ctx.scale(1,.33);
  for(let n=0;n<10;n++){
   const a=n*TAU/10+.07;ctx.save();ctx.rotate(a);
   ctx.strokeStyle=n%3?'#ff7556':'#ffd0ac';ctx.globalAlpha=power*(.72+n%4*.072);
   ctx.lineWidth=n%3?2.5:4.5;ctx.beginPath();ctx.moveTo(0,0);
   for(let j=1;j<=8;j++){
    const reach=j*(57+n%4*13),k=(n*46+j*31)%79;
    ctx.lineTo(reach,(k-39)*(j*.22+1));
   }
   ctx.stroke();ctx.restore();
  }
  ctx.restore();
 }
 function embers(t,x,y,power){
  if(!power)return;
  ctx.save();
  for(let n=0;n<66;n++){
   const life=((t+n*7.77)%53)/53,a=n*2.39996,r=65+life*(229+n%11*33);
   ctx.save();ctx.translate(x+Math.cos(a)*r,y-life*(260+n%6*61)+Math.sin(a)*r*.35);
   ctx.rotate(a+t*.04);ctx.globalAlpha=power*(1-life)*.81;
   ctx.fillStyle=n%5===0?'#f5b973':n%4===0?'#c54883':'#f85443';
   const size=3+n%8;ctx.fillRect(-size,0,size*2,size*.52);ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  if(t>=30)return;
  const s=1+time*.001,opacity=ease(t/5)*(1-ease((t-23)/7));
  ctx.save();ctx.beginPath();ctx.moveTo(0,113);ctx.lineTo(W,62);ctx.lineTo(W,696);ctx.lineTo(0,755);ctx.closePath();ctx.clip();
  art.portrait(s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=OdioLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const quake=ease((t-53)/17)*(1-ease((t-100)/20));
  const aura=ease((t-80)/34)*(1-ease((t-184)/16));
  const contact=t>=181?unit(1-(t-181)/16):0;
  const blast=ease((t-180)/12)*(1-ease((t-199)/31));
  frameClip();ctx.fillStyle='#1e1023';ctx.fillRect(0,0,W,H);
  const low=ease((t-52)/47)*(1-ease((t-211)/32));
  art.image('court',-94-t*.17,-115+low*91,W+257,H+192);
  ctx.fillStyle='rgba(14,5,25,'+(low*.35)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(contact,quake*.59,blast*.51));
  art.glow(1,925,386,580+aura*400,531+aura*244,aura*.50);
  const sin=ease((t-87)/31)*(1-ease((t-209)/25));
  const press=ease((t-138)/36);
  art.grid('sin',t<153?0:1,2,1,900+press*63,612+press*23,609+press*90,{anchorY:.95,alpha:sin});
  fractures(t,994,644,Math.max(quake*.63,blast*.9));
  const hit=ease((t-144)/8)*(1-ease((t-153)/22));
  art.strike(3,tx,ty-109,510,358,hit*.69,-.14);
  target(opponent,tx,ty,-.16+hit*.51+contact*.54-ease((t-192)/25)*1.12);
  const corporeal=1-sin*.59;
  art.grid('poses',index,3,2,x,y,352,{alpha:corporeal});
  art.glow(0,tx-54,ty-109,657,214,quake*.46,-.14);
  art.strike(2,1002,359,310+blast*222,744+blast*206,blast*.83);
  art.strike(3,1000,567,690+blast*504,457+blast*260,blast*.79);
  embers(t,998,633,Math.max(sin*.62,blast));
  ctx.restore();flash('255,174,145',contact*.21+blast*.11);
  bands(t,'#120a16');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/OdioLimitProfile.contactHold;
  art.strike(0,x,y,162+52*p,99,1-p*.62,-.10,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

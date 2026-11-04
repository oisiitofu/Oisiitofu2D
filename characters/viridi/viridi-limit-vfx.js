'use strict';
const ViridiLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('viridi',['cutin','court','forest','poses','bomb','effects']);
 const shots=[
  [0,525,653,878,625,713,445,1.17,-.034,0],
  [45,510,644,957,625,753,438,1.12,.032,0],
  [65,505,646,992,613,787,432,1.08,-.027,0],
  [93,492,636,998,620,781,369,.98,.034,1],
  [119,459,639,1005,624,779,319,.87,-.027,1],
  [146,451,643,1006,624,784,341,.90,.036,2],
  [170,474,649,1006,625,817,412,.99,-.039,3],
  [183,471,652,1012,615,841,418,1.02,.037,3],
  [199,482,569,1151,418,842,413,.96,-.019,4],
  [226,489,573,1417,289,848,433,.92,.016,4],
  [253,526,624,1641,205,849,451,.91,.008,5],
  [278,531,634,1770,187,851,457,.91,0,5]
 ];
 function petals(t,power){
  if(power<=0)return;
  ctx.save();
  for(let i=0;i<54;i++){
   const life=(t*.014+i*.618034)%1,dir=i*2.39996;
   const x=1030+Math.cos(dir)*life*(460+i%11*41),y=586-Math.sin(dir)*life*369-life*195;
   const size=3+i%8;
   ctx.save();ctx.translate(x,y);ctx.rotate(dir+life*11);
   ctx.globalAlpha=power*(1-life*.79);ctx.fillStyle=['#ffa6c7','#e6669b','#e3fc91','#c1f179'][i%4];
   ctx.beginPath();ctx.ellipse(0,0,size*1.58,size*.71,0,0,TAU);ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=ViridiLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const snare=ease((t-49)/10)*(1-ease((t-156)/13));
  const fall=ease((t-101)/69),drop=ease((t-102)/15)*(1-ease((t-168)/7));
  const impact=ease((t-169)/7)*(1-ease((t-185)/34));
  const wave=ease((t-175)/9)*(1-ease((t-191)/32));
  frameClip();ctx.fillStyle='#272d24';ctx.fillRect(0,0,W,H);
  art.image('court',-121-t*.17,-95,W+310,H+157);
  art.image('forest',-121-t*.17,-95,W+310,H+157,ease((t-171)/36));
  world(cx,cy,z,roll,face,t,Math.max(impact,wave*.55));
  art.grid('poses',index,3,2,x,y,310);
  target(opponent,tx,ty,-.13-ease((t-177)/49)*1.6);
  art.strike(0,920,556,483+snare*178,215+snare*108,snare*.87,-.09);
  if(drop>0){
   const bx=mix(1190,1011,fall),by=mix(-357,570,fall),size=mix(142,490,fall);
   art.glow(1,bx+74,by-size*.28,size*1.46,size*2.21,drop*.72,-.18);
   ctx.save();ctx.translate(bx,by);ctx.rotate(.17-fall*.28);
   art.grid('bomb',0,1,1,0,0,size,{anchorY:.60,alpha:drop});ctx.restore();
  }
  art.strike(2,1024,473,457+impact*651,362+impact*352,impact*.97);
  art.strike(3,1065,566,650+wave*680,284+wave*155,wave*.87,-.08);
  petals(t,Math.max(wave*.87,ease((t-188)/25)*(1-ease((t-246)/30))*.84));
  ctx.restore();flash('255,212,212',Math.max(impact*.24,wave*.10));bands(t,'#211521');
  const opacity=ease(t/4)*(1-ease((t-25)/8));
  if(opacity){
   ctx.save();ctx.beginPath();ctx.moveTo(0,95);ctx.lineTo(W,152);ctx.lineTo(W,717);ctx.lineTo(0,662);ctx.closePath();ctx.clip();
   art.portrait(1.021+time*.0011,opacity);ctx.restore();
  }
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,152+time*4,108,1-time/ViridiLimitProfile.contactHold*.59,-.13,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const FaytLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('fayt',['cutin','court','poses','effects']);
 const shots=[
  [0,536,651,908,612,731,443,1.19,-.047,0],
  [34,541,650,951,582,742,429,1.15,.04,1],
  [58,510,587,980,566,720,391,1.04,-.025,2],
  [91,438,520,1002,567,732,362,.98,.051,2],
  [121,440,534,1009,449,722,374,.9,-.049,3],
  [145,428,533,1014,426,693,384,1.07,-.019,3],
  [158,425,535,1020,432,754,384,1.02,.083,4],
  [180,450,540,1063,440,778,394,.95,-.036,4],
  [193,469,566,1147,411,803,406,1.01,-.05,4],
  [222,493,638,1481,278,836,439,.94,.017,5],
  [252,507,648,1684,188,841,448,.96,0,5]
 ];
 function filaments(t,x,y,charge,beam){
  ctx.save();ctx.globalCompositeOperation='screen';ctx.lineCap='round';
  for(let i=0;i<17;i++){
   const angle=i*2.39996+t*.06,reach=(103+i%5*24)*(1-charge*.56);
   const pulse=Math.pow((Math.sin(t*.22+i)+1)*.5,3);
   const dx=Math.cos(angle)*reach,dy=Math.sin(angle)*reach*.78;
   ctx.globalAlpha=(charge*(1-beam))*pulse*.83;ctx.strokeStyle=i%2?'#9ee9ff':'#b6a6ff';
   ctx.lineWidth=1+i%3;ctx.beginPath();ctx.moveTo(x+dx,y+dy);
   ctx.quadraticCurveTo(x+dx*.6-dy*.35,y+dy*.6+dx*.35,x+dx*.17,y+dy*.17);ctx.stroke();
  }
  if(beam>0){
   for(let i=0;i<9;i++){
    const phase=unit((t-151-i*2)/26),px=x+60+phase*1135;
    ctx.globalAlpha=beam*(1-phase)*.55;ctx.strokeStyle=i%2?'#a2f8ff':'#a984ff';ctx.lineWidth=2+i%3;
    ctx.beginPath();ctx.ellipse(px,y,17+i%4*4,51+i%3*22,.14,0,TAU);ctx.stroke();
   }
  }
  ctx.restore();
 }
 function cutin(t,time){
  const s=1.04+time*.0009,opacity=ease(t/4)*(1-ease((t-23)/9));
  if(!opacity)return;
  ctx.save();ctx.beginPath();ctx.moveTo(0,107);ctx.lineTo(W,145);ctx.lineTo(W,720);ctx.lineTo(0,669);
  ctx.closePath();ctx.clip();
  art.portrait(s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=FaytLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const wings=ease((t-49)/28)*(1-ease((t-201)/31));
  const charge=ease((t-90)/53)*(1-ease((t-151)/11));
  const beam=ease((t-149)/6)*(1-ease((t-178)/15));
  const blast=ease((t-177)/8)*(1-ease((t-188)/32));
  const shock=Math.max(beam*.54,blast);
  frameClip();ctx.fillStyle='#07172d';ctx.fillRect(0,0,W,H);
  art.image('court',-110-t*.16,-102+ease((t-43)/81)*46,W+284,H+162);
  world(cx,cy,z,roll,face,t,shock);
  const spread=ease((t-52)/33),pulse=Math.sin(t*.14)*.035;
  art.glow(0,x-25,y-198,(285+spread*380)*(1+pulse),196+spread*186,wings*.90,-.08);
  target(opponent,tx,ty,-.17-beam*.30-ease((t-181)/22)*1.08);
  art.grid('poses',index,3,2,x,y,369);
  const bx=x+110+beam*46,by=y-178,extension=ease((t-149)/11),length=178+extension*1280;
  filaments(t,bx,by,charge,beam);
  art.glow(2,bx,by,117+charge*145,106+charge*136,charge*.96,t*.07);
  art.strike(1,bx+length*.43,by,length,134+beam*188,beam*.99);
  art.strike(3,1161,363,415+blast*747,255+blast*309,blast*.84);
  ctx.restore();flash('175,214,255',shock*.19);
  bands(t,'#081122');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/FaytLimitProfile.contactHold;
  art.strike(3,x,y,155+64*p,129,1-p*.64,-.22,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

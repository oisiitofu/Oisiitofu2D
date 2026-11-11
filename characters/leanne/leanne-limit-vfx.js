"use strict";

const LeanneLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('leanne',['cutin','court','poses','motion','finish','effects']);
 const shots=[
  [0,443,741,913,720,710,411,.93,0,1],
  [30,443,741,913,720,710,411,.93,0,1],
  [54,492,741,909,715,755,402,.94,-.008,1],
  [72,635,567,932,708,799,360,.87,-.015,2],
  [85,774,438,952,682,868,317,.82,.008,2],
  [98,813,370,1009,656,928,283,.78,.015,2],
  [111,1030,373,959,640,980,281,.77,0,3],
  [122,1158,413,941,653,1035,315,.79,.012,3],
  [135,1259,480,919,666,1061,348,.81,0,9],
  [151,1355,592,892,675,1108,371,.84,-.015,9],
  [170,1394,741,886,685,1132,426,.85,.015,4],
  [180,1435,741,876,691,1135,426,.85,.01,5],
  [208,1530,741,874,716,1202,429,.85,-.01,10],
  [228,1530,741,876,723,1200,421,.87,0,6],
  [247,1510,741,875,724,1195,421,.88,0,7],
  [267,1510,741,875,724,1191,413,.91,0,-8],
  [287,1510,741,875,724,1191,413,.91,-.008,-8],
  [293,1510,741,869,710,1180,412,.88,.013,11],
  [306,1514,741,643,560,1111,403,.77,0,11],
  [328,1515,741,377,418,1005,393,.74,0,12],
  [351,1515,741,240,314,940,398,.73,0,12]
 ];
 const poseAtlases=['poses','motion','finish'];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function drawTracer(t,hit,x,y,tx,ty){
  const opacity=pulse(t,hit,5,5);
  if(opacity<=0)return;
  const [offsetX,offsetY]=hit<=98?[129,-271]:hit===122?[-143,-281]:[-173,-163];
  const fromX=x+offsetX,fromY=y+offsetY;
  const toX=tx-Math.sign(offsetX)*32,toY=ty-178;
  const progress=ease((t-hit+5)/5);
  const angle=Math.atan2(toY-fromY,toX-fromX);
  const width=Math.min(325,Math.max(140,Math.hypot(toX-fromX,toY-fromY)+95));
  art.strike(0,mix(fromX,toX,progress),mix(fromY,toY,progress),width,148,opacity,angle);
 }

 function confirmTracer(x,y,tx,ty,opacity){
  ctx.save();
  ctx.globalAlpha=opacity;
  ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(tx,ty);
  for(const [color,width] of [['#4d2417',32],['#ff9d3a',17],['#fff1bd',5]]){
   ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
  }
  ctx.restore();
 }

 function draw({target:opponent,face,time}){
  const t=LeanneLimitProfile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,number]=camera(shots,t);
  const pose=Math.abs(number)-1;
  const burst=Math.max(...LeanneLimitProfile.bursts.map(hit=>pulse(t,hit,2,7)));
  const charged=ease((t-72)/84)*(1-ease((t-292)/14));
  const slide=pulse(t,181,13,27);
  const confirm=pulse(t,293,3,23);
  frameClip();
  ctx.fillStyle='#0f1b25';ctx.fillRect(0,0,W,H);
  art.image('court',-80-cx*.027,-66-cy*.04,W+230,H+135);
  world(cx,cy,zoom,roll,face,t,Math.max(burst*.29,slide*.19,confirm));

  target(opponent,tx,ty-burst*9,-.11-burst*.19+ease((t-294)/27)*1.33,2.92);
  art.glow(1,tx,ty-178,362,322,charged*.31);
  for(const hit of LeanneLimitProfile.bursts)drawTracer(t,hit,x,y,tx,ty);
  art.strike(1,tx,ty-178,310+charged*65,270+charged*58,burst);
  art.strike(2,x-105,y-20,420,215,slide);
  art.grid(poseAtlases[Math.floor(pose/4)],pose%4,2,2,x,y,508,{face:Math.sign(number)});

  const shot=pulse(t,293,2,4);
  if(shot>0){
   const fromX=x-105,fromY=y-365,toX=tx+30,toY=ty-182;
   confirmTracer(fromX,fromY,toX,toY,shot);
   art.strike(3,fromX,fromY,174,146,shot);
  }
  art.strike(3,tx-30,ty-182,690,586,confirm);
  ctx.restore();
  flash('190,222,255',Math.max(burst*.053,confirm*.17));
  bands(t,'#0b1721');
  art.portrait(1+t*.0014,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(1,x,y,175+time*6,155+time*5,1-time/LeanneLimitProfile.contactHold*.61,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const KatamariLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('katamari',['cutin','court','poses','effects','balls']);
 const shots=[
  [0,360,644,918,620,657,425,1.11,.015,0],
  [41,468,646,943,616,728,413,1.04,-.01,1],
  [72,504,644,965,613,745,405,.99,.016,1],
  [103,439,643,1013,611,756,391,.92,-.019,2],
  [141,465,644,1084,607,809,366,.84,.024,1],
  [181,495,644,1143,599,858,343,.78,-.019,1],
  [201,511,643,1158,524,869,350,.78,.012,3],
  [221,537,643,1354,442,935,375,.83,-.017,3],
  [250,564,644,1765,248,1000,423,.91,0,3]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=KatamariLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const combo=[...KatamariLimitProfile.combo.keys()];
  const flinch=Math.max(...combo.map(hit=>pulse(t,hit-1,hit,hit+2,hit+8)));
  const approach=Math.max(...combo.map(hit=>pulse(t,hit-8,hit,hit+2,hit+10)));
  const finish=pulse(t,207,215,219,240),star=ease((t-183)/24);
  const level=t<73?0:t<125?1:2;
  const height=218+195*ease((t-40)/100)+139*ease((t-120)/60);
  const radius=height*[.32,.41,.47][level];
  const contactX=tx-radius+8;
  const ballX=mix(mix(x+169,contactX-37,ease((t-21)/58)),contactX,approach);
  const ballY=y-radius-208*star;
  const princeX=mix(x,ballX-radius-105,ease((t-22)/38)*(1-star)*.75);
  frameClip();ctx.fillStyle='#265082';ctx.fillRect(0,0,W,H);art.image('court',-79-t*.17,-54,W+188,H+115);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.52,finish));
  art.strike(1,ballX-40,y-34,height+184,132,(1-star)*ease(t/36)*.48);
  art.grid('poses',pose,2,2,princeX,y,240);
  ctx.save();ctx.translate(ballX,ballY);ctx.rotate(t*.049);
  art.grid('balls',level,2,2,0,0,height,{anchorY:.5,alpha:1-star});
  ctx.restore();
  art.grid('balls',3,2,2,ballX,ballY,432+star*100,{anchorY:.5,alpha:star*(1-ease((t-225)/21))});
  target(opponent,tx+flinch*16,ty-flinch*23,-.08-flinch*.28-ease((t-217)/32)*1.42);
  for(const hit of combo){
   const strike=pulse(t,hit-2,hit,hit+2,hit+9),size=138+hit*.8;
   art.strike(0,tx-28,ty-93,size,size*.73,strike);
  }
  art.strike(2,ballX+104,ballY+56,480+finish*376,253+finish*96,star*(1-ease((t-212)/19))*.85,-.24);
  art.strike(3,tx-36,ty-107,438+finish*525,347+finish*254,finish);
  ctx.restore();flash('255,235,167',Math.max(flinch*.09,finish*.23));bands(t,'#213657');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,150+time*5,110,1-time/KatamariLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

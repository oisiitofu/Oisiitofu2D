'use strict';
const KrystalLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('krystal',['cutin','court','sky','poses','ship','effects']);
 // Time, Krystal's feet, target's feet, camera center, zoom, roll and pose.
 const shots=[
  [0,518,644,875,623,711,456,1.14,-.033,0],
  [46,542,642,938,624,752,439,1.16,.032,0],
  [65,551,642,995,622,808,435,1.05,-.049,1],
  [100,502,639,1003,620,755,425,.98,.024,2],
  [121,536,478,1008,619,737,375,1.02,-.055,3],
  [147,627,351,1008,619,748,344,.93,.069,4],
  [176,465,537,1008,619,768,417,.95,-.033,4],
  [202,493,532,1009,620,839,435,1.04,.034,4],
  [218,511,547,1236,396,840,415,.98,-.029,4],
  [248,556,628,1500,277,846,430,.95,.021,5],
  [276,565,631,1690,187,890,443,.94,0,0]
 ];
 const flight=[
  [92,-460,458,318,-.09,0],[108,232,388,355,-.21,0],[128,631,365,416,-.42,0],
  [142,765,246,424,-1.01,1],[154,713,211,436,-.69,1],[168,559,373,387,.14,2],
  [188,550,452,343,.18,2],[207,605,440,362,.10,2],[229,1044,306,288,-.37,3],
  [251,1645,151,212,-.40,3]
 ];
 function reticle(t,x,y,strength){
  if(strength<=0)return;
  const radius=mix(116,56,ease((t-157)/24));
  ctx.save();ctx.translate(x,y);ctx.globalAlpha*=strength;
  ctx.strokeStyle=t<178?'#b9fc98':'#ffbb79';ctx.lineWidth=3;
  for(let i=0;i<4;i++){
   ctx.rotate(TAU/4);ctx.beginPath();ctx.moveTo(radius-19,-radius);
   ctx.lineTo(radius,-radius);ctx.lineTo(radius,-radius+19);ctx.stroke();
  }
  ctx.beginPath();ctx.arc(0,0,radius*.68,0,TAU);ctx.stroke();ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=KrystalLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const [sx,sy,shipHeight,bank,shipIndex]=camera(flight,t);
  const cold=ease((t-57)/8)*(1-ease((t-68)/19));
  const cage=ease((t-63)/15)*(1-ease((t-202)/8));
  const air=ease((t-131)/9)*(1-ease((t-159)/10));
  const blast=ease((t-202)/5)*(1-ease((t-216)/31));
  frameClip();ctx.fillStyle='#0a142e';ctx.fillRect(0,0,W,H);
  art.image('court',-120-t*.17,-93,W+302,H+158);
  art.image('sky',-112-t*.29,-79,W+330,H+150,air);
  world(cx,cy,z,roll,face,t,Math.max(cold*.52,blast));
  ctx.save();ctx.globalAlpha*=1-air;
  target(opponent,tx,ty,-.08-cold*.29-ease((t-205)/37)*1.57);
  art.strike(1,1004,511,290+cage*84,303+cage*42,cage*.88);
  ctx.restore();
  const visible=1-ease((t-123)/10)+ease((t-225)/13);
  art.grid('poses',index,3,2,x,y,315,{alpha:visible});
  art.strike(0,795,530,486+cold*299,212+cold*83,cold*.96,-.04);
  if(t>=92&&t<251){
   ctx.save();ctx.translate(sx,sy);ctx.rotate(bank);
   art.glow(0,-shipHeight*.52,12,shipHeight*.80,shipHeight*.29,.64,Math.PI);
   art.grid('ship',shipIndex,2,2,0,0,shipHeight,{anchorY:.51});ctx.restore();
  }
  reticle(t,1004,509,ease((t-164)/9)*(1-ease((t-202)/5))*.88);
  for(const [launch,offset] of [[174,-37],[181,34],[193,0]]){
   const age=t-launch;if(age<0||age>13)continue;
   const p=age/13;
   art.strike(2,mix(sx+165,1040,p),mix(sy+offset,513+offset*.48,p),355,104,(1-ease((age-8)/5)),.14);
  }
  art.strike(3,1035,515,442+blast*601,302+blast*336,blast*.94);
  ctx.restore();flash('206,235,255',Math.max(cold*.10,blast*.21));bands(t,'#10172e');
  const opacity=ease(t/4)*(1-ease((t-25)/8));
  if(opacity){
   ctx.save();ctx.beginPath();ctx.moveTo(0,143);ctx.lineTo(W,75);ctx.lineTo(W,659);ctx.lineTo(0,731);ctx.closePath();ctx.clip();
   art.portrait(1.018+time*.0012,opacity);ctx.restore();
  }
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,154+time*4,102,1-time/KrystalLimitProfile.contactHold*.59,-.13,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

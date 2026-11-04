'use strict';
const IsaacLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('isaac',['cutin','court','poses','summon','djinn','effects']);
 const shots=[
  [0,535,647,872,625,711,448,1.17,-.031,0],
  [39,567,648,947,625,775,449,1.10,.034,0],
  [50,658,646,1005,606,820,433,1.06,-.042,1],
  [78,545,644,1008,619,768,403,1.02,.028,2],
  [109,541,645,1008,620,767,371,.95,-.037,2],
  [141,487,647,1028,622,757,299,.85,.029,3],
  [168,490,648,1038,626,777,308,.87,-.024,3],
  [192,509,646,1046,624,825,384,.95,.034,4],
  [206,496,647,1063,619,838,406,1.04,-.039,4],
  [233,544,648,1440,330,882,434,.93,.019,4],
  [256,552,642,1610,218,877,438,.93,-.009,5],
  [283,553,643,1748,175,903,452,.93,0,5]
 ];
 const giant=[
  [108,607,-130,303,0],[130,626,103,477,0],[149,679,218,585,1],
  [171,705,229,594,1],[184,717,231,578,2],[202,701,225,560,2],
  [225,680,131,463,3],[255,623,-256,352,3]
 ];
 function djinn(t,x,y){
  for(let i=0;i<4;i++){
   const age=t-(54+i*11);if(age<0||age>57)continue;
   const p=ease(age/54),angle=t*.086+i*TAU/4;
   const cx=mix(x+Math.cos(angle)*(159+i*14),681,p),cy=mix(y-92+Math.sin(angle)*69,160,p);
   const alpha=ease(age/8)*(1-ease((age-47)/10));
   art.glow(3,cx,cy,94+76*p,50+42*p,alpha*.78,angle);
   art.grid('djinn',0,1,1,cx,cy,76-23*p,{anchorY:.5,alpha});
  }
 }
 function draw({target:opponent,face,time}){
  const t=IsaacLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const [gx,gy,gh,gi]=camera(giant,t),appear=ease((t-105)/23)*(1-ease((t-230)/25));
  const sword=ease((t-39)/5)*(1-ease((t-49)/15));
  const charge=ease((t-155)/18)*(1-ease((t-180)/8));
  const blast=ease((t-199)/7)*(1-ease((t-217)/32));
  frameClip();ctx.fillStyle='#201a2e';ctx.fillRect(0,0,W,H);
  art.image('court',-114-t*.25,-110+ease((t-120)/67)*45,W+303,H+173);
  world(cx,cy,z,roll,face,t,Math.max(blast,sword*.43));
  const crestX=gx-128,crestY=gy+49;
  art.glow(3,gx,gy+43,451+appear*367,302+appear*187,appear*.61,-t*.012);
  art.grid('summon',gi,2,2,gx,gy,gh,{anchorY:.54,alpha:appear});
  target(opponent,tx,ty,-.11-ease((t-203)/37)*1.50);
  art.grid('poses',index,3,2,x,y,326);
  djinn(t,x,y);
  art.strike(0,819,505,470+sword*289,229+sword*74,sword*.91,-.16);
  art.glow(3,crestX,crestY,152+charge*231,134+charge*164,charge*.85,.31);
  const travel=ease((t-178)/25),ray=ease((t-178)/5)*(1-ease((t-200)/7));
  const px=mix(crestX+22,1054,travel),py=mix(crestY,561,travel);
  art.strike(1,px,py,215+ray*135,369+ray*104,ray*.99,-.92);
  art.strike(2,1050,475,426+blast*704,370+blast*300,blast*.97);
  const ring=ease((t-203)/9)*(1-ease((t-223)/31));
  art.glow(3,1045,611,504+ease((t-203)/40)*988,188+ring*140,ring*.82);
  ctx.restore();flash('255,222,148',Math.max(blast*.28,charge*.10));bands(t,'#1d131a');
  const opacity=ease(t/4)*(1-ease((t-25)/8));
  if(opacity){
   ctx.save();ctx.beginPath();ctx.moveTo(0,105);ctx.lineTo(W,62);ctx.lineTo(W,688);ctx.lineTo(0,751);ctx.closePath();ctx.clip();
   art.portrait(1.02+time*.0011,opacity);ctx.restore();
  }
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,160+time*4,107,1-time/IsaacLimitProfile.contactHold*.61,-.16,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

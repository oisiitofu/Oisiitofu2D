'use strict';
const NightravenLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('nightraven',['cutin','court','poses','effects']);
 const shots=[
  [0,325,518,941,567,666,395,1.06,-.018,0],
  [44,432,495,963,554,728,381,1.03,.019,0],
  [73,510,471,1003,543,758,360,.98,-.021,1],
  [99,439,458,1029,513,775,339,.85,.032,2],
  [139,344,477,1084,522,784,365,.83,-.027,2],
  [174,371,528,1113,518,824,390,.88,.019,1],
  [195,475,524,1141,515,880,390,.83,-.019,3],
  [220,482,520,1286,449,951,380,.79,.021,3],
  [256,618,366,1746,240,1008,381,.86,0,1]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=NightravenLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const charge=pulse(t,174,202,208,214),finish=pulse(t,203,211,221,246);
  const flinch=Math.max(...Array.from(NightravenLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+8)));
  frameClip();ctx.fillStyle='#0c1330';ctx.fillRect(0,0,W,H);art.image('court',-85-t*.13,-66,W+204,H+135);
  world(cx,cy,z,roll,face,t,Math.max(finish,flinch*.59));
  art.grid('poses',pose,2,2,x,y,355);
  target(opponent,tx+flinch*29,ty-flinch*19,-.08-flinch*.25-ease((t-213)/32)*1.36);
  for(const hit of [45,56,68]){
   const flight=ease((t-hit+8)/8);
   art.strike(0,mix(x+166,tx-65,flight),mix(y-31,ty-76,flight),275,107,pulse(t,hit-8,hit-5,hit,hit+6));
  }
  for(const [hit,offset] of [[101,-108],[118,79],[137,-31],[160,25]]){
   const flight=ease((t-hit+16)/16),blast=pulse(t,hit-1,hit,hit+3,hit+10);
   art.strike(1,mix(x+117,tx+offset-37,flight),mix(y-65,ty-109,flight)-135*Math.sin(flight*Math.PI),283,112,pulse(t,hit-16,hit-13,hit,hit+2),mix(-.37,.27,flight));
   art.strike(2,tx+offset,ty-109,255+blast*104,216+blast*80,blast);
  }
  const mx=x+155,my=y-31,dx=tx+195-mx,dy=ty-78-my;
  art.glow(2,mx,my,170+charge*265,150+charge*201,charge*.8);
  art.strike(3,mx+dx/2,my+dy/2,Math.hypot(dx,dy),186+finish*151,finish,Math.atan2(dy,dx));
  ctx.restore();flash('240,181,255',Math.max(finish*.22,flinch*.10));bands(t,'#18142b');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,155+time*6,104,1-time/NightravenLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

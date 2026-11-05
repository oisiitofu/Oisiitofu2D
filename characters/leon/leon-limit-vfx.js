'use strict';
const LeonLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('leon',['cutin','court','poses','fired','effects']);
 const shots=[
  [0,452,646,959,610,718,398,1.07,.013,0],
  [45,704,646,978,610,849,390,1.11,-.015,0],
  [62,755,646,1043,577,902,388,1.04,.019,1],
  [85,805,646,1100,592,954,389,1.10,-.019,0],
  [104,658,646,1139,592,900,388,.92,.014,2],
  [147,619,646,1191,591,908,389,.94,-.015,2],
  [164,573,646,1214,590,896,392,.82,.014,3],
  [185,556,646,1231,592,907,395,.80,-.012,3],
  [207,560,646,1249,591,920,394,.81,.014,3],
  [217,559,646,1279,573,925,392,.86,.025,3],
  [233,559,646,1630,308,1048,399,.83,-.014,3],
  [250,559,646,1839,201,1100,403,.84,0,2]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=LeonLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const firing=pulse(t,180,183,186,192),flight=ease((t-183)/31),finish=pulse(t,212,216,220,240);
  const flinch=Math.max(...Array.from(LeonLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  frameClip();ctx.fillStyle='#101e29';ctx.fillRect(0,0,W,H);art.image('court',-72-t*.12,-63,W+187,H+132);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.55,finish));
  const drawLeon=()=>art.grid(t>=183&&pose===3?'fired':'poses',pose,2,2,x-firing*13,y,331);
  const drawTarget=()=>target(opponent,tx+flinch*24,ty-flinch*21,-.09-flinch*.30-ease((t-217)/28)*1.45);
  if(t<216)drawLeon();
  for(const [hit,angle] of [[45,-.19],[85,.33]]){
   art.strike(0,tx-79,ty-120,292,195,pulse(t,hit-4,hit,hit+1,hit+8),angle);
  }
  art.strike(1,tx-64,ty-99,229,171,pulse(t,58,62,63,70),-.27);
  for(const [hit,offset] of [[110,-6],[122,10],[134,-13],[146,4]]){
   const fromX=x+76,fromY=y-199,toX=tx-34,toY=ty-111+offset;
   art.strike(1,mix(fromX,toX,.5),mix(fromY,toY,.5),Math.hypot(toX-fromX,toY-fromY),102,pulse(t,hit-2,hit,hit+1,hit+5),Math.atan2(toY-fromY,toX-fromX));
  }
  art.glow(1,x-92,y-151,140,95,firing*.48,Math.PI);
  ctx.save();ctx.beginPath();ctx.rect(x+100,y-300,1800,500);ctx.clip();
  art.strike(2,mix(x+10,tx-24,flight),mix(y-150,ty-107,flight),285,143,pulse(t,182,184,211,216));
  ctx.restore();
  art.strike(3,tx+2,ty-139,399+finish*430,334+finish*357,finish);
  if(t>=216)drawLeon();
  drawTarget();
  ctx.restore();flash('255,199,132',Math.max(flinch*.12,finish*.24));bands(t,'#101d2a');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,164+time*6,117,1-time/LeonLimitProfile.contactHold*.6,-.13,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

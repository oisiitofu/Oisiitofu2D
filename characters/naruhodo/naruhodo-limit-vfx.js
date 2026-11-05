'use strict';
const NaruhodoLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('naruhodo',['cutin','court','poses','effects','desk']);
 const bodyAnchors=[.53,.45,.45,.39];
 const shots=[
  [0,473,653,981,626,729,414,1.08,.014,0],
  [47,480,653,979,626,731,403,1.08,-.01,0],
  [73,485,652,999,617,745,390,1.01,.014,1],
  [109,495,653,1025,619,768,402,.94,-.013,2],
  [144,507,653,1047,612,787,384,.88,.014,2],
  [172,526,653,1086,594,806,379,.86,-.016,2],
  [211,540,652,1143,572,841,369,.85,.014,3],
  [228,540,652,1442,421,941,383,.83,-.017,3],
  [248,546,652,1749,242,1000,418,.87,0,3]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=NaruhodoLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const flinch=Math.max(...Array.from(NaruhodoLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+8)));
  const verdict=pulse(t,202,211,219,239);
  frameClip();ctx.fillStyle='#32212c';ctx.fillRect(0,0,W,H);art.image('court',-75-t*.13,-53,W+178,H+111);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.6,verdict));
  art.grid('poses',pose,2,2,x,y,362,{anchorX:bodyAnchors[pose]});
  art.grid('desk',0,1,1,x+21,y+29,224);
  const drawTarget=()=>target(opponent,tx+flinch*26,ty-flinch*24,-.08-flinch*.26-ease((t-211)/34)*1.43);
  if(t<217)drawTarget();
  const slam=pulse(t,43,47,50,59);
  art.strike(1,x+84,y-188,226+slam*79,166+slam*61,slam);
  art.strike(1,tx-32,ty-96,197,145,slam*.68);
  for(const [hit,arc] of [[69,65],[92,96],[119,128]]){
   const flight=ease((t-hit+13)/13);
   art.strike(0,mix(x+147,tx-31,flight),mix(y-236,ty-115,flight)-arc*Math.sin(flight*Math.PI),298,152,pulse(t,hit-13,hit-8,hit,hit+6),mix(-.2,.25,flight));
   art.strike(1,tx-13,ty-110,183,161,pulse(t,hit-1,hit,hit+2,hit+9));
  }
  for(const [hit,offset] of [[143,-56],[167,21]]){
   const drop=ease((t-hit+14)/14);
   art.strike(2,tx+offset,ty-142-(1-drop)*362,311+drop*114,301+drop*56,pulse(t,hit-14,hit-8,hit+3,hit+12),offset*.003);
  }
  const shoutX=mix(x+161,tx-32,ease((t-203)/11)),shoutY=mix(y-245,ty-128,ease((t-203)/11));
  art.strike(3,shoutX,shoutY,490+verdict*526,289+verdict*229,verdict,-.11);
  if(verdict>0){
   ctx.save();ctx.translate(shoutX,shoutY);ctx.rotate(-.08);ctx.scale(face,1);
   ctx.globalAlpha*=ease(verdict);ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.font='900 '+(64+verdict*79)+'px "Yu Gothic",sans-serif';
   ctx.lineJoin='round';ctx.lineWidth=13;ctx.strokeStyle='#681a1b';ctx.strokeText('異議あり！',0,0);
   ctx.lineWidth=5;ctx.strokeStyle='#fff3db';ctx.strokeText('異議あり！',0,0);
   ctx.fillStyle='#e92425';ctx.fillText('異議あり！',0,0);ctx.restore();
  }
  if(t>=217)drawTarget();
  ctx.restore();flash('255,209,171',Math.max(flinch*.1,verdict*.22));bands(t,'#2e1c25');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(1,x,y,142+time*6,115,1-time/NaruhodoLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const OkamiLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('okami',['cutin','court','dawn','poses','effects']);
 const shots=[
  [0,413,647,976,623,698,423,1.09,.008,0],
  [48,500,641,991,618,740,411,1.02,-.014,0],
  [71,584,570,1018,588,779,383,.96,.015,1],
  [95,574,641,1035,606,797,388,.91,-.017,2],
  [140,483,644,1090,601,809,369,.86,.018,2],
  [179,462,649,1121,581,815,355,.81,-.014,3],
  [214,479,648,1166,556,852,340,.77,.008,3],
  [232,483,645,1420,390,979,368,.85,-.016,3],
  [250,490,646,1728,205,1022,425,.9,0,3]
 ];
 const pulses=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=OkamiLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=pulses(t,204,213,220,241),dawn=ease((t-192)/25),call=pulses(t,173,193,202,213);
  const flinch=Math.max(...Array.from(OkamiLimitProfile.combo.keys(),hit=>pulses(t,hit-1,hit,hit+2,hit+9)));
  frameClip();ctx.fillStyle='#221d25';ctx.fillRect(0,0,W,H);
  art.image('court',-76-t*.1,-53,W+181,H+112);
  art.image('dawn',-76-t*.1,-53,W+181,H+112,dawn);
  if(call>0){
   const sunX=-76-t*.1+(W+181)*.787,sunY=-53+(H+112)*.205;
   ctx.save();
   ctx.strokeStyle='#29161b';ctx.globalAlpha*=call*.93;ctx.lineWidth=18;ctx.lineCap='round';
   ctx.beginPath();ctx.ellipse(sunX,sunY,88,76,-.17,Math.PI*.75,Math.PI*(.75+2*ease((t-174)/24)));ctx.stroke();
   ctx.restore();
   art.glow(3,sunX,sunY,342,260,call*.58);
  }
  world(cx,cy,z,roll,face,t,Math.max(flinch*.52,impact));
  art.grid('poses',pose,2,2,x,y,320);
  const drawTarget=()=>target(opponent,tx+flinch*22,ty-flinch*22,-.08-flinch*.29-ease((t-215)/32)*1.32);
  if(t<213)drawTarget();
  for(const [hit,angle] of [[45,-.21],[60,.26],[78,-.56]]){
   const travel=ease((t-hit+10)/10),strike=pulses(t,hit-9,hit-5,hit+1,hit+10);
   art.strike(0,mix(x+171,tx-64,travel),mix(y-126,ty-100,travel),410+travel*147,145+travel*71,strike,angle);
  }
  for(const [hit,offset] of [[103,-52],[121,63]]){
   const burst=pulses(t,hit-4,hit,hit+4,hit+15);
   art.strike(1,tx+offset,ty-101,232+burst*147,230+burst*154,burst,offset*.003);
  }
  for(const [hit,offset] of [[145,-52],[164,36]]){
   const shock=pulses(t,hit-3,hit,hit+3,hit+12);
   art.strike(2,tx+offset,ty-302,228+shock*96,505,shock,offset*.003);
  }
  art.strike(3,tx-51,ty-116,544+impact*600,352+impact*283,impact);
  if(t>=213)drawTarget();
  ctx.restore();flash('255,216,161',Math.max(impact*.22,flinch*.13));bands(t,'#372423');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,157+time*5,108,1-time/OkamiLimitProfile.contactHold*.6,-.11,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

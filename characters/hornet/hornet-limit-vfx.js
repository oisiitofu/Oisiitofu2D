'use strict';

const HornetLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('hornet',['cutin','effects']);
 const shots=[
  [0,400,677,1065,670,747,437,.94,0,1],[32,548,649,1065,670,811,400,.92,-.03,43],
  [46,873,667,1065,654,979,440,.98,.023,41],[62,1020,739,1117,641,1068,456,.95,.03,4],
  [80,1269,572,1102,601,1191,389,.9,-.04,-16],[99,1158,366,1118,593,1136,320,.87,.033,-17],
  [117,868,453,1098,549,985,337,.91,-.028,13],[137,900,587,1127,535,1009,368,.95,.016,10],
  [158,960,492,1130,521,1040,332,.9,0,45],[182,1014,447,1145,517,1070,331,1.04,.018,46],
  [209,922,597,1590,312,1164,384,.82,-.009,5],[215,922,677,1810,147,1310,406,.79,0,1]
 ];
 const anchors=[[582,105],[1320,105],[1047,52]];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function draw({attacker,target:opponent,face,time}){
  const t=HornetLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[46,62,80,99,117,137];
  const hitStrength=Math.max(...hits.map(hit=>pulse(t,hit,4,8)));
  const storm=pulse(t,182,7,25);
  frameClip();
  const sky=ctx.createRadialGradient(W*.48,H*.35,5,W*.48,H*.35,W*.73);
  sky.addColorStop(0,'#7a534d');sky.addColorStop(.54,'#412a3a');sky.addColorStop(1,'#191521');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(storm,hitStrength*.7));
  for(let i=0;i<12;i++){
   const px=-540+i*268,roof=130+i%4*47;
   ctx.fillStyle=i%2===0?'#2d2031':'#392638';
   ctx.beginPath();ctx.moveTo(px,674);ctx.lineTo(px,roof+77);
   ctx.lineTo(px+88,roof);ctx.lineTo(px+177,roof+77);ctx.lineTo(px+177,674);ctx.fill();
  }
  ctx.fillStyle='#392733';ctx.fillRect(-1800,678,5800,720);
  const tether=ease((t-26)/10)*(1-ease((t-136)/14));
  const [ax,ay]=anchors[t<69?0:t<111?1:2];
  const catchTime=t<69?32:t<111?73:113;
  ctx.save();ctx.globalAlpha=tether*(.55+.39*ease((t-catchTime+5)/8));ctx.strokeStyle='#fff3d3';ctx.lineWidth=4;
  ctx.beginPath();ctx.moveTo(ax,ay);ctx.quadraticCurveTo(mix(ax,x,.54)+tether*Math.sin(t*.1)*32,(ay+y-115)*.5,x,y-115);ctx.stroke();
  ctx.restore();
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.1);
  target(opponent,tx,ty-hitStrength*10,-.14-hitStrength*.4-ease((t-186)/25)*1.42,2.65);
  for(const [i,hit] of hits.entries()){
   art.strike(i%3,tx-10,ty-99,415+20*i,234,pulse(t,hit,5,10),[.07,-.26,-1.1,1,.71,-.64][i]);
  }
  const turn=t*.037;
  for(let i=0;i<5;i++){
   const rotation=i*Math.PI/5+turn;
   art.strike(3,tx,ty-121,690+180*ease((t-178)/10),124,storm,rotation);
  }
  ctx.save();ctx.globalAlpha=storm*.9;ctx.strokeStyle='#fff3cf';ctx.lineWidth=4;
  const radius=95+340*ease((t-180)/19);
  for(let i=0;i<5;i++){
   const sweep=turn+i*.7;
   ctx.beginPath();ctx.ellipse(tx,ty-120,radius,radius*.38,sweep,sweep,sweep+3.9);ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
  flash('255,215,173',Math.max(hitStrength*.13,storm*.18));bands(t,'#160d18');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,163+time*4,126,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

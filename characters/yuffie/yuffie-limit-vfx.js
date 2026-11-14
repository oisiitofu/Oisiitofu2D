'use strict';

const YuffieLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('yuffie',['cutin','effects']);
 const shots=[
  [0,423,662,1095,659,759,432,.89,0,1],[35,562,662,1095,659,820,433,.93,-.009,24],
  [47,605,662,1099,647,852,430,.95,.019,18],[64,789,661,1127,618,960,423,.95,-.018,31],
  [82,994,539,1152,599,1073,382,.89,-.026,5],[101,1063,402,1198,549,1135,330,.91,.03,17],
  [120,1198,500,1220,572,1205,374,.9,-.022,20],[140,971,653,1199,637,1094,429,.96,.013,13],
  [164,717,662,1243,652,991,421,.88,-.012,11],[184,749,662,1253,655,1008,409,.9,.009,24],
  [198,782,662,1265,627,1025,399,.95,.025,18],[232,791,662,1767,325,1221,403,.79,0,1]
 ];
 const hits=[47,64,82,101,120,140];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function blade(x,y,t,alpha,size){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(t*.77);ctx.scale(size,size);ctx.globalAlpha=alpha;
  ctx.fillStyle='#d4e9dc';ctx.strokeStyle='#28463f';ctx.lineWidth=4;
  for(let i=0;i<4;i++){
   ctx.rotate(Math.PI*.5);
   ctx.beginPath();ctx.moveTo(7,-11);ctx.lineTo(81,-29);ctx.lineTo(52,11);ctx.lineTo(9,16);ctx.closePath();ctx.fill();ctx.stroke();
  }
  ctx.fillStyle='#294956';ctx.beginPath();ctx.arc(0,0,16,0,Math.PI*2);ctx.fill();ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=YuffieLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9))),finish=pulse(t,198,5,23);
  frameClip();
  const sky=ctx.createLinearGradient(0,0,W,H);
  sky.addColorStop(0,'#16394a');sky.addColorStop(.57,'#2c625e');sky.addColorStop(1,'#202444');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.56,finish));
  for(let i=0;i<19;i++){
   const px=i*199-1080;
   ctx.fillStyle=i%2===0?'#244a4d':'#1d3d43';
   ctx.fillRect(px,0,15+i%3*9,664);
   ctx.fillRect(px-34,119+i%4*95,82,12);
  }
  ctx.fillStyle='#203f47';ctx.fillRect(-1900,664,5900,660);
  ctx.strokeStyle='#609483';ctx.lineWidth=3;
  for(let i=-12;i<24;i++){ctx.beginPath();ctx.moveTo(i*141,666);ctx.lineTo((i-6)*361,1150);ctx.stroke();}
  const travel=ease((t-34)/13),retract=ease((t-67)/15);
  blade(mix(mix(611,tx,travel),x+100,retract),mix(mix(530,ty-132,travel)-99*Math.sin(travel*Math.PI),y-142,retract),t,pulse(t,50,17,33),1);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,3.2);
  target(opponent,tx,ty-impact*15,-.1-impact*.33-ease((t-199)/28)*1.34,2.55);
  for(const [i,hit] of hits.entries()){
   art.strike(i%3,tx-18,ty-119,365+i*17,278,pulse(t,hit,5,8),[.15,-.46,.53,-1.05,.48,-.16][i]);
  }
  const close=ease((t-173)/25),orbit=(1-close)*406;
  for(let i=0;i<4;i++){
   const angle=i*Math.PI/2+t*.097;
   blade(tx+Math.cos(angle)*orbit,ty-122+Math.sin(angle)*orbit*.68,t+i*2,pulse(t,194,23,7),.78);
  }
  art.strike(3,tx,ty-104,424+ease((t-198)/17)*398,394,finish,t*.085);
  const shock=ease((t-197)/5)*(1-ease((t-204)/16));
  art.strike(1,tx+112,ty-98,550+ease((t-201)/15)*360,296,shock,-t*.097);
  ctx.save();ctx.globalAlpha=shock*.84;ctx.strokeStyle='#d8ffe3';ctx.lineWidth=5;
  const radius=115+ease((t-198)/19)*427;
  ctx.beginPath();ctx.ellipse(tx,ty-82,radius,radius*.39,-.24,0,Math.PI*2);ctx.stroke();ctx.restore();
  ctx.restore();flash('195,255,215',Math.max(impact*.1,finish*.24));bands(t,'#102732');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,155+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

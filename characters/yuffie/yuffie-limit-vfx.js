'use strict';

const YuffieLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('yuffie',['cutin','effects','court','shuriken'],{revision:2});
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
  ctx.save();ctx.translate(x,y);ctx.rotate(t*.41);
  art.image('shuriken',-size/2,-size/2,size,size,alpha);
  ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=YuffieLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9))),finish=pulse(t,198,5,23);
  frameClip();
  const width=W+330;
  art.image('court',-(width-W)*.5-(cx-1000)*.12,-100-(cy-419)*.13,width,width*9/16);
  world(cx,cy,z,roll,face,t,Math.max(impact*.56,finish));
  const spread=ease((t-198)/17);
  art.strike(3,tx+68*spread,ty-105-32*spread,483+spread*526,440+spread*110,finish,.1+spread*.39);
  const travel=ease((t-34)/13),retract=ease((t-67)/15);
  const discX=mix(mix(611,tx,travel),x+100,retract);
  const discY=mix(mix(530,ty-132,travel)-99*Math.sin(travel*Math.PI),y-142,retract);
  const discStrength=pulse(t,50,17,33);
  art.glow(0,discX-49,discY,290,172,discStrength*.73,-.18+t*.025);
  blade(discX,discY,t,discStrength,197);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,3.2);
  target(opponent,tx,ty-impact*15,-.1-impact*.33-ease((t-199)/28)*1.34,2.55);
  for(const [i,hit] of hits.entries()){
   art.strike(i%3,tx-18,ty-119,365+i*17,278,pulse(t,hit,5,8),[.15,-.46,.53,-1.05,.48,-.16][i]);
  }
  const close=ease((t-173)/25),orbit=mix(460,62,close);
  const echo=pulse(t,194,23,7);
  for(let i=0;i<4;i++){
   const angle=i*Math.PI/2+t*.097;
   const echoX=tx+Math.cos(angle)*orbit,echoY=ty-122+Math.sin(angle)*orbit*.68;
   art.glow(i%2?2:0,echoX,echoY,297,155,echo*.85,angle-Math.PI*.5);
   blade(echoX,echoY,t+i*2,echo*.7,133);
  }
  art.strike(1,tx,ty-116,282+spread*133,239,pulse(t,198,3,10),-.17);
  art.glow(2,tx+121*spread,ty-105,562+spread*395,378,finish*.56,-.15);
  ctx.restore();flash('195,255,215',Math.max(impact*.1,finish*.24));bands(t,'#102732');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,155+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

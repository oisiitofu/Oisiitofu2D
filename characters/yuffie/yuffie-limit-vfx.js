'use strict';

const YuffieLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('yuffie',['cutin','effects','court','shuriken','finish'],{revision:3});
 const shots=[
  [0,423,662,1095,659,759,432,.89,0,1],[35,562,662,1095,659,820,433,.93,-.009,24],
  [47,605,662,1099,647,852,430,.95,.019,18],[64,789,661,1127,618,960,423,.95,-.018,31],
  [82,994,539,1152,599,1073,382,.89,-.026,5],[101,1063,402,1198,549,1135,330,.91,.03,17],
  [120,1198,500,1220,572,1205,374,.9,-.022,20],[140,971,653,1199,637,1094,429,.96,.013,13],
  [164,717,662,1243,652,991,421,.88,-.012,11],[182,743,662,1253,655,1123,345,.73,-.022,24],
  [193,764,662,1254,645,1025,413,1.015,.011,24],[198,839,662,1302,622,1100,420,1.04,.026,18],
  [210,824,662,1513,462,1194,403,.84,.01,23],[232,791,662,1767,325,1264,416,.76,0,1]
 ];
 const hits=[47,64,82,101,120,140];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 const edge=(slot,x,y,w,h,strength,angle=0)=>art.strike(slot,x,y,w,h,strength,angle,1,'finish');
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
  ctx.fillStyle='rgba(6,33,35,'+(pulse(t,195,15,31)*.41)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.56,finish));
  const spread=ease((t-198)/19),handX=x+94,handY=y-128;
  const travel=ease((t-34)/13),retract=ease((t-48)/28);
  const discX=mix(mix(611,tx+70,travel),handX,retract);
  const discY=mix(mix(530,ty-132,travel)-76*Math.sin(travel*Math.PI),handY,retract)-120*Math.sin(retract*Math.PI);
  const discStrength=pulse(t,47,14,31),facing=t>=48?Math.PI:0;
  edge(0,discX-58*Math.cos(facing),discY+10,295,208,discStrength*.89,facing+.08);
  blade(discX,discY,t,discStrength,203);
  const away=ease((t-162)/15),back=ease((t-179)/18);
  const loopX=mix(mix(780,1485,away),handX,back);
  const loopY=mix(mix(533,262,away),handY,back)-89*Math.sin(Math.PI*back);
  const arc=pulse(t,179,17,17),angle=t>=179?Math.PI-.38:-.37;
  edge(0,loopX-100*Math.cos(angle),loopY-100*Math.sin(angle),430,299,arc,angle);
  edge(1,loopX,loopY,367,315,arc*.77,-t*.09);
  blade(loopX,loopY,t,arc,191);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,3.2);
  target(opponent,tx,ty-impact*15,-.1-impact*.33-ease((t-199)/28)*1.34,2.55);
  for(const [i,hit] of hits.entries()){
   art.strike(i%3,tx-18,ty-119,365+i*17,278,pulse(t,hit,5,8),[.15,-.46,.53,-1.05,.48,-.16][i]);
  }
  const cut=pulse(t,198,2,19);
  edge(3,handX+mix(350,595,spread),handY-mix(57,152,spread),mix(716,1249,spread),
   mix(572,860,spread),cut,-.19);
  edge(2,1283,510,mix(380,670,spread),mix(338,624,spread),pulse(t,198,2,13),t*.041);
  art.glow(2,1283,510,562+spread*395,378,finish*.40,-.15);
  ctx.restore();flash('195,255,215',Math.max(impact*.1,finish*.24));bands(t,'#102732');
  portraitPanel(t,-27,art.portrait);ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,155+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

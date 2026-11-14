'use strict';

const TailsLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('tails',['cutin','effects']);
 const shots=[
  [0,415,683,1086,671,761,419,.92,0,31],[40,565,683,1085,671,821,422,.97,0,32],
  [48,613,654,1095,654,844,426,.94,.018,33],[65,877,606,1066,622,950,393,.96,-.025,27],
  [83,1082,442,1126,617,1104,366,.92,.011,40],[102,1341,361,1212,553,1276,298,.86,.035,-30],
  [121,1328,296,1229,522,1290,290,.89,-.02,-44],[141,1067,429,1257,546,1162,331,.91,.016,40],
  [170,859,568,1291,612,1081,379,.88,-.014,45],[187,890,510,1305,610,1089,381,.92,.025,44],
  [220,837,683,1754,328,1182,401,.8,0,0]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=TailsLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[48,65,83,102,121,141];
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,3,9))),finish=pulse(t,187,6,27);
  frameClip();
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#101d3a');sky.addColorStop(.55,'#2b6588');sky.addColorStop(1,'#142138');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.5,finish));
  ctx.fillStyle='#293659';ctx.fillRect(-2000,674,6000,450);
  for(let i=0;i<16;i++){
   const px=i*310-1500;
   ctx.fillStyle='#3e607c';ctx.fillRect(px,653,240,21);
   ctx.fillStyle='#efcb6b';ctx.fillRect(px+15,659,72,4);
  }
  const ring=ease((t-27)/7)*(1-ease((t-47)/4));
  if(ring>0){
   const flight=ease((t-31)/15);
   ctx.save();ctx.globalAlpha=ring;ctx.strokeStyle='#ffdf59';ctx.lineWidth=11;
   ctx.beginPath();ctx.ellipse(mix(x+92,tx,flight),mix(y-119,ty-113,flight)-150*Math.sin(Math.PI*flight),28,38,t*.27,0,Math.PI*2);ctx.stroke();
   ctx.restore();
  }
  const bob=Math.sin(t*.15)*12,droneX=1320,droneY=255+bob;
  const active=ease((t-106)/24)*(1-ease((t-198)/21));
  ctx.save();ctx.globalAlpha=active;
  ctx.fillStyle='#36516f';ctx.strokeStyle='#92e8ff';ctx.lineWidth=5;
  ctx.beginPath();ctx.ellipse(droneX,droneY,63,28,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#ffd66b';ctx.fillRect(droneX-19,droneY-7,38,14);
  ctx.strokeStyle='#d4fbff';ctx.beginPath();
  ctx.ellipse(droneX,droneY-34,98,10,0,0,Math.PI*2);ctx.stroke();
  ctx.restore();
  const sprite={...attacker,x,y,face:pose<0?-1:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose),3.1);
  target(opponent,tx,ty-impact*16,-.1-impact*.34-ease((t-189)/25)*1.32,2.65);
  for(const [i,hit] of hits.entries()){
   const power=pulse(t,hit,5,9),slot=[0,1,2,1,2,2][i];
   art.strike(slot,tx,ty-(slot===2?173:115),slot===2?495:350,slot===2?512:260,power,i%2===0?-.39:.46);
  }
  for(const [fromX,fromY] of [[droneX,droneY+20],[x+108,y-105]]){
   const dx=tx-fromX,dy=ty-122-fromY;
   art.strike(3,fromX+dx/2,fromY+dy/2,Math.hypot(dx,dy)+33,152,finish,Math.atan2(dy,dx));
  }
  art.strike(0,tx,ty-111,420+ease((t-189)/17)*420,405,finish);
  ctx.restore();flash('198,240,255',Math.max(impact*.12,finish*.19));bands(t,'#0c182b');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(1,x,y,156+time*4,142,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

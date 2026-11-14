'use strict';

const AerithLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('aerith',['cutin','effects']);
 const shots=[
  [0,446,673,1073,669,761,429,.94,0,1],[36,582,673,1073,669,826,433,.96,-.017,41],
  [48,743,673,1087,657,916,437,.97,.014,7],[66,732,673,1112,622,919,411,.91,-.018,16],
  [84,681,648,1147,575,913,395,.89,.018,46],[104,598,621,1192,563,909,376,.87,-.017,39],
  [123,569,638,1214,609,891,401,.91,.02,43],[143,628,671,1261,629,946,427,.9,-.014,9],
  [167,702,641,1272,670,986,426,.89,-.022,47],[185,744,558,1271,663,1012,365,.83,0,16],
  [201,747,515,1310,638,1056,362,.92,.018,48],[233,764,673,1702,316,1172,398,.77,0,1]
 ];
 const hits=[48,66,84,104,123,143];
 const circles=[[743,669,41],[570,639,75],[750,590,130]];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function circle(x,y,r,t,alpha){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.scale(1,.34);ctx.rotate(t*.019);
  ctx.globalAlpha=alpha;ctx.lineWidth=5;ctx.strokeStyle='#ffffc6';
  ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='#fff1a0';ctx.beginPath();
  for(let i=0;i<12;i++){
   const a=i*Math.PI/6,rr=i%2?r*.66:r*.89;
   const px=Math.cos(a)*rr,py=Math.sin(a)*rr;i?ctx.lineTo(px,py):ctx.moveTo(px,py);
  }
  ctx.closePath();ctx.stroke();ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=AerithLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9))),finish=pulse(t,201,5,27);
  frameClip();
  const sky=ctx.createRadialGradient(W*.45,H*.37,10,W*.45,H*.37,W*.76);
  sky.addColorStop(0,'#816554');sky.addColorStop(.51,'#40364d');sky.addColorStop(1,'#172337');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.48,finish));
  ctx.strokeStyle='#8a6876';ctx.lineWidth=20;
  for(let i=0;i<12;i++){
   const x=i*434-1400;
   ctx.beginPath();ctx.moveTo(x,673);ctx.lineTo(x,342);
   ctx.quadraticCurveTo(x+20,205,x+204,119);ctx.quadraticCurveTo(x+388,205,x+408,342);
   ctx.lineTo(x+408,673);ctx.stroke();
  }
  ctx.save();ctx.globalAlpha=.28;
  for(let i=0;i<12;i++){
   const x=i*434-1196;
   ctx.strokeStyle=i%2===0?'#dbb0ab':'#a384ae';ctx.lineWidth=4;
   ctx.beginPath();ctx.ellipse(x,301,83,112,0,0,Math.PI*2);ctx.stroke();
   ctx.beginPath();ctx.moveTo(x-83,301);ctx.lineTo(x+83,301);ctx.moveTo(x,189);ctx.lineTo(x,413);ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle='#554458';ctx.fillRect(-1900,675,6200,620);
  for(const [px,py,start] of circles){
   const glow=ease((t-start)/13)*(1-ease((t-206)/21));
   circle(px,py,175+26*ease((t-start)/23),t,glow*.88);
  }
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,3.05);
  target(opponent,tx,ty-impact*13,-.08-impact*.32-ease((t-202)/27)*1.32,2.55);
  for(const [i,hit] of hits.entries()){
   const [fromX,fromY]=circles[Math.min(2,Math.floor(i/2))],flight=ease((t-hit+10)/10);
   const power=pulse(t,hit,10,8);
   art.strike(i%3,mix(fromX+78,tx,flight),mix(fromY-91,ty-115,flight),280+i*23,258,power,i*.38);
  }
  const fromX=x+97,fromY=y-137,dx=tx-fromX,dy=ty-120-fromY;
  art.strike(3,fromX+dx*.56,fromY+dy*.56,Math.hypot(dx,dy)+230,261+ease((t-201)/16)*165,finish,Math.atan2(dy,dx));
  art.strike(1,tx,ty-117,455+ease((t-201)/17)*350,393,finish,t*.065);
  ctx.restore();flash('255,241,183',Math.max(impact*.13,finish*.2));bands(t,'#231b2d');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,161+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

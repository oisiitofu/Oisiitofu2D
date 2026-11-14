'use strict';

const ZidaneLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('zidane',['cutin','effects']);
 const shots=[
  [0,395,675,1055,673,720,428,.91,0,1],[35,685,675,1055,673,870,438,.97,-.011,31],
  [47,864,675,1067,664,965,442,1,.019,7],[65,934,671,1141,626,1036,414,.95,-.02,8],
  [83,1064,501,1194,583,1129,360,.91,.024,9],[103,1338,412,1190,539,1267,308,.87,-.029,-12],
  [122,1290,575,1159,599,1223,409,.93,.018,-17],[142,947,511,1129,563,1038,375,.91,-.023,16],
  [163,858,675,1155,612,1004,421,.87,0,47],[182,893,584,1188,620,1040,383,.9,-.009,11],
  [194,968,482,1213,609,1090,361,.98,.024,20],[228,973,675,1722,332,1211,401,.79,0,1]
 ];
 const hits=[47,65,83,103,122,142];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=ZidaneLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9))),finish=pulse(t,194,5,25);
  const trance=pulse(t,162,9,38);
  frameClip();
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#203659');sky.addColorStop(.59,'#636b83');sky.addColorStop(1,'#cf9c82');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.54,finish));
  ctx.fillStyle='#49425a';ctx.fillRect(-1800,677,6100,600);
  for(const [px,py,width] of [[698,500,405],[1200,419,270],[1215,576,256]]){
   ctx.fillStyle='#61566a';ctx.fillRect(px,py,width,20);
   ctx.fillStyle='#e3bac1';ctx.fillRect(px,py,width,4);
   ctx.strokeStyle='#958297';ctx.lineWidth=4;ctx.beginPath();
   ctx.moveTo(px+22,py+20);ctx.lineTo(px+58,py+65);ctx.lineTo(px+97,py+20);ctx.stroke();
  }
  art.glow(3,x,y-133,506,455,trance*.68,-.24);
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.1);
  target(opponent,tx,ty-impact*13,-.11-impact*.33-ease((t-195)/28)*1.33,2.55);
  for(const [i,hit] of hits.entries()){
   art.strike(i===2?2:i%2,tx-21,ty-108,383+i*12,301,pulse(t,hit,4,9),[-.17,.37,-.57,.92,-.81,.49][i]);
  }
  const spread=480+ease((t-194)/18)*421;
  for(const angle of [-.58,.56])art.strike(3,tx,ty-130,spread,301,finish,angle);
  art.strike(2,tx,ty-125,416+ease((t-195)/14)*215,392,pulse(t,198,4,17));
  ctx.restore();flash('255,218,176',Math.max(trance*.15,impact*.11,finish*.21));bands(t,'#172135');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(2,x,y,168+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

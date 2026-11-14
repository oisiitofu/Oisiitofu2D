'use strict';

const ZackLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('zack',['cutin','effects']);
 const shots=[
  [0,406,674,1066,673,736,431,.94,0,1],[34,674,674,1066,673,866,441,.98,-.017,53],
  [46,860,674,1068,662,963,445,1.02,.018,17],[63,927,665,1097,613,1012,409,.97,-.018,19],
  [81,1004,586,1194,555,1099,368,.94,.028,23],[100,1092,493,1258,491,1175,319,.89,-.023,27],
  [120,1191,442,1378,458,1285,292,.88,.018,26],[141,1241,543,1490,593,1366,365,.95,.03,31],
  [155,1261,674,1504,586,1382,430,.9,-.013,44],[175,1324,674,1513,622,1418,439,.95,-.023,21],
  [191,1382,674,1530,662,1460,432,1.02,.025,17],[221,1476,674,2027,358,1630,404,.79,0,1]
 ];
 const hits=[46,63,81,100,120,141];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=ZackLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9))),finish=pulse(t,191,5,25);
  frameClip();
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#18213d');sky.addColorStop(.54,'#355069');sky.addColorStop(1,'#946354');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.63,finish));
  for(let i=0;i<15;i++){
   const x=i*339-1270,h=370-i%5*38;
   ctx.fillStyle=i%2===0?'#2d344a':'#38364d';
   ctx.beginPath();ctx.moveTo(x-86,673);ctx.lineTo(x,h+58);ctx.lineTo(x+133,h);ctx.lineTo(x+229,673);ctx.fill();
   ctx.strokeStyle=i%3===0?'#86595b':'#495269';ctx.lineWidth=4;
   ctx.beginPath();ctx.moveTo(x,h+58);ctx.lineTo(x+133,h);ctx.lineTo(x+229,673);ctx.stroke();
  }
  ctx.fillStyle='#3c3a47';ctx.fillRect(-1800,676,6300,560);
  ctx.strokeStyle='#816354';ctx.lineWidth=5;
  ctx.beginPath();ctx.moveTo(-1800,677);ctx.lineTo(4500,677);ctx.stroke();
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,3.05);
  target(opponent,tx,ty-impact*15,-.12-impact*.39-ease((t-191)/27)*1.31,2.55);
  for(const [i,hit] of hits.entries()){
   art.strike(i%3,tx-30,ty-126,434+i*13,315,pulse(t,hit,4,9),[-.12,-.7,-.95,.7,.15,1.02][i]);
  }
  art.strike(3,tx-32,ty-138,605+ease((t-191)/20)*450,493,finish,-.25);
  const length=250+ease((t-192)/16)*620;
  ctx.save();ctx.globalAlpha=finish*.75;ctx.strokeStyle='#fff0ac';ctx.lineWidth=5;
  for(let i=0;i<4;i++){
   ctx.beginPath();ctx.moveTo(tx-95-i*18,ty-98+i*22);ctx.lineTo(tx+length,ty-173+i*28);ctx.stroke();
  }
  ctx.restore();ctx.restore();
  flash('255,209,148',Math.max(impact*.13,finish*.2));bands(t,'#161c2c');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,161+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

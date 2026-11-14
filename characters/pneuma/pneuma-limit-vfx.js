'use strict';
const PneumaLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('pneuma',['cutin','effects']);
 const shots=[
  [0,443,671,1116,669,780,435,.93,0,1],[31,661,612,1116,669,889,405,.96,0,3],
  [44,870,588,1122,651,996,410,.99,.022,7],[61,840,404,1175,602,1008,341,.89,-.02,16],
  [79,1188,279,1186,525,1187,311,.84,.026,9],[98,1401,448,1162,526,1282,352,.89,-.024,-14],
  [118,1260,478,1083,590,1172,376,.94,.02,-13],[138,845,389,1093,566,969,343,.9,-.02,44],
  [161,687,468,1163,619,925,389,.85,0,48],[184,738,370,1197,640,968,374,.83,0,47],
  [197,804,350,1202,630,1003,363,.93,.025,42],[232,807,669,1757,322,1199,397,.76,0,1]
 ];
 const points=[[738,493],[944,303],[1242,172],[1449,378],[1240,442],[845,265]];
 const pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=PneumaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...PneumaLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,197,5,24);
  frameClip();
  const sky=ctx.createRadialGradient(W*.51,H*.31,20,W*.51,H*.31,W*.77);
  sky.addColorStop(0,'#4c847b');sky.addColorStop(.53,'#2c4f65');sky.addColorStop(1,'#17233d');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.51,finish));
  ctx.fillStyle='#244957';ctx.fillRect(-1800,674,6200,640);
  for(const [i,[px,py]] of points.entries()){
   const glow=pulse(t,hits[i],15,18);
   if(glow<=0)continue;
   ctx.save();ctx.globalAlpha=glow*.8;ctx.strokeStyle='#9ff5ed';ctx.lineWidth=5;
   ctx.beginPath();ctx.moveTo(px-92,py+57);ctx.lineTo(px,py-44);ctx.lineTo(px+92,py+57);
   ctx.lineTo(px-92,py+57);ctx.stroke();ctx.restore();
  }
  art.glow(3,x+110,y-135,412,331,pulse(t,184,18,13)*.76,.19);
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.12);
  target(opponent,tx,ty-impact*14,-.1-impact*.35-ease((t-198)/27)*1.34,2.55);
  for(const [i,h] of hits.entries())art.strike(i%3,tx-11,ty-116,419+i*12,323,pulse(t,h,4,9),[-.34,.48,.7,-.52,.37,-.27][i]);
  const sx=x+119,sy=y-135,dx=tx-sx,dy=ty-117-sy,a=Math.atan2(dy,dx);
  art.strike(3,sx+dx*.56,sy+dy*.56,Math.hypot(dx,dy)+229,337+ease((t-197)/11)*163,finish,a);
  art.strike(2,tx+55,ty-113,595,417,pulse(t,200,3,16),a);
  ctx.restore();flash('198,255,238',Math.max(impact*.1,finish*.23));bands(t,'#141f37');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,170+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

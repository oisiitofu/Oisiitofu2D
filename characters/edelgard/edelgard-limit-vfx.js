'use strict';
const EdelgardLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('edelgard',['cutin','effects']);
 const shots=[
  [0,387,672,1078,605,732,423,.93,0,0],[33,697,672,1078,605,888,421,.98,0,2],
  [46,897,673,1081,598,990,414,1.02,.022,11],[64,1001,641,1157,569,1079,404,.96,-.02,8],
  [83,1084,605,1224,550,1154,381,.93,.024,10],[103,1153,543,1325,575,1239,369,.92,-.024,13],
  [123,1267,568,1417,555,1342,386,.96,.022,42],[143,1397,531,1553,514,1475,372,.92,-.021,44],
  [171,1372,536,1577,528,1475,393,.89,0,45],[194,1381,529,1564,527,1473,387,.91,-.016,15],
  [207,1410,532,1586,513,1498,377,.99,.027,16],[241,1410,532,2024,303,1630,399,.76,0,0]
 ];
 const pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=EdelgardLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...EdelgardLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,207,5,26);
  frameClip();
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#343047');sky.addColorStop(.62,'#754551');sky.addColorStop(1,'#a36759');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.66,finish));
  for(let i=0;i<13;i++){
   const px=i*330-1150;
   ctx.fillStyle=i%2?'#483743':'#4c3542';ctx.fillRect(px,221,92,461);
   ctx.fillStyle='#a3655b';ctx.fillRect(px+20,232,52,116);
  }
  const steps=[[-1900,675,2900],[1000,641,86],[1086,607,115],[1201,570,121],[1322,535,3030]];
  for(const [px,py,w] of steps){
   ctx.fillStyle='#4d383e';ctx.fillRect(px,py,w,950-py);
   ctx.fillStyle='#a47b6d';ctx.fillRect(px,py,w,7);
  }
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.17);
  target(opponent,tx,ty-impact*13,-.12-impact*.38-ease((t-208)/26)*1.36,2.54);
  for(const [i,h] of hits.entries())art.strike([0,0,1,2,0,1][i],tx-11,ty-112,421+i*16,328,pulse(t,h,4,9),[-.26,.55,-.83,.32,-.37,.6][i]);
  art.strike(3,tx+25,ty-131,530+ease((t-207)/18)*447,481,finish,-.43);
  ctx.save();ctx.globalAlpha=finish*.89;ctx.strokeStyle='#ffbc8e';ctx.lineWidth=7;
  for(const side of [-1,1]){
   ctx.beginPath();ctx.moveTo(tx,535);ctx.lineTo(tx+side*118,554);
   ctx.lineTo(tx+side*216,542);ctx.lineTo(tx+side*407,633);ctx.stroke();
  }
  ctx.restore();ctx.restore();flash('255,173,133',Math.max(impact*.11,finish*.22));bands(t,'#241b2c');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,170+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

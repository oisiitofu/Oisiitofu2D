'use strict';
const RikiLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('riki',['cutin','effects']);
 const shots=[
  [0,476,671,1082,669,779,430,.94,0,0],[33,718,671,1082,669,900,432,.96,-.013,15],
  [47,883,671,1102,658,992,434,1,.018,9],[64,836,532,1153,628,994,375,.91,-.025,13],
  [82,1017,491,1231,583,1124,354,.89,.025,8],[102,1116,670,1300,631,1208,434,.93,-.019,17],
  [122,1238,631,1410,583,1324,399,.94,.024,19],[142,1222,545,1482,589,1352,366,.89,-.02,16],
  [170,1491,179,1482,660,1486,355,.75,0,16],[187,1452,356,1480,663,1466,388,.82,.009,10],
  [198,1456,671,1504,650,1480,432,.96,.024,11],[233,1440,671,2049,323,1710,401,.77,0,0]
 ];
 const pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=RikiLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...RikiLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,198,5,24);
  frameClip();
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#215452');sky.addColorStop(.64,'#6d9175');sky.addColorStop(1,'#c9a56e');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.61,finish));
  for(let i=0;i<15;i++){
   const px=i*342-1290,top=166+i%4*74;
   ctx.fillStyle=i%2?'#345f52':'#487363';ctx.fillRect(px,top,48,676-top);
   ctx.beginPath();ctx.ellipse(px+25,top+20,102,96,-.07,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle='#425c53';ctx.fillRect(-1900,676,6300,620);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.16);
  target(opponent,tx,ty-impact*14,-.11-impact*.37-ease((t-199)/27)*1.35,2.56);
  for(const [i,h] of hits.entries())art.strike([0,1,2,0,0,0][i],tx-16,ty-113,393+i*16,308,pulse(t,h,4,9),[.1,-.55,.37,-.77,.73,-.27][i]);
  const rise=pulse(t,163,19,18);
  ctx.save();ctx.globalAlpha=rise*.83;ctx.fillStyle='#ffe0a6';ctx.strokeStyle='#fbeebf';ctx.lineWidth=5;
  ctx.beginPath();ctx.moveTo(x,y-133);ctx.lineTo(x+28,y-201);ctx.stroke();
  ctx.beginPath();ctx.ellipse(x+28,y-233,42,54,.17,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
  art.strike(3,tx,ty-121,mix(425,951,ease((t-198)/18)),505,finish,.12);
  ctx.save();ctx.globalAlpha=finish*.91;ctx.strokeStyle='#ffe39c';ctx.lineWidth=5;
  const reach=94+ease((t-198)/20)*572;
  for(const k of [.7,1]){
   ctx.beginPath();ctx.ellipse(tx,ty-26,reach*k,reach*.24*k,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.fillStyle='#e7b16a';
  for(let i=0;i<20;i++){
   const a=i*2.4,r=reach*(.35+i%5*.14),px=tx+Math.cos(a)*r,py=ty-40-Math.abs(Math.sin(a))*r*.39;
   ctx.beginPath();ctx.moveTo(px,py-11);ctx.lineTo(px+13,py-2);ctx.lineTo(px+6,py+11);
   ctx.lineTo(px-13,py+6);ctx.closePath();ctx.fill();
  }
  ctx.restore();ctx.restore();flash('255,238,175',Math.max(impact*.1,finish*.23));bands(t,'#223529');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,169+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

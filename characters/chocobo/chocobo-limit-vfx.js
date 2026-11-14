'use strict';

const ChocoboLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('chocobo',['cutin','effects']);
 const shots=[
  [0,310,683,1080,680,762,422,.88,0,0],[28,522,683,1080,680,786,422,.92,0,34],
  [40,791,683,1080,680,935,436,.97,.018,37],[47,942,683,1105,662,1024,433,1,.02,9],
  [63,992,548,1178,606,1085,348,.92,-.035,10],[74,804,437,1219,587,1012,305,.86,-.028,5],
  [82,1057,433,1256,582,1150,315,.9,.02,11],[101,1196,623,1280,664,1238,414,.94,.03,20],
  [120,969,801,1266,667,1117,489,.88,.016,15],[139,1165,677,1350,622,1257,425,.89,-.028,17],
  [160,1270,677,1459,633,1370,397,.88,.01,8],[191,1242,677,1448,685,1344,379,.8,.026,12],
  [222,1241,677,1970,506,1578,411,.76,0,0],[225,1241,677,2030,471,1590,424,.76,0,0]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function draw({attacker,target:opponent,face,time}){
  const t=ChocoboLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[47,63,82,101,120,139];
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9)));
  const finish=pulse(t,191,5,27);
  frameClip();
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#241c38');sky.addColorStop(.62,'#9d5347');sky.addColorStop(1,'#d89963');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.56,finish));
  ctx.fillStyle='#a76163';ctx.beginPath();ctx.moveTo(-1200,683);
  for(let i=0;i<14;i++)ctx.lineTo(-1200+i*414,i%2===0?622:395+i%3*37);
  ctx.lineTo(4500,900);ctx.fill();
  ctx.fillStyle='#635047';ctx.beginPath();ctx.moveTo(-1700,685);ctx.lineTo(815,685);
  ctx.lineTo(930,791);ctx.lineTo(1018,791);ctx.lineTo(1175,683);
  ctx.lineTo(4100,683);ctx.lineTo(4100,1420);ctx.lineTo(-1700,1420);ctx.fill();
  ctx.fillStyle='#b88857';ctx.fillRect(706,435,163,17);
  ctx.fillStyle='#855943';ctx.fillRect(727,452,123,20);
  const sprite={...attacker,x,y,face:pose===20?-1:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3);
  target(opponent,tx,ty-impact*16,-.15-impact*.4-ease((t-192)/25)*1.41,2.6);
  for(const [i,hit] of hits.entries()){
   const strength=pulse(t,hit,5,9);
   art.strike(i%3,tx-35,ty-104,358+i*11,265+14*i,strength,[.08,-.44,.74,.95,-.31,-.21][i]);
  }
  const fall=ease((t-159)/32);
  if(fall>0&&t<202){
   ctx.save();ctx.globalAlpha=pulse(t,191,28,12);
   const mx=tx+mix(350,0,fall),my=mix(-105,ty-124,fall);
   for(let i=0;i<14;i++){
    const offset=i*23-150,length=(i%5)*26+90;
    ctx.strokeStyle=i%3===0?'#fff4bc':'#ff9062';ctx.lineWidth=3+i%4;
    ctx.beginPath();ctx.moveTo(mx+62+offset,my+15);ctx.lineTo(mx+length+offset,my-length*1.7);ctx.stroke();
   }
   ctx.restore();
  }
  art.strike(3,tx+mix(350,0,fall),mix(-105,ty-124,fall),325+160*fall,350+171*fall,pulse(t,191,33,16),-.44);
  const spread=165+660*ease((t-191)/20);
  art.strike(1,tx,ty-50,spread,spread*.41,finish);
  ctx.save();ctx.globalAlpha=finish*.75;ctx.strokeStyle='#ffcf89';ctx.lineWidth=6;
  ctx.beginPath();ctx.ellipse(tx,ty-45,spread*.62,spread*.15,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  ctx.restore();
  flash('255,190,115',Math.max(impact*.14,finish*.21));bands(t,'#241523');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,164+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

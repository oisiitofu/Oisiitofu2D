'use strict';

const HachiwareLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('hachiware',['cutin','effects']);
 const shots=[
  [0,467,671,1048,672,755,433,.93,0,0],[37,699,671,1048,672,856,435,.96,-.01,8],
  [48,844,671,1054,661,954,435,1,.015,16],[65,900,671,1110,649,997,424,.97,-.023,31],
  [83,983,491,1147,580,1065,359,.91,.021,37],[103,1103,567,1124,623,1121,405,.95,-.022,19],
  [121,932,671,1173,662,1056,447,.97,.008,40],[142,972,671,1208,649,1090,429,.94,.025,23],
  [164,784,671,1240,668,1012,444,.86,-.025,0],[181,975,671,1242,668,1100,451,.93,-.006,7],
  [192,1113,662,1257,664,1199,446,1.05,.026,34],[224,1087,671,1774,385,1332,414,.78,0,0]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=HachiwareLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[48,65,83,103,121,142];
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,3,9))),finish=pulse(t,192,4,25);
  frameClip();
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#395e9d');sky.addColorStop(.67,'#87b3ca');sky.addColorStop(1,'#eee3c5');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.49,finish));
  for(let i=0;i<11;i++){
   const px=i*436-1000;
   ctx.fillStyle=i%2===0?'#547791':'#7f9eaa';
   ctx.beginPath();ctx.ellipse(px,735,349,360+i%4*38,-.16,Math.PI,2*Math.PI);ctx.fill();
  }
  ctx.fillStyle='#698d8a';ctx.fillRect(-1500,675,5600,620);
  ctx.strokeStyle='#b9ccac';ctx.lineWidth=4;
  ctx.beginPath();ctx.moveTo(-1500,676);ctx.lineTo(3800,676);ctx.stroke();
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.05);
  target(opponent,tx,ty-impact*13,-.09-impact*.37-ease((t-193)/26)*1.35,2.55);
  for(const [i,hit] of hits.entries()){
   const slot=i===4?2:i%2;
   art.strike(slot,tx-19,ty-114,350+i*18,260+i*12,pulse(t,hit,4,9),[-.03,.25,-1.02,.93,0,-.2][i]);
  }
  ctx.save();ctx.globalAlpha=finish*.72;ctx.strokeStyle='#edfaff';ctx.lineWidth=4;
  const spread=95+310*ease((t-191)/18);
  ctx.beginPath();ctx.ellipse(tx,ty-110,spread,spread*.48,-.16,0,Math.PI*2);ctx.stroke();
  ctx.restore();
  art.strike(3,tx-33,ty-118,475+ease((t-190)/18)*385,405,finish,.11);
  ctx.restore();flash('255,247,195',Math.max(pulse(t,121,1,3)*.29,finish*.18));bands(t,'#1a2d46');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,152+time*4,143,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

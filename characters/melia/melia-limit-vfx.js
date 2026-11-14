'use strict';
const MeliaLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('melia',['cutin','effects']);
 const shots=[
  [0,493,667,1123,669,808,429,.94,0,0],[35,634,665,1123,669,878,428,.96,0,40],
  [46,785,663,1144,654,965,433,1,.016,13],[64,730,527,1192,610,961,379,.9,-.019,41],
  [84,527,412,1233,565,880,336,.85,.021,42],[104,742,253,1263,543,1002,298,.84,-.021,43],
  [124,1012,345,1291,539,1152,329,.88,.025,45],[144,878,484,1326,593,1102,371,.91,-.018,19],
  [169,810,576,1370,644,1090,415,.86,0,40],[202,815,563,1386,643,1100,408,.88,.022,17],
  [238,815,670,1911,324,1290,398,.76,0,0]
 ];
 const colors=['#dabbff','#ffad9b','#a6edff'];
 const pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function orb(x,y,r,color,alpha,angle){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;
  const glow=ctx.createRadialGradient(0,0,1,0,0,r);
  glow.addColorStop(0,'#fffaff');glow.addColorStop(.58,color);glow.addColorStop(1,'#593e76');
  ctx.fillStyle=glow;ctx.strokeStyle=color;ctx.lineWidth=4;
  ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(0,0,r*1.38,r*.46,0,0,Math.PI*2);ctx.stroke();ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=MeliaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...MeliaLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,202,6,25);
  frameClip();
  const sky=ctx.createRadialGradient(W*.51,H*.33,13,W*.51,H*.33,W*.73);
  sky.addColorStop(0,'#63618d');sky.addColorStop(.59,'#3f426b');sky.addColorStop(1,'#19253d');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.56,finish));
  ctx.fillStyle='#354667';ctx.fillRect(-1800,672,6200,650);
  ctx.strokeStyle='#93afc9';ctx.lineWidth=4;
  for(const r of [419,514,629]){
   ctx.beginPath();ctx.ellipse(1042,675,r,r*.24,0,0,Math.PI*2);ctx.stroke();
  }
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.15);
  target(opponent,tx,ty-impact*14,-.11-impact*.35-ease((t-203)/28)*1.34,2.53);
  for(const [i,h] of hits.entries()){
   const pc=ease((t-h+12)/12),a=t*.05+i*1.98;
   orb(mix(x+Math.cos(a)*164,tx,pc),mix(y-155+Math.sin(a)*110,ty-113,pc),39,colors[i%3],pulse(t,h,13,3),a);
   art.strike(i%3,tx,ty-118,407+i*13,316,pulse(t,h,4,9),[-.22,-.43,.7,.29,-.61,.32][i]);
  }
  for(let i=0;i<3;i++){
   const h=198+i*4,drop=ease((t-h+14)/14),ox=tx+(i-1)*179;
   orb(mix(ox,tx,drop),mix(263-i*39,ty-114,drop),65,colors[i],pulse(t,h,22,2),t*.09+i*2);
   const burst=pulse(t,h,3,17),impactX=mix(ox,tx,.55);
   art.strike([3,1,2][i],impactX,ty-(i===0?264:117),i===0?319:442,i===0?618:405,burst,.29*(1-i));
  }
  ctx.restore();flash('227,214,255',Math.max(impact*.1,finish*.22));bands(t,'#22283e');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(1,x,y,169+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

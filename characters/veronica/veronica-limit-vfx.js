'use strict';
const VeronicaLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('veronica',['cutin','effects']);
 const shots=[
  [0,423,671,1089,670,756,428,.94,0,1],[33,589,671,1089,670,839,433,.96,0,7],
  [47,742,670,1109,660,926,432,1,.019,18],[65,811,639,1147,618,979,409,.96,-.019,24],
  [84,829,554,1201,560,1014,347,.89,.023,30],[104,996,494,1199,536,1098,324,.88,-.025,40],
  [124,1333,459,1210,520,1272,329,.88,.026,-31],[144,1310,606,1166,582,1238,379,.93,-.021,-42],
  [165,1321,671,1170,638,1245,424,.9,0,-43],[190,1313,672,1156,645,1235,429,.88,-.014,-21],
  [207,1312,659,1141,624,1227,416,.98,.024,-25],[244,1312,672,573,312,1048,408,.76,0,-1]
 ];
 const pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=VeronicaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...VeronicaLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,207,6,25),charge=pulse(t,190,23,16);
  frameClip();
  const sky=ctx.createRadialGradient(W*.5,H*.39,10,W*.5,H*.39,W*.76);
  sky.addColorStop(0,'#9c5969');sky.addColorStop(.56,'#573453');sky.addColorStop(1,'#241b38');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.59,finish));
  for(let i=0;i<13;i++){
   const px=i*407-1480;
   ctx.strokeStyle='#80546b';ctx.lineWidth=19;ctx.beginPath();
   ctx.moveTo(px,674);ctx.lineTo(px,411);ctx.quadraticCurveTo(px+20,291,px+194,212);
   ctx.quadraticCurveTo(px+372,291,px+389,411);ctx.lineTo(px+389,674);ctx.stroke();
  }
  ctx.fillStyle='#49334e';ctx.fillRect(-1700,673,6200,640);
  art.glow(3,x-89,y-167,388,346,charge*.87);
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.37);
  target(opponent,tx,ty-impact*12,-.09-impact*.33+ease((t-208)/29)*1.38,2.56);
  for(const [i,h] of hits.entries()){
   const slot=[3,0,1,2,0,3][i],flight=ease((t-h+10)/10),power=pulse(t,h,slot===0?10:4,9);
   if(slot===0){
    const side=i===4?1:-1;
    art.strike(0,mix(tx+side*332,tx,flight),mix(ty-183,ty-117,flight),307,285,power,side*.25);
   }else art.strike(slot,tx,ty-(slot===2?276:121),395,slot===2?603:323,power,0);
  }
  const spread=122+ease((t-207)/18)*670;
  for(const [i,py] of [0,-91,-179].entries())art.strike(3,tx,ty-112+py,spread*(1.1-i*.13),383-i*43,finish,t*.049+i);
  const wave=ease((t-207)/12),after=pulse(t,211,2,17);
  ctx.save();ctx.globalAlpha=after*.8;ctx.strokeStyle='#ffe9ad';ctx.lineWidth=7;
  for(const scale of [.76,1]){
   ctx.beginPath();ctx.ellipse(tx,ty-55,90+608*wave*scale,33+155*wave*scale,0,0,Math.PI*2);ctx.stroke();
  }
  for(let i=0;i<23;i++){
   const angle=i*2.4,r=wave*(202+i%6*51),px=tx+Math.cos(angle)*r,py=ty-133+Math.sin(angle)*r*.66;
   ctx.fillStyle=i%3?'#ffc986':'#fff9d7';
   ctx.beginPath();ctx.moveTo(px,py-13);ctx.lineTo(px+6,py);ctx.lineTo(px,py+13);ctx.lineTo(px-6,py);ctx.closePath();ctx.fill();
  }
  ctx.restore();
  ctx.restore();flash('255,185,159',Math.max(impact*.11,finish*.23));bands(t,'#23142c');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(3,x,y,167+time*4,148,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

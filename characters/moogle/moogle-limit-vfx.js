'use strict';
const MoogleLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('moogle',['cutin','effects']);
 const shots=[
  [0,424,672,1090,671,757,426,.94,0,1],[33,693,672,1090,671,891,434,.97,0,30],
  [46,907,668,1098,660,1002,434,1,.018,8],[64,1020,498,1176,598,1098,353,.91,-.021,14],
  [83,1217,398,1170,539,1194,324,.88,.028,-16],[102,1265,601,1089,585,1176,388,.94,-.023,-13],
  [122,1015,656,1114,622,1064,426,.97,.021,46],[142,874,526,1193,622,1034,369,.9,-.02,39],
  [165,815,672,1240,659,1027,425,.88,0,19],[195,916,613,1253,618,1084,397,.94,.025,24],
  [230,930,672,1783,351,1236,408,.76,0,1]
 ];
 const pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=MoogleLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...MoogleLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,195,5,26);
  frameClip();
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#273754');sky.addColorStop(.58,'#5b687e');sky.addColorStop(1,'#568580');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.51,finish));
  for(let i=0;i<18;i++){
   const px=i*255-1390,height=173+(i*83)%290;
   ctx.fillStyle=i%2?'#3c596b':'#395465';
   ctx.beginPath();ctx.moveTo(px-94,673);ctx.lineTo(px-37,673-height*.74);
   ctx.quadraticCurveTo(px,673-height,px+37,673-height*.74);ctx.lineTo(px+94,673);ctx.fill();
  }
  ctx.fillStyle='#365c65';ctx.fillRect(-1600,673,6200,650);
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.42);
  target(opponent,tx,ty-impact*13,-.12-impact*.35-ease((t-196)/29)*1.37,2.57);
  for(const [i,h] of hits.entries())art.strike(i%3,tx,ty-111,379+i*19,309,pulse(t,h,4,9),[-.28,.65,-.69,.53,-.22,.31][i]);
  const lift=ease((t-189)/16);
  art.strike(3,tx-34,ty-142-112*lift,426+360*lift,474+263*lift,finish,t*.042);
  ctx.save();ctx.globalAlpha=finish*.72;ctx.strokeStyle='#b7f7dd';ctx.lineWidth=5;
  for(let i=0;i<8;i++){
   const a=t*.2+i*.67,r=85+i*17;
   ctx.beginPath();ctx.ellipse(tx+Math.sin(a)*27,ty-27-i*46*lift,r,r*.34,-.12,a,a+4.12);ctx.stroke();
  }
  ctx.restore();
  ctx.save();ctx.globalAlpha=finish*.88;ctx.fillStyle='#e4ffe4';
  for(let i=0;i<17;i++){
   const a=i*2.4+t*.29,r=101+(i*37)%265;
   const px=tx+Math.cos(a)*r,py=ty-84-(i*77)%415;
   ctx.beginPath();ctx.ellipse(px,py,16+i%5,4,a,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();ctx.restore();flash('204,250,230',Math.max(impact*.11,finish*.19));bands(t,'#1b253a');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,170+time*4,150,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

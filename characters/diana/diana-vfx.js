'use strict';
const DianaVFX=(()=>{
 const k=CharacterVFXKit.create('diana');
 function grid(x,y,w,h,color,age=0){
  ctx.save();ctx.translate(x,y);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=1.5;
  ctx.globalAlpha*=.74;ctx.strokeRect(-w/2,-h/2,w,h);
  ctx.globalAlpha*=.57;ctx.beginPath();
  for(let i=1;i<5;i++){const xx=w*(i/5-.5);ctx.moveTo(xx,-h/2);ctx.lineTo(xx,h/2);}
  for(let i=1;i<4;i++){const yy=h*(i/4-.5);ctx.moveTo(-w/2,yy);ctx.lineTo(w/2,yy);}
  ctx.stroke();
  ctx.globalAlpha*=1.7;
  for(let i=0;i<5;i++){const a=(i+Math.floor(age/4))%5,b=(i*7+Math.floor(age/5))%4;ctx.fillRect(w*(a/5-.5)+2,h*(b/4-.5)+2,4,3);}
  ctx.restore();
 }
 function ring(x,y,r,color){
  ctx.save();ctx.translate(x,y);ctx.strokeStyle=color;ctx.lineWidth=1.8;ctx.setLineDash([6,4]);
  ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);ctx.rotate(Math.PI/4);ctx.strokeRect(-r*.58,-r*.58,r*1.16,r*1.16);ctx.restore();
 }
 function draw(f){
  if(f.respawn)return;
  const a=f.attack,t=f.timer;
  for(const o of BattlePlayers.targets(f))if(dianaMarked(f,o))ring(o.x,o.y-45,14,'#ff927f');
  if(!a)return;
  const e=k.envelope(f);
  if(e)grid(e.x,e.y,Math.max(14,e.w*.84),Math.max(14,e.h*.74),'#7deaff',t);
  if(a.type==='dragon'){
   const o=fighters.find(o=>o.id===a.scanId),x=o?.x??f.x+f.face*73,y=(o?.y??f.y)-48;
   grid(x,y,52,41,a.exposeAt?'#ff927f':'#7deaff',t);
   ctx.save();ctx.strokeStyle='#68d9ff88';ctx.lineWidth=2;
   ctx.beginPath();ctx.moveTo(f.x+f.face*23,f.y-49);ctx.lineTo(x,y);ctx.stroke();ctx.restore();
   if(t>=18&&t<=35&&o&&!a.scanDone)ring(x,y,21,'#d1fcff');
  }
  if(a.type==='rise'&&t>=7&&!a.detached){
   ctx.save();ctx.translate(f.x,f.y-8);ctx.rotate(-f.vx*.033);
   const gradient=ctx.createLinearGradient(0,0,0,45);gradient.addColorStop(0,'#dcffff');gradient.addColorStop(.4,'#24b6ff');gradient.addColorStop(1,'#24b6ff00');
   ctx.fillStyle=gradient;
   for(const x of [-9,9]){ctx.beginPath();ctx.moveTo(x-6,0);ctx.lineTo(x+6,0);ctx.lineTo(x,34+4*Math.sin(t*.8));ctx.fill();}
   ctx.restore();
  }
  if(['gale','airDrop'].includes(a.type)){
   if(t<20)ring(f.x,f.y-28,10+t,'#86eaff');
   else if(t<30){
    const age=(t-20)/10;ctx.save();ctx.globalAlpha*=1-age;
    for(const scale of [1,.72,.4]){ctx.strokeStyle='#8beeff';ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(f.x,f.y-17,(55+74*age)*scale,14+age*15,0,0,Math.PI*2);ctx.stroke();}
    ctx.restore();
   }
  }
 }
 function drawObjects(){
  for(const q of DianaRules.objects){
   if(q.dead)continue;
   ctx.save();ctx.translate(q.x,q.y);ctx.rotate(Math.atan2(q.vy,q.vx));ctx.fillStyle=q.redirected?'#aef5ff':'#eff7ff';ctx.strokeStyle='#246e98';ctx.lineWidth=1.5;
   ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(7,-4);ctx.lineTo(-10,-4);ctx.lineTo(-13,-6);ctx.lineTo(-13,6);ctx.lineTo(-10,4);ctx.lineTo(7,4);ctx.closePath();ctx.fill();ctx.stroke();
   const trail=ctx.createLinearGradient(-38,0,-13,0);trail.addColorStop(0,'#3dcaff00');trail.addColorStop(1,'#a8f8ff');
   ctx.fillStyle=trail;ctx.fillRect(-38,-2,25,4);ctx.restore();
  }
 }
 function impact(v){grid(v.x,v.y,18+v.power*1.4,16+v.power,'#a8f5ff',v.max-v.life);}
 return {draw,drawObjects,impact};
})();

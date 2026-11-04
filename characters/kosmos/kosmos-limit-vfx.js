'use strict';
const KosmosLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('kosmos',['cutin','court','poses','effects']);
 const shots=[
  [0,563,651,861,626,717,454,1.19,-.029,0],
  [42,556,635,930,592,744,430,1.12,.035,0],
  [65,493,570,1004,570,733,405,.96,-.062,1],
  [93,460,544,1052,564,761,393,.95,.029,2],
  [120,464,545,1062,559,767,400,.98,-.029,3],
  [143,446,551,1073,539,768,399,1.01,.036,3],
  [169,450,549,1082,540,783,400,.91,-.055,4],
  [185,462,555,1112,545,801,396,1.04,.044,4],
  [199,477,573,1244,479,827,413,.95,-.027,4],
  [230,482,635,1550,332,854,432,.96,.012,5],
  [260,494,642,1752,254,877,450,.93,0,5]
 ];
 function volley(t,x,y,tx,ty){
  const arcs=[-210,166,-128,98,-56,40];
  for(const [i,curve] of arcs.entries()){
   const start=142+i*3,duration=181-start,p=unit((t-start)/duration);
   if(!p||p===1)continue;
   const route=q=>[mix(x,tx,q),mix(y,ty,q)+Math.sin(Math.PI*q)*curve];
   const alpha=ease(p*9)*(1-ease((p-.92)*12));
   const [sx,sy]=route(p*.60),[ex,ey]=route(p);
   const halo=ctx.createLinearGradient(sx,sy,ex,ey);
   halo.addColorStop(0,'#168aff00');halo.addColorStop(1,'#168aff');
   const core=ctx.createLinearGradient(sx,sy,ex,ey);
   core.addColorStop(0,'#5dbdff00');core.addColorStop(.75,'#5dbdff');core.addColorStop(1,'#e6fbff');
   ctx.save();ctx.lineCap='round';ctx.globalCompositeOperation='screen';
   ctx.beginPath();
   for(let n=0;n<10;n++){
    const [px,py]=route(p*(.60+n*.40/9));
    if(n===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
   }
   ctx.lineWidth=16-i;ctx.globalAlpha=alpha*.54;ctx.strokeStyle=halo;ctx.stroke();
   ctx.lineWidth=4;ctx.globalAlpha=alpha*.95;ctx.strokeStyle=core;ctx.stroke();
   ctx.restore();
  }
 }
 function cutin(t,time){
  const s=1.035+time*.001,opacity=ease(t/4)*(1-ease((t-23)/10));
  if(!opacity)return;
  ctx.save();ctx.beginPath();ctx.moveTo(0,103);ctx.lineTo(W,151);ctx.lineTo(W,720);ctx.lineTo(0,672);
  ctx.closePath();ctx.clip();
  art.portrait(s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=KosmosLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const shock=ease((t-179)/7)*(1-ease((t-192)/27));
  frameClip();ctx.fillStyle='#071525';ctx.fillRect(0,0,W,H);
  art.image('court',-115-t*.18,-99+ease((t-55)/65)*58,W+302,H+164);
  world(cx,cy,z,roll,face,t,shock);
  target(opponent,tx,ty,-.07+Math.sin(t*.155)*.13-ease((t-187)/26)*1.37);
  art.grid('poses',index,3,2,x,y,384);
  const emitter=ease((t-100)/25)*(1-ease((t-183)/20));
  const recoil=ease((t-155)/15),bx=x+mix(71,45,recoil),by=y-mix(207,190,recoil);
  art.glow(0,bx,by,76+emitter*27,97+emitter*27,emitter*.77,t*.032);
  const fan=ease((t-142)/5)*(1-ease((t-160)/17));
  art.strike(2,bx+294,by+32,674,411,fan*.68);
  const discharge=ease((t-159)/5)*(1-ease((t-178)/8));
  art.strike(1,bx+278,by+48,588,196,discharge*.78,.16);
  volley(t,bx+38,by+9,1077,449);
  art.strike(3,1080,443,439+shock*651,360+shock*286,shock*.90);
  const echo=ease((t-183)/6)*(1-ease((t-197)/31));
  art.glow(0,1080,443,520+ease((t-183)/36)*578,329+echo*95,echo*.48,-t*.013);
  ctx.restore();flash('175,221,255',shock*.20);
  bands(t,'#0a1326');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/KosmosLimitProfile.contactHold;
  art.strike(3,x,y,141+52*p,134,1-p*.52,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const RenaLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('rena',['cutin','court','poses','effects']);
 const shots=[
  [0,537,657,902,619,715,450,1.17,-.04,0],
  [35,540,655,928,622,747,448,1.1,.035,1],
  [63,543,640,976,615,749,401,1,-.023,2],
  [92,520,546,977,581,744,368,.96,-.045,3],
  [130,492,514,959,583,737,362,.92,.037,3],
  [151,454,501,959,597,759,308,.86,-.068,4],
  [171,468,520,964,604,803,391,1.08,.045,4],
  [184,460,542,990,521,811,423,1.04,-.024,4],
  [214,456,637,1232,308,820,423,.96,.012,5],
  [247,464,650,1580,128,836,439,.93,0,5]
 ];
 function fallingStar(t,start,end,sx,sy,ex,ey,size){
  const p=unit((t-start)/(end-start));
  if(p<=0||p>=1)return;
  const path=p*p,opacity=ease(p*8);
  art.effect(1,mix(sx,ex,path),mix(sy,ey,path),size,size*.66,opacity,
   Math.atan2(ey-sy,ex-sx)-.78);
 }
 function fragments(t,x,y){
  const age=t-171,strength=1-ease(age/53);
  if(age<0||!strength)return;
  ctx.save();
  for(let i=0;i<42;i++){
   const angle=i*2.39996,speed=6+i%7*2.3;
   const px=x+Math.cos(angle)*age*speed,py=y+Math.sin(angle)*age*speed*.48-age*3;
   const length=4+i%5*2.3;
   ctx.save();ctx.translate(px,py);ctx.rotate(angle+age*.03);
   ctx.globalAlpha=strength*(.6+i%4*.13);
   ctx.fillStyle=['#ffda83','#ffd5f6','#a3e1ff'][i%3];
   ctx.beginPath();ctx.moveTo(0,-length);ctx.lineTo(length*.31,0);
   ctx.lineTo(0,length);ctx.lineTo(-length*.31,0);ctx.closePath();ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  const s=1.04+time*.0011,opacity=ease(t/4)*(1-ease((t-22)/9));
  if(!opacity)return;
  ctx.save();ctx.beginPath();ctx.moveTo(0,143);ctx.lineTo(W,72);ctx.lineTo(W,662);ctx.lineTo(0,733);
  ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=RenaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const hit=ease((t-167)/5)*(1-ease((t-173)/19));
  frameClip();ctx.fillStyle='#0c1230';ctx.fillRect(0,0,W,H);
  art.image('court',-115-t*.19,-108+ease((t-85)/63)*65,W+290,H+150);
  world(cx,cy,z,roll,face,t,hit);
  const circle=ease((t-48)/24)*(1-ease((t-178)/33));
  art.effect(0,958,545,440+circle*235,190+circle*106,circle*.84,t*.002);
  art.effect(0,470,172,420,244,circle*.76,-t*.006);
  target(opponent,tx,ty,-.07+Math.sin(t*.19)*circle*.11-ease((t-173)/28)*1.12);
  art.grid('poses',index,3,2,x,y,347);
  const falls=[[73,105,653,-96,908,554,262],[94,117,1130,-73,987,538,214],[106,131,756,-92,927,562,280],[129,172,923,-345,961,560,747]];
  for(const [start,end,sx,sy,ex,ey,size] of falls){
   fallingStar(t,start,end,sx,sy,ex,ey,size);
   const splash=ease((t-end)/4)*(1-ease((t-end-4)/14));
   if(end!==172)art.effect(2,ex,ey-62,225,242,splash*.72);
  }
  const flare=ease((t-166)/8)*(1-ease((t-184)/28));
  const ring=ease((t-171)/10)*(1-ease((t-182)/36));
  art.effect(2,954,325,455+flare*188,602+flare*255,flare*.93);
  art.effect(3,963,595,452+ease((t-171)/34)*1020,166+ring*197,ring*.86);
  fragments(t,963,554);
  ctx.restore();flash('255,228,168',hit*.23);bands(t,'#0b1226');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/RenaLimitProfile.contactHold;
  art.effect(2,x,y,124+46*p,144,1-p*.55,.12,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

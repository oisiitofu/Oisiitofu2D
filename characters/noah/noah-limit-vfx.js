'use strict';
const NoahLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('noah',['cutin','court','poses','effects']);
 const shots=[
  [0,537,657,858,623,709,446,1.18,-.026,0],
  [39,571,652,920,596,740,433,1.10,.044,0],
  [60,570,649,953,593,742,433,1.20,-.034,1],
  [83,735,622,992,566,832,419,1.13,.047,2],
  [104,772,584,1051,534,882,406,1.07,-.041,2],
  [127,620,496,1047,549,826,364,.91,.032,3],
  [155,648,423,1051,560,839,358,.90,-.025,3],
  [174,801,502,1047,565,906,392,1.04,.034,4],
  [187,808,575,1109,532,923,411,1.10,-.049,4],
  [210,773,633,1368,359,949,415,.96,.017,5],
  [258,775,648,1760,191,958,450,.92,0,5]
 ];
 function hall(t,rift,edge){
  const x=-113-t*.18,y=-104+ease((t-84)/60)*57,width=W+294,height=H+165;
  if(!rift){art.image('court',x,y,width,height);return;}
  const seam=[[0,434],[211,407],[420,412],[660,391],[887,373],[1153,355],[W,333]];
  for(const sign of [-1,1]){
   ctx.save();ctx.beginPath();
   for(const [i,[px,py]] of seam.entries()){
    const spread=rift*(15+Math.sin(i*.81)*35);
    if(i===0)ctx.moveTo(px,py-sign*spread);else ctx.lineTo(px,py-sign*spread);
   }
   ctx.strokeStyle='#59c7ff';ctx.globalAlpha=edge*.67;ctx.lineWidth=2.3;ctx.stroke();ctx.globalAlpha=1;
   ctx.lineTo(W,sign>0?-400:H+400);ctx.lineTo(0,sign>0?-400:H+400);ctx.closePath();ctx.clip();
   art.image('court',x+18*sign*rift,y-38*sign*rift,width,height);ctx.restore();
  }
  art.glow(3,W*.5,383,W*1.11,147+rift*98,edge*.87,-.07);
 }
 function shards(t){
  const age=t-183,opacity=1-ease(age/54);
  if(age<0||!opacity)return;
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<36;i++){
   const px=376+i*37+age*(i%4-1.5)*1.6,side=i%2?1:-1;
   const py=410-px*.065+side*(8+age*(3+i%6)),size=3+i%6*2.4;
   ctx.save();ctx.translate(px,py);ctx.rotate(i*2.39996+age*.06);
   ctx.globalAlpha=opacity*(.58+i%4*.1);ctx.fillStyle=i%3?'#80dbff':'#83a5ff';
   ctx.beginPath();ctx.moveTo(size,0);ctx.lineTo(-size*.48,size*.45);
   ctx.lineTo(-size*.7,-size*.30);ctx.closePath();ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  const s=1.035+time*.001,opacity=ease(t/4)*(1-ease((t-23)/10));
  if(!opacity)return;
  ctx.save();ctx.beginPath();ctx.moveTo(0,105);ctx.lineTo(W,154);ctx.lineTo(W,722);ctx.lineTo(0,673);
  ctx.closePath();ctx.clip();
  art.portrait(s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=NoahLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const hit=ease((t-179)/6)*(1-ease((t-189)/27));
  const rift=ease((t-180)/7)*(1-ease((t-198)/46));
  frameClip();ctx.fillStyle='#071324';ctx.fillRect(0,0,W,H);
  const edge=ease((t-179)/5)*(1-ease((t-204)/36));
  hall(t,rift,edge);
  world(cx,cy,z,roll,face,t,hit);
  target(opponent,tx,ty,-.10+Math.sin(t*.15)*.14-ease((t-183)/31)*1.24);
  art.grid('poses',index,3,2,x,y,383);
  const drawBlade=ease((t-55)/7)*(1-ease((t-62)/15));
  art.glow(1,x+44,y-153,384,126,drawBlade*.82,-.41,-1);
  for(const [at,angle] of [[81,-.35],[102,.29],[144,-.85]]){
   const slash=ease((t-at)/4)*(1-ease((t-at-4)/13));
   art.strike(0,tx-76,ty-112,434,280,slash*.91,angle);
  }
  art.strike(2,1167,396,398+hit*375,325+hit*317,hit*.87,-.08);
  shards(t);
  ctx.restore();flash('175,225,255',hit*.19);bands(t,'#081124');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/NoahLimitProfile.contactHold;
  art.strike(0,x,y,156+42*p,130,1-p*.54,-.29,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

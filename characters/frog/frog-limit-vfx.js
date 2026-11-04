'use strict';
const FrogLimitVFX=(()=>{
 const {assets,ease,unit,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('frog',['cutin','court','cliffs','poses','effects']);
 const shots=[
  [0,474,649,909,621,705,453,1.16,-.035,0],
  [32,490,646,911,624,694,454,1.25,.024,0],
  [60,508,646,925,622,689,432,1.19,-.041,1],
  [89,529,643,925,623,702,417,1.07,.036,1],
  [105,553,641,944,623,734,416,.95,-.058,2],
  [118,586,641,952,617,787,425,.89,.078,3],
  [138,610,637,964,605,804,418,.87,-.037,3],
  [161,652,590,987,601,833,431,.95,-.073,2],
  [177,745,554,992,602,886,443,1.07,.054,4],
  [190,929,616,1003,603,978,451,1.25,-.073,4],
  [204,1026,641,1168,488,999,444,1.01,.042,3],
  [226,1034,641,1362,353,1013,454,.94,-.026,5],
  [254,1034,644,1548,254,1028,457,.90,0,5]
 ];
 function cliffs(t){
  const p=ease((t-110)/46),y=648+p*17;
  art.grid('cliffs',0,2,1,884-p*310,y,641,{anchorX:.95});
  art.grid('cliffs',1,2,1,898+p*322,y,641,{anchorX:.05});
 }
 function fragments(t,x,y,weight){
  if(weight<=0)return;
  ctx.save();
  for(let n=0;n<58;n++){
   const age=t-110-n%7;if(age<0)continue;
   const a=n*2.39996,px=x+Math.cos(a)*age*(2+n%8*.68);
   const py=y-(n%10)*43+Math.sin(a)*age*2.1+age*age*.064;
   const size=5+n%9*2;
   ctx.save();ctx.translate(px,py);ctx.rotate(a+age*.061);
   ctx.globalAlpha=weight*(.54+n%7*.066);ctx.fillStyle=n%6===0?'#dfe0aa':n%3===0?'#797a62':'#44493f';
   ctx.beginPath();ctx.moveTo(-size,0);ctx.lineTo(-size*.15,-size*.6);ctx.lineTo(size,-size*.16);ctx.lineTo(size*.66,size*.71);ctx.lineTo(-size*.55,size*.43);ctx.closePath();ctx.fill();
   ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  if(t>=30)return;
  const s=1+time*.001,opacity=ease(t/5)*(1-ease((t-23)/7));
  ctx.save();ctx.beginPath();ctx.moveTo(0,102);ctx.lineTo(W,67);ctx.lineTo(W,690);ctx.lineTo(0,747);ctx.closePath();ctx.clip();
  art.portrait(s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=FrogLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const split=ease((t-103)/14)*(1-ease((t-129)/26));
  const hit=t>=189?unit(1-(t-189)/15):0;
  const final=ease((t-181)/9)*(1-ease((t-194)/28));
  frameClip();ctx.fillStyle='#152222';ctx.fillRect(0,0,W,H);
  art.image('court',-119-t*.18,-85,W+291,H+166);
  world(cx,cy,z,roll,face,t,Math.max(split*.7,hit));
  cliffs(t);
  art.strike(1,889,340,330+split*146,749+split*183,split*.92);
  art.glow(3,896,603,850,294,split*.78);
  fragments(t,894,519,ease((t-108)/9)*(1-ease((t-132)/33)));
  target(opponent,tx,ty,-.13+hit*.53-ease((t-194)/25)*.91);
  art.grid('poses',index,3,2,x,y,347);
  const glow=ease((t-55)/29)*(1-ease((t-100)/13));
  art.glow(1,x+17,y-285,106+glow*96,245+glow*122,glow*.59);
  art.strike(0,734,504,827,345,split*.84,.16);
  art.strike(2,1004,489,1210+final*392,408+final*93,final*.75,-.15);
  art.glow(3,1007,628,711+final*377,262+final*65,final*.57);
  ctx.restore();flash('243,255,198',split*.13+hit*.25);
  bands(t,'#0e1818');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/FrogLimitProfile.contactHold;
  art.strike(0,x,y,160+57*p,98,1-p*.60,-.11,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const ValkyrieLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('valkyrie',['cutin','court','poses','effects']);
 const shots=[
  [0,535,662,857,618,714,451,1.18,-.025,0],
  [43,625,642,883,578,748,424,1.12,.041,0],
  [64,674,618,961,543,804,410,1.16,-.052,1],
  [84,756,544,1052,495,868,395,1.08,.037,2],
  [107,520,409,1041,529,761,367,.99,-.036,3],
  [144,452,366,1087,565,773,369,.86,.032,3],
  [163,477,382,1087,565,781,372,.91,-.026,4],
  [179,484,409,1105,566,803,401,1.02,.038,4],
  [197,455,500,1212,429,831,403,.96,-.035,4],
  [228,463,641,1490,231,851,434,.97,.012,5],
  [256,471,651,1660,170,868,441,.93,0,5]
 ];
 function spear(t,x,y){
  if(t<110||t>=189)return;
  const throwProgress=unit((t-163)/16),conjure=ease((t-110)/16);
  const fromX=mix(x+80,557,ease((t-156)/7)),fromY=mix(y-208,188,ease((t-156)/7));
  const sx=mix(fromX,901,throwProgress),sy=mix(fromY,365,throwProgress);
  const angle=mix(-1.36,.479,ease((t-142)/21));
  const opacity=conjure*(1-ease((t-178)/11));
  art.effect(2,sx-130*Math.cos(angle),sy-130*Math.sin(angle),684,125,opacity*ease((t-162)/6)*.94,angle);
  art.effect(1,sx,sy,322+conjure*151,128,opacity,angle);
 }
 function feathers(t,x,y){
  const appear=ease((t-90)/27)*(1-ease((t-182)/45));
  if(!appear)return;
  ctx.save();
  for(let i=0;i<33;i++){
   const p=((t*.012+i*.61803)%1+1)%1,angle=i*2.39996;
   ctx.save();ctx.translate(x+Math.cos(angle)*(47+p*(165+i%5*34)),y+Math.sin(angle)*80+p*239);
   ctx.rotate(angle+p*4);ctx.globalAlpha=appear*Math.sin(p*Math.PI)*.76;
   ctx.fillStyle=i%3?'#ffecca':'#abcfff';ctx.beginPath();
   ctx.ellipse(0,0,3+i%3,9+i%6,0,0,TAU);ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  const s=1.03+time*.0011,opacity=ease(t/4)*(1-ease((t-24)/10));
  if(!opacity)return;
  ctx.save();ctx.beginPath();ctx.moveTo(0,92);ctx.lineTo(W,143);ctx.lineTo(W,724);ctx.lineTo(0,673);ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=ValkyrieLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const strike=ease((t-177)/5)*(1-ease((t-186)/26));
  frameClip();ctx.fillStyle='#191429';ctx.fillRect(0,0,W,H);
  art.image('court',-120-t*.17,-116+ease((t-83)/66)*54,W+302,H+174);
  world(cx,cy,z,roll,face,t,strike);
  target(opponent,tx,ty,-.09-Math.sin(t*.104)*.11-ease((t-181)/37)*1.33);
  feathers(t,x,y-146);
  art.grid('poses',index,3,2,x,y,379);
  for(const [at,angle] of [[46,-.61],[66,.42],[84,-.83]]){
   const slash=ease((t-at)/4)*(1-ease((t-at-5)/13));
   art.effect(0,tx-90,ty-99,370,264,slash*.90,angle);
  }
  spear(t,x,y);
  art.effect(3,1091,460,439+strike*742,305+strike*316,strike*.91);
  const shock=ease((t-184)/7)*(1-ease((t-199)/34));
  art.effect(3,1075,594,470+ease((t-185)/29)*694,156+shock*66,shock*.64);
  ctx.restore();flash('251,215,152',strike*.22);
  bands(t,'#100e1e');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/ValkyrieLimitProfile.contactHold;
  art.effect(0,x,y,157+44*p,138,1-p*.52,-.28,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

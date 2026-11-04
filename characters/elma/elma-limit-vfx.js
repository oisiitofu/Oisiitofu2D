'use strict';
const ElmaLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('elma',['cutin','court','poses','skell','effects']);
 const shots=[
  [0,527,649,859,620,713,448,1.20,-.026,0],
  [41,599,635,901,602,739,438,1.15,.038,0],
  [55,618,632,943,590,791,431,1.11,-.039,1],
  [77,592,620,978,583,775,428,1.05,.026,2],
  [95,535,489,1002,605,755,397,.91,-.022,4],
  [119,481,435,1015,606,753,390,.90,.031,4],
  [145,460,475,1043,589,770,394,.92,-.028,4],
  [174,451,497,1079,592,793,410,.99,.028,4],
  [189,481,493,1121,551,854,423,1.03,-.055,4],
  [217,486,586,1423,369,960,434,.96,.024,5],
  [266,496,648,1732,262,944,447,.94,0,5]
 ];
 const skellShots=[
  [81,457,247,665,0],[104,462,650,675,0],[129,472,643,675,1],
  [171,486,642,681,1],[179,453,635,681,2],[184,459,635,681,2],[193,467,634,681,1],
  [230,474,505,635,3],[266,445,190,569,3]
 ];
 function reticle(x,y,t){
  const alpha=ease((t-117)/12)*(1-ease((t-177)/10)),radius=mix(88,47,ease((t-122)/20));
  if(!alpha)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(-t*.021);ctx.globalAlpha=alpha*.82;
  ctx.strokeStyle='#ffd781';ctx.lineWidth=2;
  for(let i=0;i<4;i++){
   ctx.rotate(Math.PI/2);ctx.beginPath();ctx.arc(0,0,radius,.14,1.16);ctx.stroke();
   ctx.beginPath();ctx.moveTo(radius+5,0);ctx.lineTo(radius+19,0);ctx.stroke();
  }
  ctx.restore();
 }
 function shell(t,at,x,y,tx,ty,heavy){
  const p=unit((t-at)/(heavy?11:9));if(!p||p===1)return;
  const arch=heavy?104:19;
  const px=mix(x,tx,p),py=mix(y,ty,p)-Math.sin(p*Math.PI)*arch;
  const slope=ty-y-Math.cos(p*Math.PI)*Math.PI*arch,angle=Math.atan2(slope,tx-x);
  art.effect(2,px-32*Math.cos(angle),py-32*Math.sin(angle),heavy?346:208,heavy?102:65,1,angle);
 }
 function cutin(t,time){
  const s=1.035+time*.001,opacity=ease(t/4)*(1-ease((t-23)/10));
  if(!opacity)return;
  ctx.save();ctx.beginPath();ctx.moveTo(0,140);ctx.lineTo(W,81);ctx.lineTo(W,659);ctx.lineTo(0,718);
  ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=ElmaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const [sx,sy,height,skellIndex]=camera(skellShots,t);
  const blast=ease((t-184)/7)*(1-ease((t-197)/31));
  const touchdown=ease((t-100)/6)*(1-ease((t-108)/16));
  frameClip();ctx.fillStyle='#291c24';ctx.fillRect(0,0,W,H);
  art.image('court',-115-t*.19,-105+ease((t-69)/60)*54,W+305,H+160);
  world(cx,cy,z,roll,face,t,Math.max(blast,touchdown*.46));
  target(opponent,tx,ty,-.11+Math.sin(t*.17)*.14-ease((t-186)/32)*1.30);
  const boarding=ease((t-92)/17),departure=ease((t-231)/25),skellOpacity=ease((t-83)/13)*(1-departure);
  const thrust=ease((t-81)/10)*(1-ease((t-101)/15))+ease((t-207)/12)*(1-departure);
  art.effect(1,sx-50,sy+12,354,402,thrust*.86);
  art.grid('skell',skellIndex,2,2,sx,sy,height,{alpha:skellOpacity});
  art.grid('poses',index,3,2,x,y,380,{alpha:1-boarding+departure});
  art.effect(3,sx,651,486,163,touchdown*.48);
  reticle(tx,ty-105,t);
  for(const at of [40,54]){
   const shot=ease((t-at)/2)*(1-ease((t-at-2)/7));
   art.effect(0,x+142,y-166,265,132,shot*.91);
  }
  for(const at of [144,153,162,176]){
   const heavy=at===176;
   const shot=ease((t-at)/2)*(1-ease((t-at-2)/7));
   const muzzleX=sx+(heavy?208:235),muzzleY=sy-(heavy?439:215);
   art.effect(0,muzzleX+52,muzzleY,heavy?390:252,heavy?234:134,shot*.93,heavy?-.24:.14);
   shell(t,at,muzzleX,muzzleY,1094,482,heavy);
   const hit=ease((t-at-8)/3)*(1-ease((t-at-11)/11));
   if(!heavy)art.effect(3,1065,487,240,229,hit*.74);
  }
  art.effect(3,1093,507,432+blast*741,331+blast*300,blast*.91);
  ctx.restore();flash('255,191,133',blast*.20);bands(t,'#12151e');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/ElmaLimitProfile.contactHold;
  art.effect(0,x,y,147+44*p,128,1-p*.55,-.21,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const RyutaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('ryuta',['cutin','court','poses','effects']);
 const shots=[
  [0,479,649,997,633,715,427,1.09,-.012,0],
  [54,486,649,998,633,733,432,1.02,.015,0],
  [108,516,649,1010,632,749,399,.94,-.018,0],
  [135,541,649,1037,629,779,359,.82,-.028,1],
  [165,595,652,1061,612,811,415,.91,.024,3],
  [184,561,650,1204,464,864,422,.89,-.021,3],
  [239,555,649,1706,174,929,447,.88,0,0]
 ];
 const beat=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 const beats=[56,74,92,110];
 function draw({target:opponent,face,time}){
  const t=RyutaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,basePose]=camera(shots,t);
  const meteor=beat(t,79,108,169,183),burst=beat(t,127,154,166,180);
  const blast=beat(t,164,175,183,212),recoil=-.12-ease((t-174)/38)*1.51;
  const flinch=Math.max(...Array.from(RyutaLimitProfile.combo.keys(),frame=>beat(t,frame-1,frame,frame+2,frame+8)));
  frameClip();
  ctx.fillStyle='#38232c';ctx.fillRect(0,0,W,H);
  art.image('court',-76-t*.12,-55,W+179,H+110);
  world(cx,cy,z,roll,face,t,Math.max(blast,burst*.46));
  const approach=ease((t-87)/82);
  art.strike(2,mix(1257,1058,approach),mix(79,449,approach),346+approach*219,261+approach*197,meteor,-.15);
  let pose=basePose;
  for(let i=0;i<beats.length;i++){
   const frame=beats[i],mark=beat(t,frame-13,frame-7,frame,frame+7),hit=beat(t,frame-1,frame+2,frame+4,frame+10);
   if(hit>0)pose=1+i%2;
   const mx=609+i*117,my=407-(i%2)*64;
   art.strike(0,mx,my,168+mark*38,174+mark*31,mark);
   art.strike(1,mx+59,my,202+hit*79,169+hit*67,hit*.9);
  }
  if(t<183)target(opponent,tx+29*flinch,ty-16*flinch,recoil-.16*flinch);
  art.strike(1,tx+9,ty-99,166,136,flinch*.85,.32);
  art.strike(1,mix(x+104,1042,ease((t-132)/34)),mix(y-134,459,ease((t-132)/34)),391+burst*455,252+burst*164,burst,-.18);
  art.strike(3,1055,470,412+blast*615,343+blast*235,blast);
  art.grid('poses',pose,2,2,x,y,291,{face:pose===3?1:-1});
  if(t>=183)target(opponent,tx,ty,recoil);
  ctx.restore();
  flash('255,194,131',blast*.27);bands(t,'#2a1a28');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(1,x,y,139+time*5,130,1-time/RyutaLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const RingfitLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('ringfit',['cutin','court','poses','effects','dragon']);
 const shots=[
  [0,431,653,989,632,728,447,1.10,.013,0],
  [49,435,653,1004,625,745,435,1.02,-.022,0],
  [79,441,655,1041,618,750,425,1.08,.026,1],
  [116,469,652,1021,620,753,407,1.03,-.016,1],
  [137,501,650,1027,616,773,376,.86,-.025,2],
  [157,495,651,1033,615,766,408,.85,.019,3],
  [183,454,652,1126,551,787,425,.93,-.027,3],
  [215,444,654,1468,300,903,441,.88,.016,0],
  [242,445,654,1744,170,922,448,.87,0,0]
 ];
 const beat=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 function draw({target:opponent,face,time}){
  const t=RingfitLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const threat=beat(t,38,64,137,184),guard=beat(t,48,66,71,92);
  const charge=beat(t,81,141,150,163),beam=beat(t,151,167,174,188);
  const blast=beat(t,172,182,188,216),recoil=-.15-ease((t-181)/39)*1.48;
  frameClip();
  ctx.fillStyle='#2c1b24';ctx.fillRect(0,0,W,H);
  art.image('court',-65-t*.14,-53,W+167,H+108);
  world(cx,cy,z,roll,face,t,Math.max(blast,guard*.54));
  art.grid('dragon',0,1,1,mix(1240,1135,ease((t-38)/29)),528,590,{anchorY:.87,alpha:threat*.88});
  art.strike(1,mix(1080,x+165,ease((t-48)/20)),501,587,258,guard*.91,-.15);
  art.grid('poses',pose,2,2,x,y,294);
  art.strike(0,x+88,y-143,227+guard*114,302,guard);
  for(let i=0;i<3;i++){
   const inhale=beat(t,82+i*17,90+i*17,96+i*17,108+i*17);
   art.glow(0,x+83+i*29,y-151,190+charge*104,215,inhale*.74);
  }
  if(t<188)target(opponent,tx,ty,recoil);
  const length=mix(184,680,ease((t-151)/16));
  art.strike(2,x+58+length*.46,y-189,length,230+beam*130,beam,-.028);
  art.strike(3,1059,482,387+blast*628,379+blast*218,blast);
  if(t>=188)target(opponent,tx,ty,recoil);
  ctx.restore();
  flash('143,227,255',Math.max(blast*.25,guard*.10));bands(t,'#1b1726');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,140+time*5,141,1-time/RingfitLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

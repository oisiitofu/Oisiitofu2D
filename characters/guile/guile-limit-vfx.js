'use strict';
const GuileLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('guile',['cutin','court','poses','effects']);
 const shots=[
  [0,454,647,957,607,716,396,1.08,.014,0],
  [44,729,647,987,606,866,391,1.08,-.017,0],
  [60,588,647,1058,604,821,395,.99,.014,1],
  [113,633,647,1112,604,875,395,1.00,-.016,1],
  [139,691,647,1153,582,927,391,.91,.019,1],
  [159,733,647,1186,524,973,361,.91,-.016,1],
  [184,999,631,1206,425,1100,330,.95,.022,2],
  [202,1092,591,1220,390,1156,301,1.04,-.018,2],
  [217,1136,571,1234,374,1188,292,1.12,.024,2],
  [234,1020,647,1601,214,1197,382,.84,-.014,3],
  [252,1011,647,1844,119,1221,390,.84,0,3]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=GuileLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const solid=pulse(t,52,59,113,124),hurricane=pulse(t,126,138,156,174),finish=pulse(t,210,216,220,239);
  const flinch=Math.max(...Array.from(GuileLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  frameClip();ctx.fillStyle='#132735';ctx.fillRect(0,0,W,H);art.image('court',-72-t*.12,-66,W+187,H+132);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.56,finish));
  art.glow(3,x+107,y-176,251,172,solid*.43);
  const firingPose=solid>.4?(flinch>.45?1:0):pose;
  const drawGuile=()=>art.grid('poses',firingPose,2,2,x,y,348);
  if(t<210)drawGuile();
  art.strike(3,tx-39,ty-108,259,191,pulse(t,40,44,45,52));
  for(const [hit,offset] of [[68,-14],[76,13],[84,-5],[92,20],[100,-20],[111,0]]){
   const flight=ease((t-hit+12)/12);
   const fromX=x+115,fromY=y-217,toX=tx-29,toY=ty-109+offset;
   art.strike(0,mix(fromX,toX,flight),mix(fromY,toY,flight),362,142,pulse(t,hit-12,hit-9,hit,hit+6),Math.atan2(toY-fromY,toX-fromX));
  }
  art.strike(1,mix(x+219,tx-18,ease((t-129)/23)),ty-144,615,300,hurricane,-.10);
  art.strike(2,tx-40,ty-136,382,250,pulse(t,176,184,186,195),-.42);
  art.strike(2,tx-47,ty-132,413+finish*180,267+finish*112,finish,-.42);
  art.strike(3,tx-21,ty-116,270+finish*211,205+finish*146,finish,-.18);
  target(opponent,tx+flinch*23,ty-flinch*21,-.11-flinch*.28-ease((t-217)/28)*1.51);
  if(t>=210)drawGuile();
  art.strike(3,tx-21,ty-116,148,106,finish*.65,-.18);
  ctx.restore();flash('206,255,204',Math.max(flinch*.13,finish*.26));bands(t,'#13252f');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(3,x,y,159+time*6,118,1-time/GuileLimitProfile.contactHold*.6,-.10,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

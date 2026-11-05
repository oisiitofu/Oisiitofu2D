'use strict';
const ViewtifulJoeLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('viewtifuljoe',['cutin','court','poses','effects']);
 const shots=[
  [0,459,644,971,613,723,411,1.09,.014,0],
  [46,533,637,956,607,745,391,1.03,-.015,1],
  [61,710,639,980,604,847,399,1.11,.015,2],
  [81,675,640,1018,614,847,401,.94,-.018,1],
  [126,800,639,1057,605,934,379,.96,.02,2],
  [144,845,578,1100,533,973,341,.99,-.018,3],
  [170,866,565,1119,505,994,327,.97,.021,3],
  [191,752,639,1146,583,949,384,.81,-.016,0],
  [217,946,579,1194,552,1080,371,1.17,.022,3],
  [233,884,640,1450,404,1150,379,.89,-.018,3],
  [250,869,640,1748,250,1165,425,.88,0,2]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function film(t,slow){
  if(slow<=0)return;
  ctx.save();ctx.globalAlpha*=slow;
  ctx.fillStyle='#10142b';ctx.fillRect(0,0,W,55);ctx.fillRect(0,H-55,W,55);
  ctx.fillStyle='#8d98b2';
  for(let x=-t*1.45%86;x<W;x+=86){
   ctx.fillRect(x,16,44,20);ctx.fillRect(x,H-36,44,20);
  }
  ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=ViewtifulJoeLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const slow=pulse(t,23,34,61,79),mach=pulse(t,75,84,123,140),finish=pulse(t,208,216,220,239);
  const flinch=Math.max(...Array.from(ViewtifulJoeLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  frameClip();ctx.fillStyle='#1a173a';ctx.fillRect(0,0,W,H);art.image('court',-72-t*.14,-57,W+185,H+122);
  ctx.fillStyle='rgba(33,76,149,'+slow*.36+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.61,finish));
  art.glow(0,x-71,y-156,526+mach*215,194+mach*118,slow*.48+mach*.52);
  for(let trail=3;trail>=1;trail--)art.grid('poses',1,2,2,x-trail*78,y+trail*4,328,{alpha:mach*(.40-trail*.078)});
  const machPose=mach>.3?(flinch>.55?2:1):pose;
  const drawJoe=()=>art.grid('poses',machPose,2,2,x,y,328);
  if(t<216)drawJoe();
  const drawTarget=()=>target(opponent,tx+flinch*26,ty-flinch*25,-.09-flinch*.32-ease((t-217)/28)*1.48);
  if(t<216)drawTarget();
  for(const [hit,offset] of [[57,0],[85,-48],[91,42],[97,-19],[103,63],[111,-29],[121,10],[139,-57],[164,39],[185,0]]){
   const hitPulse=pulse(t,hit-4,hit,hit+1,hit+7),rapid=hit>=85&&hit<=121;
   art.strike(rapid?2:1,tx-53,ty-110+offset,rapid?343:252,rapid?153:193,hitPulse,offset*.004);
  }
  art.strike(3,tx-7,ty-117,423+finish*386,311+finish*208,finish,-.16);
  if(t>=216){drawJoe();drawTarget();}
  art.strike(1,tx-59,ty-141,204,151,pulse(t,215,216,218,223));
  ctx.restore();flash('255,180,225',Math.max(flinch*.13,finish*.25));bands(t,'#25162f');film(t,slow);
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(1,x,y,154+time*6,112,1-time/ViewtifulJoeLimitProfile.contactHold*.6,-.09,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

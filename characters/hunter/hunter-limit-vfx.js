'use strict';
const HunterLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('hunter',['cutin','court','poses','effects']);
 const bodyAnchors=[.63,.39,.66,.37];
 const shots=[
  [0,441,650,964,627,708,424,1.05,.011,0],
  [43,718,650,945,619,821,422,1.07,-.013,0],
  [73,706,648,975,612,844,402,1.03,.011,1],
  [101,729,649,993,607,863,381,.97,-.014,3],
  [127,745,649,1010,604,873,397,.94,.016,0],
  [159,767,648,1053,601,910,374,.85,-.019,3],
  [196,659,649,1123,612,890,373,.79,.014,2],
  [218,808,648,1176,581,981,366,.81,-.018,3],
  [235,800,649,1444,440,1035,387,.87,.015,3],
  [254,788,649,1773,231,1088,426,.91,0,3]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=HunterLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const flinch=Math.max(...Array.from(HunterLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+3,hit+10)));
  const charge=Math.max(pulse(t,82,99,101,105)*.48,pulse(t,136,154,157,161)*.63,pulse(t,170,204,214,220));
  const finish=pulse(t,211,218,221,242);
  frameClip();ctx.fillStyle='#22171a';ctx.fillRect(0,0,W,H);art.image('court',-82-t*.11,-54,W+194,H+113);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.63,finish));
  art.glow(1,x+51,y-230,271+charge*241,231+charge*192,charge*.82,-.35);
  const charging=t>=82&&t<102||t>=138&&t<157||t>=174&&t<198||t>=205&&t<216;
  const descending=t>=102&&t<112||t>=157&&t<167||t>=216;
  let weaponPose=pose;
  if(charging)weaponPose=2;
  else if(descending)weaponPose=3;
  else if(t>=198&&t<205)weaponPose=1;
  art.grid('poses',weaponPose,2,2,x,y,348,{anchorX:bodyAnchors[weaponPose]});
  const drawTarget=()=>target(opponent,tx+flinch*24,ty-flinch*26,-.08-flinch*.31-ease((t-219)/29)*1.41);
  if(t<218)drawTarget();
  for(const [hit,kind,angle] of [[43,2,0],[71,0,.12],[103,1,.24],[126,2,-.05],[158,1,.31],[200,0,-.19]]){
   const travel=ease((t-hit+7)/7),strength=pulse(t,hit-6,hit,hit+3,hit+11);
   art.strike(kind,mix(x+118,tx-51,travel),mix(y-145,ty-106,travel),kind===2?241:433,kind===2?177:254,strength,angle);
  }
  art.strike(1,mix(x+123,tx-36,ease((t-211)/8)),ty-190,486+finish*386,386+finish*233,finish,.22);
  art.strike(3,tx-27,ty-18,432+finish*489,235+finish*295,pulse(t,217,220,224,247));
  if(t>=218)drawTarget();
  ctx.restore();flash('255,181,117',Math.max(flinch*.15,finish*.26));bands(t,'#281718');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(2,x,y,159+time*6,119,1-time/HunterLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

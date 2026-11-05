'use strict';
const AgumonLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('agumon',['cutin','court','poses','effects','omega']);
 const omegaPortrait=assets('omegamon',['cutin']);
 const forms=['agumon','greymon','metalgreymon','wargreymon','omegamon'];
 const heights=[251,358,413,454,472];
 const shots=[
  [0,472,650,1001,626,734,421,1.08,-.013,0],
  [57,516,650,997,624,755,423,1.03,.015,1],
  [86,514,649,1037,623,779,396,.87,-.014,2],
  [112,522,649,1055,613,813,372,.82,.016,2],
  [127,491,650,1071,609,804,361,.78,-.013,3],
  [143,526,650,1086,611,839,373,.84,.018,4],
  [179,574,650,1109,608,878,400,.88,-.018,4],
  [206,711,650,1169,576,952,386,.85,.013,4],
  [224,705,650,1379,435,993,405,.86,-.014,4],
  [254,658,651,1743,166,966,432,.89,0,4]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({attacker,target:opponent,face,time}){
  const t=AgumonLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,stage]=camera(shots,t);
  const startingForm=forms.indexOf(attacker.characterId);
  const form=Math.max(stage,startingForm),fusion=pulse(t,121,137,142,151),finish=pulse(t,202,218,225,243);
  const flinch=Math.max(...Array.from(AgumonLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#18304b';ctx.fillRect(0,0,W,H);art.image('court',-75-t*.11,-55,W+178,H+113);
  world(cx,cy,z,roll,face,t,Math.max(finish,flinch*.5));
  if(startingForm<4)art.glow(2,x+68,y-224,428+fusion*272,459,fusion*.64,-.18);
  if(form<4)art.grid('poses',form,2,2,x,y,heights[form]);
  else art.grid('omega',t<194?0:1,2,1,x,y,heights[form]);
  target(opponent,tx+flinch*23,ty-flinch*21,-.1-flinch*.22-ease((t-219)/31)*1.46);
  for(const [hit,index] of [[52,0],[69,0],[94,1],[116,1],[158,2],[180,2]]){
   const flight=ease((t-hit+10)/10),strike=pulse(t,hit-10,hit-6,hit,hit+7);
   if(form===4){
    const mx=x+150,my=y-331,dx=tx+79-mx,dy=ty-104-my;
    art.strike(2,mx+dx/2,my+dy/2,Math.hypot(dx,dy),158,strike,Math.atan2(dy,dx));
   }else{
    const attack=form===3?0:form===2?1:index;
    art.strike(attack,mix(x+129,tx-44,flight),mix(y-(form<2?155:219),ty-112,flight),attack===0?271:319,179,strike);
   }
  }
  art.strike(3,mix(x+156,1247,ease((t-201)/20)),mix(y-148,442,ease((t-201)/20)),483+finish*525,314+finish*245,finish,-.13);
  ctx.restore();flash('181,231,255',Math.max(finish*.26,startingForm<4?fusion*.22:0));bands(t,'#192b45');
  const portrait=startingForm===4?omegaPortrait:art;
  portrait.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));
  if(startingForm<4)omegaPortrait.portrait(1.035,pulse(t,127,132,138,147)*.93);
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,144+time*5,113,1-time/AgumonLimitProfile.contactHold*.6,0,face);
 }
 return {load:()=>Promise.all([art.load(),omegaPortrait.load()]),get prepared(){return art.prepared&&omegaPortrait.prepared;},draw,drawContact};
})();

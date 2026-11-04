'use strict';
const AlphenLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('alphen',['cutin','court','poses','effects']);
 const shots=[
  [0,475,650,997,627,733,421,1.09,-.013,0],
  [47,607,650,990,626,804,426,1.08,.016,1],
  [80,651,650,1027,619,836,416,1.04,-.017,1],
  [104,698,650,1031,590,863,398,.97,.018,2],
  [129,655,649,1058,597,860,367,.83,-.014,0],
  [159,703,650,1108,607,901,389,.89,.018,2],
  [190,763,650,1138,606,952,402,.91,-.018,3],
  [211,818,649,1338,470,1011,399,.85,.013,3],
  [255,744,651,1742,161,980,434,.88,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=AlphenLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const charge=pulse(t,123,140,168,186),finish=pulse(t,191,207,216,235);
  const flinch=Math.max(...Array.from(AlphenLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#242332';ctx.fillRect(0,0,W,H);art.image('court',-74-t*.12,-56,W+182,H+117);
  world(cx,cy,z,roll,face,t,Math.max(finish,flinch*.55));
  art.glow(2,x+93,y-171,339+charge*197,444,charge*.77,-.15);
  ctx.save();ctx.shadowColor=charge>.2?'#ef7b48':'#7aa3db';ctx.shadowBlur=14;
  art.grid('poses',pose,2,2,x,y,398);
  ctx.restore();
  art.strike(1,x+130,y-102,274,169,pulse(t,181,195,201,209)*.88,.58);
  target(opponent,tx+flinch*22,ty-flinch*24,-.11-flinch*.21-ease((t-209)/37)*1.47);
  for(const [index,hit,angle] of [[0,53,-.19],[0,69,.23],[0,86,-.32],[1,111,-.15],[1,168,.13]]){
   const slash=pulse(t,hit-5,hit,hit+2,hit+9);
   art.strike(index,tx-86,ty-119,335+slash*142,196+slash*95,slash,angle);
  }
  art.strike(2,tx+5,ty-165,358,410,pulse(t,136,146,150,159));
  const flight=ease((t-191)/19);
  art.strike(3,mix(x+165,1251,flight),mix(y-127,443,flight),463+finish*577,307+finish*241,finish,-.12);
  ctx.restore();flash('255,179,111',Math.max(finish*.27,charge*.09));bands(t,'#2c2128');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,152+time*5,112,1-time/AlphenLimitProfile.contactHold*.6,-.13*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

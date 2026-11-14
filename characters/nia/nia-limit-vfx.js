'use strict';

const NiaLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('nia',['cutin','effects']);
 const shots=[
  [0,431,672,1090,671,750,431,.95,0,0],[33,692,672,1090,670,891,431,.97,0,2],
  [47,884,667,1098,655,991,431,.99,.016,6],[65,972,538,1152,615,1062,382,.92,-.02,13],
  [84,1190,419,1150,561,1170,332,.87,.019,-16],[103,1419,554,1113,593,1266,375,.92,-.021,-14],
  [122,1182,651,1060,632,1121,426,.98,.018,-9],[142,834,541,1107,592,971,378,.92,-.026,17],
  [169,749,672,1171,634,960,428,.88,0,18],[200,809,575,1174,624,991,394,.93,.024,12],
  [236,820,672,1684,348,1184,411,.77,0,0]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function ring(x,y,angle,alpha){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(1,.54);ctx.globalAlpha=alpha;
  ctx.strokeStyle='#8be5ff';ctx.lineWidth=15;
  ctx.beginPath();ctx.arc(0,0,49,.05,6.23);ctx.stroke();
  ctx.strokeStyle='#fff2ba';ctx.lineWidth=5;
  ctx.beginPath();ctx.arc(0,0,43,.34,5.76);ctx.stroke();
  ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=NiaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...NiaLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,200,5,25);
  frameClip();
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#102d55');sky.addColorStop(.62,'#317c9b');sky.addColorStop(1,'#9fc0bb');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.54,finish));
  ctx.fillStyle='#276282';ctx.fillRect(-1800,674,6300,620);
  ctx.strokeStyle='#75bbcb';ctx.lineWidth=4;
  for(let i=0;i<19;i++){
   const px=i*312-1610,py=678+(i*21)%80;
   ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px+150,py-19,px+276,py);ctx.stroke();
  }
  const sprite={...attacker,x,y,face:pose<0?-1:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose),3.12);
  target(opponent,tx,ty-impact*13,-.12-impact*.37-ease((t-202)/24)*1.38,2.56);
  for(const [i,h] of hits.entries()){
   const flight=ease((t-h+13)/13),sx=x+Math.sign(pose||1)*75,sy=y-121;
   const bend=Math.sin(Math.PI*flight)*(i%2===0?-1:1)*144;
   ring(mix(sx,tx,flight),mix(sy,ty-118,flight)+bend,t*.21+i,pulse(t,h,13,7));
   art.strike(i%3,tx-11,ty-115,398+i*14,314,pulse(t,h,4,9),[-.26,.54,-.74,.37,-.49,.18][i]);
  }
  const swell=ease((t-195)/14);
  for(let i=0;i<3;i++){
   const power=pulse(t,198+i*2,5,24),px=tx+(i-1)*153;
   const rise=192+swell*404-i*60;
   art.strike(3,px,ty-124,154+swell*82,267+swell*105,power*.57,.16*(1-i));
   ctx.save();ctx.globalAlpha=power*.9;ctx.lineWidth=12;ctx.strokeStyle='#9ceaff';
   ctx.beginPath();ctx.moveTo(px-59,ty-51);
   ctx.bezierCurveTo(px+185,ty-rise*.37,px-167,ty-rise*.67,px+67,ty-rise);
   ctx.stroke();
   ctx.lineWidth=4;ctx.strokeStyle='#edfeff';ctx.stroke();
   for(let j=0;j<8;j++){
    const dx=Math.sin(j*2.39+t*.14)*(44+j*11),dy=rise*(.2+j*.11);
    ctx.beginPath();ctx.ellipse(px+dx,ty-dy,4+j%3,10+j%4,dx*.02,0,Math.PI*2);ctx.stroke();
   }
   ctx.restore();
  }
  ctx.save();ctx.globalAlpha=finish*.85;ctx.strokeStyle='#c6f9ff';ctx.lineWidth=7;
  const radius=132+swell*455;
  ctx.beginPath();ctx.ellipse(tx,ty-37,radius,radius*.25,0,0,Math.PI*2);ctx.stroke();
  ctx.restore();ctx.restore();flash('201,248,255',Math.max(impact*.1,finish*.21));bands(t,'#112e4a');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,169+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

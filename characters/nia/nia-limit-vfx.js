'use strict';

const NiaLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('nia',['cutin','effects','lake','current'],{revision:2});
 const shots=[
  [0,431,672,1090,671,750,431,.95,0,0],[33,692,672,1090,670,891,431,.97,0,2],
  [47,884,667,1098,655,991,431,.99,.016,6],[65,972,538,1152,615,1062,382,.92,-.02,13],
  [84,1190,419,1150,561,1170,332,.87,.019,-16],[103,1419,554,1113,593,1266,375,.92,-.021,-14],
  [122,1182,651,1060,632,1121,426,.98,.018,-9],[142,834,541,1107,592,971,378,.92,-.026,17],
  [169,749,672,1171,634,960,428,.88,0,18],[200,809,575,1174,624,991,394,.93,.024,12],
  [236,820,672,1684,348,1184,411,.77,0,0]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function ring(x,y,angle,alpha,size=151){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);
  art.grid('current',0,2,1,0,0,size,{anchorY:.5,alpha});
  ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=NiaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...NiaLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,200,5,25);
  frameClip();
  const width=W+325;
  art.image('lake',-(width-W)*.48-(cx-1010)*.13,-94-(cy-415)*.11,width,width*9/16);
  ctx.fillStyle='rgba(5,30,63,'+(finish*.21)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.54,finish));
  const swell=ease((t-195)/14);
  const surgeX=1174,surfaceY=669;
  art.grid('current',1,2,1,surgeX+101*swell,surfaceY+93,560+swell*450,{anchorY:.73,alpha:finish*.84});
  for(let i=0;i<3;i++){
   const h=198+i*3,power=pulse(t,h,5,21),px=surgeX+(i-1)*215;
   const height=[342,562,420][i]+swell*112;
   art.strike(3,px,surfaceY-height*.43,224+i*63,height,power,[-.34,-.04,.3][i]);
   art.glow(3,px,surfaceY-height*.48,290+i*64,height*1.09,power*.29,[-.34,-.04,.3][i]);
  }
  const sprite={...attacker,x,y,face:pose<0?-1:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose),3.12);
  target(opponent,tx,ty-impact*13,-.12-impact*.37-ease((t-202)/24)*1.38,2.56);
  for(const [i,h] of hits.entries()){
   const flight=ease((t-h+13)/13),sx=x+Math.sign(pose||1)*75,sy=y-121;
   const bend=Math.sin(Math.PI*flight)*(i%2===0?-1:1)*144;
   const rx=mix(sx,tx,flight),ry=mix(sy,ty-118,flight)+bend,sign=Math.sign(tx-sx);
   art.glow(2,rx-sign*94,ry,266,178,pulse(t,h,13,7)*.74,(i%2===0?-.24:.24)*sign,sign);
   ring(rx,ry,t*.21+i,pulse(t,h,13,7));
   art.strike([0,1,0,2,1,2][i],tx-11,ty-115,398+i*14,314,pulse(t,h,4,9),
    [-.26,.54,-.74,.37,-.49,.18][i],sign);
  }
  const arc=ease((t-177)/25);
  for(const side of [-1,1]){
   ring(mix(x,surgeX,arc)+side*Math.sin(arc*Math.PI)*201,
    mix(y-106,surfaceY-43,arc)-Math.sin(arc*Math.PI)*(side===1?251:103),side*t*.21,
    pulse(t,199,23,6),177);
  }
  art.strike(1,surgeX+47,surfaceY-111,416+swell*148,241,pulse(t,200,2,10),-.33);
  ctx.restore();flash('201,248,255',Math.max(impact*.1,finish*.21));bands(t,'#112e4a');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,169+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

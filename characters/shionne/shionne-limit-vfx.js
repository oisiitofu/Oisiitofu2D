'use strict';

const ShionneLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('shionne',['cutin','effects','terrace','solar','motion']);
 const shots=[
  [0,463,669,1097,670,780,434,.94,0,0],[29,682,669,1097,670,889,435,.98,0,20],
  [44,898,669,1103,655,1001,432,1,.019,19],[61,758,556,1173,617,966,394,.95,-.022,31],
  [79,583,340,1250,551,916,325,.84,.02,28],[98,796,253,1288,519,1042,293,.82,-.019,30],
  [118,954,380,1241,581,1098,358,.88,.023,31],[138,729,566,1274,622,1002,418,.92,-.02,34],
  [166,692,668,1289,660,991,435,.88,0,34],[184,744,667,1288,653,1016,427,.84,0,36],
  [203,871,667,1109,355,1029,374,.89,-.018,29],[214,866,665,1252,224,1059,331,.79,.021,29],
  [232,755,669,1621,180,1171,355,.75,0,31],[250,756,669,1920,268,1338,395,.73,0,0]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));

 function draw({attacker,target:opponent,face,time}){
  const t=ShionneLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...ShionneLimitProfile.combo.keys()];
  const impact=Math.max(...hits.map(h=>pulse(t,h,4,9))),finish=pulse(t,214,5,25);
  frameClip();
  const width=W+361,height=width*9/16;
  const floor=H*.51+(669-cy)*z;
  art.image('terrace',-(width-W)*.48-(cx-1040)*.13,Math.min(-7,floor-height*.84),width,height);
  ctx.fillStyle='rgba(30,9,42,'+(finish*.26)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.57,finish));
  const sunX=1260,sunY=104,gather=ease((t-170)/25),expand=ease((t-214)/18);
  art.grid('solar',0,2,1,sunX,sunY,179+gather*245,{anchorY:.5,alpha:gather*(1-ease((t-212)/8))});
  art.grid('solar',1,2,1,sunX+expand*98,sunY+48,416+expand*642,{anchorY:.44,alpha:finish});
  const beam=pulse(t,203,2,11),reach=ease((t-200)/12);
  const muzzleX=x+158,muzzleY=y-364,dx=sunX-muzzleX,dy=sunY-muzzleY;
  const angle=Math.atan2(dy,dx),length=Math.hypot(dx,dy);
  art.glow(3,muzzleX+dx*.57,muzzleY+dy*.57,length*1.37,295,beam*.45,angle);
  art.strike(3,muzzleX+dx*.51,muzzleY+dy*.51,length*(1.16+reach*.24),210+reach*123,beam,angle);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  if(!attacker.color&&((t>=73&&t<91)||(t>=187&&t<218))){
   const motion=t<100?0:t<201?1:2;
   art.grid('motion',motion,3,1,x,y,[337,332,388][motion],{anchorY:.95});
  }else drawSprite(sprite,1,pose,3.16);
  target(opponent,tx,ty-impact*13,-.11-impact*.35-ease((t-215)/23)*1.42,2.54);
  for(const [i,h] of hits.entries()){
   const active=pulse(t,h,4,9);
   if(i===1||i===2||i===4){
    const flight=ease((t-h+10)/10),sx=x+113,sy=y-116,angle=Math.atan2(ty-119-sy,tx-sx);
    art.strike(0,sx,sy,213,153,pulse(t,h-7,3,4),angle);
    art.strike(1,mix(sx,tx,flight),mix(sy,ty-119,flight),325,148,pulse(t,h,9,4),angle);
   }
   art.strike(2,tx-8,ty-118,373+i*16,294,active,[-.26,.18,.49,.12,-.23,.37][i]);
  }
  art.strike(0,muzzleX,muzzleY,295,167,pulse(t,203,2,7),angle);
  art.strike(2,sunX,sunY+45,431+expand*249,393,pulse(t,214,2,10),.13);
  ctx.restore();
  flash('255,207,220',Math.max(impact*.1,beam*.12,finish*.21));
  bands(t,'#211a32');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time}){art.strike(2,x,y,168+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

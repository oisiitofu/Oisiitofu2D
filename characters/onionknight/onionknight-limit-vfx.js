'use strict';

const OnionKnightLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('onionknight',['cutin','cutin-ninja','cutin-sage','effects','court','sigils','finish'],{revision:3});
 const shots=[
  [0,385,673,1008,671,696,430,.94,0,1],[29,622,673,1008,671,819,431,.95,-.012,23],
  [44,832,669,1023,662,930,438,1,.02,17],[60,926,656,1089,621,1012,418,.94,-.02,18],
  [77,1095,607,1201,586,1148,390,.94,.018,23],[96,1351,499,1228,541,1290,346,.87,-.027,-31],
  [106,1403,573,1198,576,1301,400,.87,0,-41],[115,1381,674,1169,638,1275,429,.92,.015,-17],
  [135,1302,674,1110,604,1206,415,.89,-.018,-21],[155,1292,674,1064,591,1172,402,.91,.018,-18],
  [176,1261,674,1002,659,1129,413,.86,-.014,-41],[190,1244,674,985,643,1101,410,.95,-.017,-41],
  [196,1257,674,976,628,1109,404,.94,.021,-43],[207,1309,674,811,518,1085,398,.84,.008,-43],
  [218,1325,674,659,405,1012,394,.77,0,-41],
  [232,1257,674,482,314,893,397,.75,0,-1]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function sigil(slot,x,y,size,angle,alpha){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);
  art.grid('sigils',slot,2,2,0,0,size,{anchorY:.5,alpha});
  ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=OnionKnightLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...OnionKnightLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,196,2,19),swap=Math.max(pulse(t,27,7,8),pulse(t,70,6,8),pulse(t,106,7,8),pulse(t,226,5,7));
  frameClip();
  const width=W+366;
  art.image('court',-(width-W)*.5-(cx-1030)*.12,-101-(cy-408)*.13,width,width*9/16);
  ctx.fillStyle='rgba(24,9,42,'+pulse(t,195,22,29)*.46+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.57,finish));
  const originalJob=onionknightJob(attacker);
  const job=t<27||t>=226?originalJob:t<70?0:t<106?1:2;
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0,onionJob:job};
  sigil(job,x,y-101,295,t*.055,swap);
  const charge=pulse(t,190,24,10),spread=ease((t-196)/18);
  const focusX=976,focusY=510,originX=x-94,originY=y-172;
  const dx=focusX-originX,dy=focusY-originY,angle=Math.atan2(dy,dx)-Math.PI;
  sigil(3,x-102,y-174,171+charge*70,-t*.039,charge*.61);
  art.glow(2,x-94,y-172,254,259,charge*.76);
  art.strike(2,focusX-spread*136,635,669+spread*431,229+spread*91,pulse(t,201,4,22),0,1,'finish');
  drawSprite(sprite,1,Math.abs(pose)-1,3.2);
  target(opponent,tx,ty-hit*14,-.13-hit*.34+ease((t-196)/26)*1.35,2.55);
  for(const [i,h] of hits.entries()){
   const slot=[0,0,1,1,2,2,3][i];
   art.strike(slot,tx+14,ty-116,401+i*13,319,pulse(t,h,4,9),[-.31,.43,-.51,.87,.18,0,.08][i],i<3?1:-1);
  }
  art.strike(0,originX+dx*.50,originY+dy*.50,Math.hypot(dx,dy)+115,192+spread*68,finish,angle,1,'finish');
  art.strike(3,originX,originY,160,164,pulse(t,196,13,6),-.12,1,'finish');
  art.strike(1,focusX-spread*71,focusY,330+spread*251,341+spread*167,pulse(t,198,2,21),.14,1,'finish');
  ctx.restore();flash('255,232,233',Math.max(hit*.1,swap*.15,finish*.2));bands(t,'#25182e');
  portraitPanel(t,-26,(zoom,alpha)=>art.portrait(zoom,alpha,['cutin','cutin-ninja','cutin-sage'][originalJob]));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,169+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

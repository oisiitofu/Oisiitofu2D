'use strict';
const MagusLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('magus',['cutin','effects','court'],{revision:2});
 const shots=[
  [0,420,672,1090,671,760,430,.94,0,0],[35,709,672,1090,671,900,436,.96,0,2],
  [47,899,671,1114,657,1006,432,1,.02,18],[65,1011,590,1159,610,1085,397,.94,-.019,8],
  [84,1164,374,1173,554,1168,313,.89,.026,23],[104,951,402,1229,555,1090,350,.87,-.023,33],
  [124,961,433,1270,552,1115,355,.92,.02,44],[145,815,457,1299,607,1057,383,.88,-.019,43],
  [168,756,423,1334,654,1043,390,.84,0,14],[190,764,359,1337,628,1050,344,.83,-.013,31],
  [209,788,361,1337,621,1063,345,.94,.024,33],[245,793,672,1835,322,1243,398,.76,0,0]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function draw({attacker,target:opponent,face,time}){
  const t=MagusLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...MagusLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,209,6,25),charge=pulse(t,190,25,21);
  frameClip();
  const width=W+366;
  art.image('court',-(width-W)*.5-(cx-1030)*.12,-102-(cy-405)*.14,width,width*9/16);
  world(cx,cy,z,roll,face,t,Math.max(hit*.53,finish));
  const gather=ease((t-166)/32),spread=ease((t-209)/19);
  const orbX=tx,orbY=ty-148;
  for(const side of [-1,1]){
   const angle=t*.061+side*Math.PI*.5;
   const radius=270*(1-gather)+50;
   art.glow(2,orbX+Math.cos(angle)*radius,orbY+Math.sin(angle)*radius*.68,
    310+gather*109,211,charge*.61,angle+Math.PI/2,side);
  }
  art.strike(1,orbX,orbY,269+gather*222,276+gather*151,charge*.49,-t*.027);
  art.glow(1,orbX,orbY,318+gather*236,335+gather*123,charge*.64,-t*.027);
  art.strike(3,tx+32+spread*150,ty-152-spread*34,584+spread*515,541+spread*98,finish,.19);
  art.glow(2,tx+154*spread,ty-132,655+spread*352,412,finish*.74,-.22);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.12);
  target(opponent,tx,ty-hit*14,-.11-hit*.37-ease((t-210)/29)*1.36,2.56);
  for(const [i,h] of hits.entries()){
   const slot=[0,0,0,1,0,2][i];
   art.strike(slot,tx-11,ty-118,413+i*13,338,pulse(t,h,4,9),[.3,-.62,1.02,.09,-.72,.51][i],slot===0?-1:1);
  }
  art.strike(2,tx-9,ty-76,258+spread*126,171,pulse(t,209,2,11),.32);
  ctx.restore();flash('192,153,255',Math.max(hit*.1,finish*.22));bands(t,'#190e2e');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,169+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

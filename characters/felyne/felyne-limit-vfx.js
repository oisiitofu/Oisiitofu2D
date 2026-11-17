'use strict';

const FelyneLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('felyne',['cutin','effects','camp','tools','motion']);
 const shots=[
  [0,437,669,1121,668,779,427,.94,0,0],[31,713,669,1121,668,917,430,.98,0,22],
  [45,922,669,1128,657,1025,429,1,.017,19],[62,794,565,1192,614,993,385,.91,-.022,31],
  [81,740,669,1237,617,989,422,.94,.02,27],[100,932,626,1260,645,1096,417,.94,-.026,42],
  [120,839,447,1218,604,1028,355,.88,.021,32],[140,628,668,1296,651,962,430,.86,-.017,34],
  [162,745,669,1278,665,1012,430,.85,0,34],[174,824,669,1292,657,1058,426,.89,0,34],
  [187,925,667,1305,658,1115,430,.91,-.016,36],[207,757,464,1328,644,1078,387,.87,-.012,42],
  [211,771,462,1333,645,1115,391,.91,.025,42],[223,780,518,1466,535,1177,405,.79,.013,42],
  [231,787,641,1617,431,1193,400,.76,0,42],[248,804,669,1911,313,1323,412,.73,0,0]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));

 function boomerang(x,y,angle,alpha){
  const item=characterArt.felyne?.effects[2];
  if(!item||alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha*=alpha;
  ctx.drawImage(item,-64,-42,128,84);ctx.restore();
 }

 function draw({attacker,target:opponent,face,time}){
  const t=FelyneLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...FelyneLimitProfile.combo.keys()];
  const impact=Math.max(...hits.map(h=>pulse(t,h,4,9))),finish=pulse(t,211,5,25);
  frameClip();
  const width=W+358,height=width*9/16,floor=H*.51+(669-cy)*z;
  art.image('camp',-(width-W)*.48-(cx-1050)*.14,Math.min(-8,floor-height*.82),width,height);
  ctx.fillStyle='rgba(27,13,23,'+(pulse(t,209,11,28)*.42)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.51,finish));
  const trap=ease((t-88)/10)*(1-ease((t-208)/12)),pin=pulse(t,100,4,12);
  art.grid('tools',1,2,1,1305,676,375+pin*105,{anchorY:.51,alpha:trap*.81});
  art.glow(2,1305,612,264,234,pin*.57);
  const rollProgress=ease((t-185)/26),barrelX=mix(1020,1328,rollProgress),barrelY=566;
  if(t>=185&&t<211){
   ctx.save();ctx.translate(barrelX,barrelY);ctx.rotate((t-185)*.19);
   art.grid('tools',0,2,1,0,0,231+56*rollProgress,{anchorY:.5});
   ctx.restore();
  }
  const spread=ease((t-211)/17);
  const bloomHeight=mix(485,855,spread);
  art.strike(3,1331+spread*88,667-bloomHeight*.38,mix(640,1184,spread),bloomHeight,finish,.02);
  art.glow(3,1361+spread*127,501,647+spread*546,449+spread*282,finish*.36,.18);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  if(!attacker.color&&t>=167&&t<228){
   const motion=t<185?0:t<194?1:2;
   art.grid('motion',motion,3,1,x,y,[268,251,265][motion],{anchorY:.95});
  }else drawSprite(sprite,1,pose,3.11);
  target(opponent,tx,ty-impact*13,-.11-impact*.38-ease((t-212)/25)*1.43,2.47);
  for(const [i,h] of hits.entries()){
   if(i===1||i===4){
    const flight=ease((t-h+14)/14),ox=mix(x+63,tx,flight);
    const oy=mix(y-91,ty-104,flight)+Math.sin(Math.PI*flight)*(i===1?-105:94);
    boomerang(ox,oy,t*.28,pulse(t,h,14,4));
   }
   art.strike([1,0,1,2,0,2][i],tx-13,ty-106,380+i*15,303,pulse(t,h,4,9),
    [-.15,.43,-.22,.08,-.6,.19][i]);
  }
  art.strike(2,1328,552,330,303,pulse(t,211,1,7)*.8,.09);
  ctx.restore();
  flash('255,218,155',Math.max(impact*.1,pulse(t,211,1,7)*.19));
  bands(t,'#24312b');
  portraitPanel(t,-24,art.portrait);
  ctx.restore();
 }

 function drawContact({x,y,time}){art.strike(1,x,y,166+time*4,146,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

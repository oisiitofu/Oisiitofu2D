"use strict";
const AlainLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('alain',['cutin','court','poses','motion','horse','cavalry','effects']);
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 const shots=[
 [0,650,720,1010,625,850,410,1,0,0],[29,620,720,1010,625,835,410,1,-.01,1],
 [45,800,720,1080,625,940,410,.98,.012,2],[61,720,720,1100,625,910,410,.96,0,1],
 [76,830,730,1170,490,1000,360,.91,.012,3],[96,650,740,1170,625,920,410,.86,0,4],
 [114,650,670,1170,625,920,390,.82,0,5],[129,600,850,1170,625,900,430,.76,0,8],
 [279,660,850,1170,625,910,435,.75,0,13],[295,660,850,1170,625,910,405,.77,-.01,14],
 [320,700,850,1190,625,945,405,.73,.014,14],[340,700,850,1440,480,1040,400,.73,0,15],
 [365,700,850,1770,230,1160,370,.73,0,15]
 ];
 function rider(t){
  if(t<129||t>=279){const s=camera(shots,t);return {x:s[0],y:s[1],pose:s[8],face:1,scale:1};}
  // One continuous orbit in depth around the victim, then braking into a stationary finisher.
  const p=(t-129)/150,angle=Math.PI+p*Math.PI*2,depth=Math.sin(angle);
  return {x:1100+470*Math.cos(angle),y:830+65*depth,pose:t<148?9:t<169?10:t<193?11:t<222?12:t<245?10:t<266?12:13,face:Math.sin(angle)<0?1:-1,scale:1+depth*.12};
 }
 function actor(t,alpha=1){const {x,y,pose:p,face,scale}=rider(t);art.grid(p>=12?'cavalry':p>=8?'horse':p<4?'poses':'motion',p%4,2,2,x,y,(p>=8?800:550)*scale,{alpha,face});}
 function draw({target:opponent,face,time}){
  const t=AlainLimitProfile.shotTime(time),s=camera(shots,t),[,,tx,ty,,,z,roll]=s;
  const riding=t>=129&&t<279,r=rider(t),cx=riding?1100:s[4],cy=riding?440:s[5];
  const hit=Math.max(...Array.from(AlainLimitProfile.combo.keys(),n=>pulse(t,n-1,n,n+2,n+7)));
  const charge=pulse(t,281,304,314,322),finish=pulse(t,314,320,330,347);
  frameClip();ctx.fillStyle='#0c1630';ctx.fillRect(0,0,W,H);art.image('court',-70,-60,W+140,H+120);
  world(cx,cy,riding?.76:z,roll,face,t,Math.max(hit*.55,finish));
  if(riding&&r.y<830)actor(t);
  if(t>=129&&t<279){art.glow(2,r.x,r.y-55,240,110,.10);}
  art.strike(0,tx-130,ty-95,440,385,pulse(t,40,45,47,58));
  art.strike(1,tx-65,ty-95,590,518,pulse(t,71,76,78,87),-.38);
  for(const n of [155,214])art.strike(1,tx-r.face*80,ty-95,650,570,pulse(t,n-4,n,n+1,n+9),n===214?.30:-.20,r.face);
  art.glow(2,r.x+40,r.y-460,430,378,charge*.42);
  // A stationary astral release follows the horse's deliberate braking/rearing pose.
  art.strike(3,960,425,1120,600,finish,.48);
  art.strike(0,tx,ty-95,470,412,finish*.65);
  if(!(riding&&r.y<830))actor(t);
  target(opponent,tx+hit*14,ty-hit*15,-.12-hit*.23-ease((t-321)/30)*1.44);
  ctx.restore();flash('244,232,190',Math.max(hit*.08,finish*.20));bands(t,'#071326');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,185+time*5,163,1-time/AlainLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

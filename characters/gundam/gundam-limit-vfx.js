'use strict';
const GundamLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('gundam',['cutin','court','poses','effects']);
 const shots=[
  [0,480,650,1000,629,738,422,1.08,-.014,0],
  [45,499,650,991,627,747,425,1.04,.017,0],
  [75,544,649,1022,621,783,412,.97,-.017,1],
  [110,633,650,1043,612,835,404,.94,.016,2],
  [154,699,650,1087,584,895,395,.91,-.016,2],
  [174,652,650,1039,449,857,311,.80,.014,3],
  [196,650,650,938,157,812,269,.79,-.014,3],
  [214,656,650,1137,117,881,287,.81,.015,3],
  [257,635,650,1738,154,949,424,.88,0,3]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=GundamLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const damage=pulse(t,159,172,177,186),shot=pulse(t,190,202,213,228),blast=pulse(t,199,213,216,237);
  const flinch=Math.max(...Array.from(GundamLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#1e2235';ctx.fillRect(0,0,W,H);art.image('court',-74-t*.11,-54,W+175,H+113);
  world(cx,cy,z,roll,face,t,Math.max(blast,flinch*.47,damage*.57));
  art.grid('poses',pose,2,2,x,y,442);
  target(opponent,tx+flinch*22,ty-flinch*19,-.1-flinch*.2-ease((t-208)/37)*1.48);
  for(const hit of [52,70]){
   const travel=ease((t-hit+7)/7);
   art.strike(0,mix(x+151,tx-41,travel),mix(y-168,ty-109,travel),249,117,pulse(t,hit-7,hit-5,hit,hit+6));
  }
  const bazooka=ease((t-75)/14);
  art.strike(0,mix(x+139,tx-57,bazooka),mix(y-224,ty-126,bazooka),179,79,pulse(t,75,77,89,91),.21);
  art.strike(1,tx-13,ty-110,351,294,pulse(t,87,91,94,107));
  for(const [hit,angle] of [[121,-.23],[137,.28],[158,-.43]]){
   const slash=pulse(t,hit-5,hit,hit+2,hit+9);
   art.strike(2,tx-99,ty-125,389+slash*105,226+slash*79,slash,angle,-1);
  }
  art.strike(1,x+18,y-244,278,211,damage*.79);
  if(shot>0){
   const muzzleX=x+51,muzzleY=y-411,size=559+shot*221;
   const angle=Math.atan2(65-muzzleY,944-muzzleX)+Math.atan2(.9,.8);
   const dx=-.32*size,dy=.42*size;
   art.strike(3,muzzleX-dx*Math.cos(angle)+dy*Math.sin(angle),muzzleY-dx*Math.sin(angle)-dy*Math.cos(angle),size,size,shot,angle);
  }
  art.strike(1,962,79,303+blast*398,269+blast*270,blast);
  ctx.restore();flash('255,177,219',Math.max(shot*.15,blast*.25));bands(t,'#1e2135');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(2,x,y,150+time*5,108,1-time/GundamLimitProfile.contactHold*.6,-.13*face,-face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

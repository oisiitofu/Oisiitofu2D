'use strict';
const IoLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('io',['cutin','court','poses','effects']);
 const shots=[
  [0,471,648,1001,627,734,422,1.10,-.012,0],
  [46,604,648,991,624,789,427,1.07,.016,1],
  [83,657,649,1027,614,841,410,1.00,-.014,2],
  [111,572,649,1038,618,805,381,.86,.017,0],
  [137,581,649,1059,603,808,372,.84,-.014,3],
  [167,610,649,1106,601,863,356,.82,.015,3],
  [202,634,649,1250,493,907,388,.84,-.016,3],
  [255,611,649,1729,173,939,431,.88,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=IoLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const bloom=pulse(t,145,172,208,234),amber=pulse(t,151,174,188,199),release=pulse(t,182,197,207,231);
  const flinch=Math.max(...Array.from(IoLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#2e202c';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.10,-53,W+174,H+110);
  world(cx,cy,z,roll,face,t,Math.max(release,flinch*.47));
  art.strike(2,x-19,y-266,575+bloom*208,429+bloom*267,bloom*.92);
  art.grid('poses',pose,2,2,x,y,388,{alpha:1-bloom*.78});
  target(opponent,tx+flinch*23,ty-flinch*18,-.1-flinch*.2-ease((t-200)/36)*1.48);
  for(const [hit,angle,offset] of [[54,-.16,-9],[72,.28,11],[93,-.4,-36]]){
   const slash=pulse(t,hit-5,hit,hit+2,hit+9);
   art.strike(0,tx-89,ty-121+offset,358+slash*132,192+slash*86,slash,angle);
  }
  art.strike(1,tx-85,ty-96,543,228,pulse(t,115,131,135,146),.09);
  art.strike(1,tx-59,ty-121,436,235,pulse(t,149,157,161,169),-.33);
  if(amber>0){
   const travel=ease((t-174)/23),ax=mix(x+104,tx-40,travel),ay=mix(y-270,ty-115,travel)-92*Math.sin(travel*Math.PI);
   const light=ctx.createRadialGradient(ax,ay,1,ax,ay,70);
   light.addColorStop(0,'#fffbe3');light.addColorStop(.19,'#ffdb79');light.addColorStop(.37,'#ffb952aa');light.addColorStop(1,'#ff9c3000');
   ctx.save();ctx.globalAlpha=amber;ctx.fillStyle=light;ctx.fillRect(ax-70,ay-70,140,140);ctx.restore();
  }
  art.strike(3,1144,508-release*83,478+release*481,342+release*309,release);
  ctx.restore();flash('255,216,147',Math.max(release*.25,amber*.09));bands(t,'#2f222d');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,151+time*5,114,1-time/IoLimitProfile.contactHold*.6,-.12*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

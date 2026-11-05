'use strict';
const TwinbeeLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('twinbee',['cutin','court','poses','effects']);
 const shots=[
  [0,490,625,995,594,744,384,1.08,.014,0],
  [36,535,625,1005,594,777,384,1.08,-.014,1],
  [60,560,618,1025,585,799,378,1.07,.015,1],
  [92,588,608,1055,577,826,371,1.07,-.015,1],
  [111,605,605,1074,575,841,368,.95,.014,1],
  [150,629,600,1100,570,869,361,.94,-.016,1],
  [185,660,595,1132,565,900,355,.95,.016,1],
  [201,597,615,1140,563,871,354,.88,-.014,2],
  [220,597,615,1144,562,873,353,.88,.014,2],
  [231,597,615,1146,560,874,352,.87,-.018,3],
  [251,597,615,1470,368,939,354,.82,.014,3],
  [269,597,615,1780,170,997,355,.82,0,3]
 ];
 const first=[44,60,76,92],second=[118,134,150,166,185];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=TwinbeeLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const flinch=Math.max(...Array.from(TwinbeeLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const clones=pulse(t,98,111,185,202),charge=pulse(t,195,215,223,231),finish=pulse(t,226,231,237,257);
  frameClip();ctx.fillStyle='#287ccc';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.12,-66,W+189,H+134);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.53,finish));
  for(const dy of [-137,137])art.grid('poses',1,2,2,x-123,y+dy,287,{alpha:clones*.82});
  for(const hit of first){
   const travel=ease((t-hit+11)/11),ax=x+147,ay=y-65,bx=tx-19,by=ty-102;
   art.strike(0,mix(ax,bx,travel),mix(ay,by,travel),293,159,pulse(t,hit-11,hit-8,hit,hit+5),Math.atan2(by-ay,bx-ax));
   art.strike(1,tx-15,ty-101,201,177,pulse(t,hit-1,hit,hit+1,hit+7));
  }
  for(const hit of second){
   for(const lane of [-1,0,1]){
    const travel=ease((t-hit+12)/12),ax=x+(lane?116:147)-(lane?123:0),ay=y-(lane?53:65)+lane*137;
    art.strike(0,mix(ax,tx-19,travel),mix(ay,ty-102+lane*19,travel),292,144,pulse(t,hit-12,hit-9,hit,hit+5),Math.atan2(ty-102+lane*19-ay,tx-19-ax));
   }
   art.strike(1,tx-15,ty-101,258,227,pulse(t,hit-1,hit,hit+2,hit+8));
  }
  const orbX=x+153,orbY=y-91;
  art.glow(2,orbX,orbY,155+charge*188,(155+charge*188)*650/740,charge*.72);
  const travel=ease((t-219)/12),bigX=mix(orbX,tx-14,travel),bigY=mix(orbY,ty-104,travel);
  const width=390+finish*240;
  // Native atlas ratio keeps the Big Shot's round head circular.
  art.strike(3,bigX-width*.18,bigY,width,width*650/740,pulse(t,218,222,237,257));
  art.strike(1,tx-13,ty-102,343+finish*170,302+finish*150,finish);
  art.grid('poses',pose,2,2,x,y,357);
  target(opponent,tx+flinch*19,ty-flinch*17,-.10-flinch*.26-ease((t-232)/28)*1.45);
  ctx.restore();flash('255,237,176',Math.max(flinch*.11,finish*.23));bands(t,'#143663');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(1,x,y,166+time*6,136,1-time/TwinbeeLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

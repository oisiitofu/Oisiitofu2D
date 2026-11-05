"use strict";
const WillLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('will',['cutin','court','poses','motion','avatars','effects']);
 // A vertical duel: retreat, lift, aerial turn, descent, royal awakening and overhead finish.
 const shots=[
 [0,650,720,1010,625,850,410,1,0,0],[31,605,720,1010,625,830,410,1,-.01,1],
 [42,660,740,1040,560,850,390,.94,-.01,1],[52,800,730,1120,375,960,340,.89,.014,2],
 [69,850,570,1140,230,995,235,.85,0,3],[90,900,480,1220,150,1050,125,.86,.015,3],
 [106,930,370,1230,275,1070,160,.84,-.01,4],[124,930,420,1240,510,1080,285,.90,.014,5],
 [143,930,730,1230,625,1080,420,.95,0,6],[158,700,730,1110,625,900,415,.90,-.01,7],
 [173,700,650,1110,610,910,350,.80,0,8],[187,700,680,1120,580,920,350,.78,0,8],
 [207,760,710,1110,365,940,340,.82,.012,9],[227,850,360,1120,430,985,225,.76,-.01,10],
 [249,850,390,1150,580,1000,300,.78,.015,11],[271,850,620,1150,625,1000,370,.75,0,8],
 [290,840,330,1160,625,1000,290,.70,-.01,10],[304,900,390,1190,650,1040,325,.70,.016,11],
 [324,930,730,1330,550,1080,390,.73,0,8],[338,930,730,1540,365,1150,370,.75,0,6],
 [350,930,730,1770,180,1240,340,.75,0,7]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function actor(t,alpha=1){const [x,y,,,,,,,p]=camera(shots,t);art.grid(p>=8?'avatars':p<4?'poses':'motion',p%4,2,2,x,y,p>=8?850:550,{alpha});}
 function draw({target:opponent,face,time}){
  const t=WillLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll]=camera(shots,t);
  const hit=Math.max(...Array.from(WillLimitProfile.combo.keys(),n=>pulse(t,n-1,n,n+2,n+7)));
  const awake=pulse(t,160,174,183,198),charge=pulse(t,272,294,300,309),finish=pulse(t,299,304,313,330);
  frameClip();ctx.fillStyle='#170a12';ctx.fillRect(0,0,W,H);art.image('court',-70,-65,W+140,H+130);
  world(cx,cy,z,roll,face,t,Math.max(hit*.65,finish));
  art.glow(2,x,y-270,650,570,Math.max(awake*.5,charge*.4));
  if(t>42&&t<143||t>198&&t<267)actor(t-4,.12);
  for(const [n,angle] of [[52,-.90],[90,-.90],[124,.82],[207,-.92],[249,.85]])art.strike(0,tx-70,ty-95,620,545,pulse(t,n-4,n,n+1,n+9),angle);
  // The source beam points RIGHT. Rotate the whole attack down-right for the overhead sword.
  art.strike(1,1080,460,980,470,finish,1.02);
  art.strike(3,tx,ty-95,1050,920,finish);
  actor(t);target(opponent,tx+hit*13,ty-hit*15,-.10-hit*.22-ease((t-305)/30)*1.44);
  ctx.restore();flash('255,224,166',Math.max(hit*.08,awake*.15,finish*.20));bands(t,'#180a12');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,185+time*5,163,1-time/WillLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

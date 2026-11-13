"use strict";

const JibanyanLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=JibanyanLimitProfile;
 const art=assets('jibanyan',['cutin','court','poses','flurry','finish','props','effects']);
 const atlases=['poses','flurry','finish'];
 const shots=[
  [0,520,749,1060,734,798,410,.92,0,1],
  [30,520,749,1060,734,798,410,.92,0,1],
  [48,874,709,1124,710,1000,420,.93,-.018,2],
  [68,1046,751,1124,585,1076,392,.90,.012,3],
  [91,1144,747,1158,547,1151,386,.91,0,4],
  [147,1155,617,1170,336,1160,315,.88,-.014,7],
  [175,1230,640,1218,407,1209,347,.83,.028,8],
  [202,1637,512,1296,544,1408,375,.68,.041,9],
  [208,1624,507,1289,561,1397,375,.70,.022,-10],
  [226,1393,446,1270,660,1320,379,.77,-.031,-10],
  [250,1190,751,1081,747,1139,428,.82,.012,-3],
  [270,994,700,792,671,891,421,.84,-.023,-11],
  [306,1077,749,748,731,905,430,.86,0,-1],
  [324,926,693,654,666,780,393,.80,-.028,-12],
  [350,926,749,291,456,665,374,.70,0,-1],
  [378,926,749,95,237,583,347,.65,0,-1]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const burst=t>=88&&t<=151;
  const pose=burst?[5,6,5,6,7][Math.min(4,Math.floor((t-88)/14))]:Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,8)));
  const finish=pulse(t,324,3,22);
  frameClip();
  ctx.fillStyle='#152331';ctx.fillRect(0,0,W,H);
  art.image('court',-86-cx*.017,-69-cy*.022,W+225,H+148);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.53,finish));
  art.grid('props',0,2,2,1649,565,500,{alpha:pulse(t,201,21,28)});
  art.grid('props',1,2,2,x+80,y+8,507,{alpha:pulse(t,253,7,42)});
  art.glow(2,x,y-98,439,305,pulse(t,308,12,25)*.63);
  art.strike(3,tx-55,ty-109,820,632,finish,0,-1);
  for(const [beat,kind,angle] of [[48,0,0],[91,1,-1.57],[105,1,-1.57],[119,1,-1.57],[133,1,-1.57],[147,1,-1.57],[226,2,2.26],[270,0,0]]){
   if(kind!==1)art.strike(kind,tx,ty-97,424,317,pulse(t,beat,2,8),angle,beat===270?-1:1);
   else art.strike(1,tx+18,ty-32,370,245,pulse(t,beat,2,8),angle);
  }
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,402,{face:Math.sign(signedPose)});
  target(opponent,tx,ty,-.12-hit*.38+ease((t-325)/28)*1.26,2.73);
  ctx.restore();
  flash('189,247,255',Math.max(hit*.05,finish*.15));bands(t,'#132637');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,174+time*5,141+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

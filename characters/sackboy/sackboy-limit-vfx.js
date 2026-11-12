"use strict";

const SackboyLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=SackboyLimitProfile;
 const art=assets('sackboy',['cutin','court','poses','motion','star','props','effects']);
 const atlas=['poses','motion','star'];
 const shots=[
  [0,558,751,1083,739,813,421,.97,0,1],
  [31,558,751,1083,739,813,421,.97,0,1],
  [52,883,749,1083,735,981,433,.92,.012,1],
  [80,915,749,1134,681,1017,424,.91,-.022,2],
  [104,960,567,1191,667,1072,347,.85,-.016,3],
  [128,1092,536,1215,565,1144,349,.86,.019,4],
  [148,1132,628,1289,450,1185,362,.88,.011,5],
  [164,1269,750,1180,441,1193,401,.85,-.017,5],
  [184,1401,751,1153,558,1235,430,.86,-.013,-6],
  [207,1385,751,1160,655,1271,434,.91,0,-7],
  [222,1381,687,1167,673,1271,417,.88,.032,-8],
  [249,1381,457,1155,500,1279,353,.84,-.035,-8],
  [267,1270,389,1141,543,1209,312,.84,-.039,-9],
  [277,1136,478,1197,620,1158,358,.88,.037,10],
  [299,977,634,1224,684,1118,418,.88,.012,11],
  [321,900,750,1293,701,1114,431,.74,-.022,12],
  [343,900,750,1620,429,1249,379,.70,0,12],
  [369,900,750,1880,313,1390,381,.68,0,12]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function mechanism(t){
  const place=ease((t-52)/15)*(1-ease((t-84)/9));
  const fold=ease((t-69)/21);
  const hingeY=mix(745,550,fold);
  const rig=(1-ease((t-186)/25))*ease((t-68)/16);
  art.grid('props',0,2,2,1033,758,223,{alpha:place});
  ctx.save();
  ctx.translate(1065,749);ctx.scale(1,mix(.05,1,fold));
  art.grid('props',1,2,2,0,0,397,{alpha:rig});
  ctx.restore();
  art.grid('props',0,2,2,1092,hingeY+14,172,{alpha:rig});
  const piston=ease((t-184)/16)*(1-ease((t-262)/20));
  const press=ease((t-211)/38)*(1-ease((t-258)/18));
  ctx.save();
  ctx.translate(1381,751);ctx.scale(1,mix(.19,1,press));
  art.grid('props',2,2,2,0,0,356,{alpha:piston});
  ctx.restore();
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,4,8)));
  const finish=pulse(t,321,6,26);
  const sticker=pulse(t,277,6,26);
  const spread=ease((t-280)/39);
  const star=ease((t-274)/12)*(1-ease((t-331)/26));
  frameClip();
  ctx.fillStyle='#2d2543';ctx.fillRect(0,0,W,H);
  art.image('court',-85-cx*.022,-78-cy*.03,W+246,H+153);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.57,finish));
  mechanism(t);
  ctx.save();
  ctx.translate(1155,545);ctx.rotate((1-spread)*-.42);ctx.scale(mix(.31,1,spread),1);
  art.grid('props',3,2,2,0,0,113+spread*851,{anchorY:.51,alpha:star});
  ctx.restore();
  art.glow(2,1149,532,287+spread*580,205+spread*431,star*.62);
  art.strike(3,tx-28,ty-125,925,696,finish);
  target(opponent,tx,ty-hit*11,-.13-hit*.35-ease((t-322)/34)*1.52,2.71);
  art.grid(atlas[Math.floor(pose/4)],pose%4,2,2,x,y,396,{face:Math.sign(signedPose)});
  art.strike(2,x+62,y-126,180,142,sticker);
  for(const [i,beat] of [...profile.combo.keys()].entries()){
   const effect=i===0||i===5?2:i<3?0:1;
   art.strike(effect,tx-19,ty-111,320+i*14,265+i*9,pulse(t,beat,4,10),i===2?-.85:i===4?-1.3:0);
  }
  ctx.restore();
  flash('255,230,171',Math.max(hit*.058,finish*.16));
  bands(t,'#221a30');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,177+time*5,147+time*4,1-time/profile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

"use strict";

const CrashLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=CrashLimitProfile;
 const art=assets('crash',['cutin','court','poses','motion','spin','props','masks','effects']);
 const shots=[
  [0,426,752,917,739,702,421,.96,0,1],
  [31,426,752,917,739,702,421,.96,0,1],
  [48,537,746,920,738,758,418,.95,0,1],
  [65,658,620,935,699,827,379,.91,.013,2],
  [86,764,491,963,640,863,338,.86,-.016,2],
  [104,866,533,1028,654,945,351,.88,.017,3],
  [122,958,458,1104,627,1015,327,.86,-.009,5],
  [138,1053,588,1145,681,1080,377,.88,.02,6],
  [164,1034,734,1172,724,1100,414,.91,0,7],
  [179,988,734,1150,710,1062,415,.92,-.011,-7],
  [199,896,684,1176,713,1026,392,.91,-.015,-5],
  [215,939,578,1246,690,1077,350,.88,.014,5],
  [235,1081,736,1272,720,1173,416,.92,.014,8],
  [254,1058,736,1293,730,1175,419,.91,-.009,4],
  [279,1180,730,1354,683,1250,410,.88,.018,10],
  [303,1191,714,1430,700,1313,404,.85,-.018,9],
  [325,1384,656,1517,653,1453,385,.82,.019,11],
  [342,1474,735,1792,479,1544,390,.77,0,12],
  [373,1474,735,2015,304,1660,389,.75,0,12]
 ];
 const atlas=['poses','motion','spin'];
 const crates=[
  {x:661,y:756,show:49,hit:65},
  {x:861,y:661,show:68,hit:104},
  {x:1104,y:730,show:104,hit:138},
  {x:1109,y:748,show:159,hit:179},
  {x:1219,y:755,show:196,hit:235},
  {x:1328,y:750,show:237,hit:279}
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function crate({x,y,show,hit},t){
  const alpha=ease((t-show)/10)*(1-ease((t-hit)/7));
  const outline=pulse(t,show,8,6)*(1-alpha);
  if(outline>0){
   ctx.save();ctx.globalAlpha=outline*.73;ctx.strokeStyle='#75dfff';ctx.lineWidth=5;ctx.setLineDash([13,9]);
   ctx.strokeRect(x-63,y-135,126,126);ctx.restore();
  }
  art.grid('props',0,2,2,x,y,166,{alpha});
  const age=(t-hit)*(hit===179?.55:1);
  const debris=ease(age/14);
  const pieces=(1-ease((age-5)/20))*ease((age+1)/4);
  if(pieces<=0)return;
  for(let i=0;i<4;i++){
   const dx=(i-1.5)*(49+92*debris),dy=debris*(93+i*13)-debris*debris*47;
   ctx.save();ctx.translate(x+dx,y-65-dy);ctx.rotate(debris*(i-1.5));
   art.grid('props',1+i%2,2,2,0,0,129-i*13,{anchorY:.5,alpha:pieces});ctx.restore();
  }
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,325,5,24);
  frameClip();
  ctx.fillStyle='#261c3c';ctx.fillRect(0,0,W,H);
  art.image('court',-77-cx*.024,-65-cy*.039,W+222,H+125);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.54,finish));
  for(const item of crates)crate(item,t);
  const phase=ease((t-34)/12)*(1-ease((t-116)/19));
  const slow=ease((t-152)/15)*(1-ease((t-227)/19));
  const dark=ease((t-248)/23)*(1-ease((t-351)/19));
  art.grid('masks',0,2,2,x-136,y-288,258,{alpha:phase});
  art.grid('masks',1,2,2,x-122,y-290,253,{alpha:slow});
  art.grid('masks',2,2,2,x-138,y-289,259,{alpha:dark});
  art.grid('masks',3,2,2,x+161,y-169,181,{alpha:pulse(t,48,9,11)});
  const fruit=pulse(t,239,15,17);
  art.grid('props',3,2,2,x+49,y-247,146,{alpha:fruit});
  art.glow(1,x-49,y-139,493,403,slow*.51);
  art.glow(2,x+40,y-132,524,442,dark*.62);
  art.strike(3,tx+44,ty-151,860,641,finish);
  target(opponent,tx,ty-hit*10,-.1-hit*.29-ease((t-326)/35)*1.47,2.75);
  art.grid(atlas[Math.floor(pose/4)],pose%4,2,2,x,y,429,{face:Math.sign(signedPose)});
  for(const [index,beat] of [...profile.combo.keys()].entries()){
   const strike=pulse(t,beat,3,9);
   const effect=index===5?2:0;
   art.strike(effect,mix(x,tx,.68),ty-140,319+index*12,276+index*12,strike,-.07);
  }
  ctx.restore();
  flash('255,221,161',Math.max(hit*.068,finish*.18));
  bands(t,'#1c122a');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,176+time*5,150+time*4,1-time/profile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

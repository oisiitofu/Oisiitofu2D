"use strict";

const SuminoLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=SuminoLimitProfile;
 const art=assets('sumino',['cutin','court','poses','motion','defense','props','effects']);
 const atlas=['poses','motion','defense'];
 const shots=[
  [0,544,748,1081,727,819,420,.97,0,1],
  [31,544,748,1081,727,819,420,.97,0,1],
  [63,850,741,1092,715,980,418,.91,.014,1],
  [82,879,734,1117,723,1004,419,.90,-.018,2],
  [102,1044,765,1220,735,1129,427,.89,.035,3],
  [128,1012,730,1260,708,1133,420,.87,-.028,4],
  [151,892,663,1245,694,1071,386,.84,-.015,5],
  [174,985,636,1263,696,1106,382,.84,.028,5],
  [194,1100,656,1308,671,1210,390,.86,-.025,6],
  [215,1120,663,1357,685,1234,391,.86,.022,7],
  [236,1153,734,1388,714,1264,414,.88,.02,8],
  [255,1110,752,1373,717,1241,420,.89,-.014,9],
  [278,1228,750,1405,716,1325,420,.85,.023,10],
  [298,1227,748,1419,718,1323,422,.82,-.019,10],
  [327,1248,751,1539,690,1400,412,.78,.025,11],
  [348,1250,751,1804,466,1493,382,.71,0,12],
  [372,1250,751,2081,306,1586,377,.68,0,12]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function tiles(t){
  const strength=ease((t-40)/16)*(1-ease((t-352)/19));
  const advance=pulse(t,97,20,18),retreat=pulse(t,150,18,22),final=pulse(t,320,36,26);
  ctx.save();ctx.globalAlpha*=strength;
  for(let row=0;row<5;row++){
   for(let col=0;col<8;col++){
    const x=699+col*121+row*24,y=602+row*45;
    const finishLane=col>=4&&col<=6;
    const intensity=Math.max(row>=2&&col<4?advance:0,row<2&&col<3?retreat:0,finishLane?final:0);
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+112,y);ctx.lineTo(x+136,y+44);ctx.lineTo(x+24,y+44);ctx.closePath();
    ctx.strokeStyle=col===2?'rgba(255,216,158,.72)':final>.2&&finishLane?'rgba(255,209,138,.87)':'rgba(255,81,104,.39)';
    ctx.lineWidth=col===2||final>.2&&finishLane?5:2;ctx.stroke();
    if(intensity>0){
     ctx.fillStyle=finishLane?'rgba(255,180,85,'+(intensity*.32)+')':'rgba(232,45,68,'+(intensity*.23)+')';
     ctx.fill();
    }
   }
  }
  ctx.restore();
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,327,6,27);
  frameClip();
  ctx.fillStyle='#321d2b';ctx.fillRect(0,0,W,H);
  art.image('court',-89-cx*.022,-81-cy*.026,W+243,H+161);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.59,finish));
  art.grid('props',0,2,2,919,728,453,{alpha:ease((t-39)/18)*(1-ease((t-304)/24))});
  art.grid('props',1,2,2,1637,750,591,{alpha:ease((t-181)/19)*(1-ease((t-343)/20))});
  tiles(t);
  art.glow(1,x+45,y-116,406,291,pulse(t,313,22,21)*.73);
  art.strike(3,tx+39,ty-132,1018,692,finish);
  target(opponent,tx,ty-hit*11,-.13-hit*.34-ease((t-329)/36)*1.53,2.78);
  const depth=1-ease((t-125)/24)*(1-ease((t-211)/24))*.13;
  art.grid(atlas[Math.floor(pose/4)],pose%4,2,2,x,y,472*depth,{face:Math.sign(signedPose)});
  for(const [i,beat] of [...profile.combo.keys()].entries()){
   const kind=i===0||i===4?0:i===2?1:2;
   art.strike(kind,tx-23,ty-128,332+i*13,268+i*9,pulse(t,beat,3,10),i===1?.19:i===3?-.28:0);
  }
  ctx.restore();
  flash('255,219,203',Math.max(hit*.058,finish*.17));
  bands(t,'#241622');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(2,x,y,177+time*5,149+time*4,1-time/profile.contactHold*.62,-.12*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

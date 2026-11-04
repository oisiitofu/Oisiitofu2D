'use strict';
const TwoBLimitVFX=(()=>{
 const {assets,unit,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('twob',['cutin','court','poses','flight','pod','effects']);
 const shots=[
  // Time, 2B, opponent, camera center, zoom, roll, 2B pose.
  [0,478,654,858,621,694,466,1.15,-.05,0],
  [31,532,647,877,625,713,456,1.18,.026,0],
  [54,566,464,905,620,701,421,1.06,-.08,1],
  [73,562,448,921,605,681,411,1.10,-.04,1],
  [94,643,361,972,583,759,391,1.01,.078,1],
  [111,750,303,993,571,832,384,1.12,.083,1],
  [132,619,366,1004,576,754,434,.96,-.07,2],
  [151,623,351,1016,556,803,415,1.1,-.066,2],
  [169,790,407,1014,566,882,430,1.23,.092,3],
  [178,886,505,1017,569,935,440,1.29,.085,3],
  [187,1054,613,1035,569,1001,457,1.34,-.07,4],
  [195,1094,622,1047,563,1004,462,1.31,-.026,4],
  [207,1101,631,1159,469,1016,459,1.13,-.038,5],
  [226,1123,635,1338,390,1044,445,1.02,.015,5],
  [248,1123,638,1590,280,1042,453,1,0,5]
 ];
 function reticle(x,y,t,strength){
  if(strength<=0)return;
  const r=mix(157,81,ease((t-44)/37));
  ctx.save();ctx.translate(x,y);ctx.globalAlpha=strength;
  ctx.strokeStyle='#ff5f55';ctx.lineWidth=2.2;
  for(let n=0;n<4;n++){
   ctx.beginPath();ctx.moveTo(r-27,-r);ctx.lineTo(r,-r);ctx.lineTo(r,-r+26);ctx.stroke();ctx.rotate(TAU/4);
  }
  ctx.globalAlpha*=.62;ctx.beginPath();ctx.ellipse(0,0,r*.78,r*.78,0,0,TAU);ctx.stroke();
  ctx.strokeStyle='#ffe9bd';ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(12,0);ctx.moveTo(0,-12);ctx.lineTo(0,12);ctx.stroke();
  ctx.restore();
 }
 function burst(t,x,y,tx,ty){
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let n=0;n<23;n++){
   const start=73+n*1.72,progress=(t-start)/(9+n%5),age=t-start;
   if(age<0||progress>1.42)continue;
   const spread=Math.sin(n*2.39)*103;
   const px=mix(x,tx+spread*.4,progress),py=mix(y,ty+spread,progress);
   const angle=Math.atan2(ty+spread-y,tx-x);
   art.strike(0,px,py,134+n%4*14,24,unit(1.42-progress),angle);
   if(progress>=.96)art.strike(1,tx+spread*.39,ty+spread,174,120,unit((1.42-progress)/.42),angle);
  }
  ctx.restore();
 }
 function thrusters(x,y,t,weight){
  if(weight<=0)return;
  for(const offset of [-22,28]){
   const length=295+Math.sin(t*.88+offset)*40;
   art.glow(0,x-length*.37,y+offset,length,41,weight*.85,-.13,-1);
  }
 }
 function fragments(t,x,y,weight){
  if(weight<=0)return;
  const age=Math.max(0,t-191);
  ctx.save();
  for(let n=0;n<58;n++){
   const angle=n*2.399963,r=age*(2.2+n%9*.47);
   ctx.save();ctx.translate(x+Math.cos(angle)*r*2.3,y+Math.sin(angle)*r+age*age*.039);
   ctx.rotate(angle+age*.13);ctx.globalAlpha=weight*(.45+n%6*.09);
   ctx.fillStyle=n%4===0?'#ffbf73':n%3===0?'#e0dacf':'#38352f';
   const size=2+n%7;ctx.fillRect(-size,0,size*2,size*.58);ctx.restore();
  }
  ctx.restore();
 }
 function bladeWake(t,face){
  const age=t-179;if(age<0||age>=38)return;
  ctx.save();ctx.translate(W*.59,H*.60);ctx.scale(face,1);ctx.rotate(-.27);
  ctx.globalCompositeOperation='screen';ctx.globalAlpha=unit(1-age/38);
  const tail=age*17;
  for(const [color,width,offset] of [['#b8e4f7',20,0],['#ffebc0',7,7],['#ffffff',2,-6]]){
   ctx.strokeStyle=color;ctx.lineWidth=width*unit((38-age)/30);
   ctx.beginPath();ctx.moveTo(-1030+tail,offset+18);ctx.quadraticCurveTo(60,offset-39,1010+tail,offset+2);ctx.stroke();
  }
  ctx.restore();
 }
 function cutin(t,time){
  if(t>=30)return;
  const alpha=ease(t/5)*(1-ease((t-23)/7)),s=1+time*.00095;
  ctx.save();ctx.beginPath();ctx.moveTo(0,115);ctx.lineTo(W,63);ctx.lineTo(W,676);ctx.lineTo(0,755);ctx.closePath();ctx.clip();
  art.portrait(s,alpha);
  ctx.fillStyle='rgba(255,148,83,'+(alpha*.12)+')';ctx.fillRect(0,115,W,3);
  ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=TwoBLimitProfile.shotTime(time);
  const [x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const hit=t>=183?unit(1-(t-183)/12):0;
  const blast=ease((t-192)/7)*(1-ease((t-205)/24));
  const cityPan=ease((t-42)/69)*64;
  frameClip();ctx.fillStyle='#262b2b';ctx.fillRect(0,0,W,H);
  art.image('court',-126-cityPan*(face===1?1:.23),-76+cityPan*.65,W+292,H+155);
  world(cx,cy,z,roll,face,t,Math.max(hit,blast*.85));
  const flight=ease((t-43)/16)*(1-ease((t-149)/18));
  if(flight>0){
   const peel=ease((t-131)/34),fx=x-52+peel*395,fy=y-146-peel*108;
   thrusters(fx-198,fy+16,t,flight);
   art.grid('flight',t<78?0:t<119?1:2,3,1,fx,fy,270+peel*59,{anchorY:.53,alpha:flight});
   burst(t,fx+150,fy+29,tx,ty-107);
  }
  const pod=ease((t-27)/12)*(1-ease((t-172)/18));
  const px=mix(x+114,583,ease((t-104)/23)),py=mix(y-141,404,ease((t-104)/21))+Math.sin(t*.17)*11;
  art.image('pod',px-59,py-62,118,124,pod);
  target(opponent,tx,ty,hit*.62-(t>=190?ease((t-190)/28)*1.2:.14));
  const signal=ease((t-43)/18)*(1-ease((t-129)/12));
  reticle(tx,ty-110,t,signal);
  const laser=ease((t-126)/5)*(1-ease((t-144)/14));
  const dx=tx-px,dy=ty-105-py;
  art.strike(0,px+dx*.5,py+dy*.5,Math.hypot(dx,dy)*1.23,134,laser,Math.atan2(dy,dx));
  art.strike(1,tx,ty-92,261,183,laser*.9);
  const pilot=1-ease((t-54)/10)+ease((t-143)/10);
  art.grid('poses',index,3,2,x,y,338,{alpha:unit(pilot)});
  if(t>=175&&t<207){
   const slash=ease((t-175)/7)*(1-ease((t-187)/20));
   art.strike(2,978,474,1350+slash*110,432,slash,-.26);
  }
  art.strike(3,1066,588,692+blast*450,458+blast*208,blast);
  fragments(t,1051,586,unit(1-(t-195)/43)*blast);
  ctx.restore();
  bladeWake(t,face);
  flash('255,227,187',hit*.25+blast*.18);bands(t,'#111417');cutin(t,time);
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/TwoBLimitProfile.contactHold;
  art.strike(2,x,y,156+62*p,109,1-p*.60,-.1,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

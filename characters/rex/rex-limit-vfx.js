'use strict';
const RexLimitVFX=(()=>{
 const {assets,unit,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('rex',['cutin','court','poses','pneuma','effects']);
 const shots=[
  // Time, Rex, opponent, camera center, zoom, roll, Rex pose.
  [0,460,654,890,627,670,461,1.05,-.035,0],
  [32,510,655,867,626,690,454,1.25,-.06,0],
  [58,536,652,879,625,656,461,1.35,.032,1],
  [85,550,651,903,624,686,444,1.16,.018,2],
  [112,568,615,930,615,700,420,.96,-.04,2],
  [139,561,541,968,600,721,393,.82,-.07,3],
  [164,591,486,969,610,727,393,.74,-.092,3],
  [174,650,496,978,617,765,428,.81,-.036,3],
  [182,790,600,997,610,859,453,1.05,.063,4],
  [197,808,624,1006,590,871,451,1.02,.037,4],
  [213,805,648,1190,445,903,453,.88,-.035,5],
  [233,796,656,1390,322,911,451,.86,-.018,5],
  [257,796,656,1510,251,901,451,.87,0,5]
 ];
 const fissure=(width,height,face)=>Array.from({length:13},(_,i)=>{
  const x=width*i/12;
  return [x,height*(.74-.48*(face===1?x/width:1-x/width))+(i>0&&i<12?Math.sin(i*17)*13:0)];
 });
 function floor(t,weight){
  if(weight<=0)return;
  ctx.save();ctx.translate(626,644);ctx.scale(1,.24);ctx.rotate(-t*.018);
  ctx.globalAlpha=weight*.84;ctx.strokeStyle='#adffdf';
  for(const [r,line] of [[112,2],[158,4],[215,2],[300,1.3]]){
   ctx.lineWidth=line;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();
  }
  for(let n=0;n<14;n++){
   ctx.rotate(TAU/14);ctx.strokeRect(166,-4,45,8);
  }
  ctx.restore();
 }
 function conduits(t,x,y,weight){
  if(weight<=0)return;
  ctx.save();ctx.globalAlpha=weight;ctx.globalCompositeOperation='screen';
  for(let n=0;n<10;n++){
   const a=t*.07+n*TAU/10,dx=Math.cos(a)*248,dy=Math.sin(a)*130;
   ctx.strokeStyle=n%2?'#7effbd':'#f6e99d';ctx.lineWidth=n%3?1.4:3;
   ctx.beginPath();ctx.moveTo(704+dx*.32,205+dy*.35);
   ctx.bezierCurveTo(730+dx,285+dy,570-dx*.6,y+dy,x,y);ctx.stroke();
  }
  ctx.restore();
 }
 function splitFuture(t,face,pan){
  const points=fissure(W,H,face),show=ease((t-181)/5)*(1-ease((t-222)/23));
  if(show<=0)return;
  const split=ease((t-194)/20);
  for(const lower of [false,true]){
   ctx.save();ctx.globalAlpha=show;
   ctx.beginPath();ctx.moveTo(...points[0]);for(const point of points.slice(1))ctx.lineTo(...point);
   ctx.lineTo(W,lower?H:0);ctx.lineTo(0,lower?H:0);ctx.closePath();ctx.clip();
   ctx.translate((lower?-39:33)*face*split,(lower?68:-59)*split);
   art.image('court',-69-pan,-69,W+196,H+128);
   ctx.restore();
  }
 }
 function cutLine(t,face){
  const points=fissure(W,H,face),show=ease((t-181)/5)*(1-ease((t-222)/23));
  if(show<=0)return;
  const split=ease((t-194)/20);
  ctx.save();ctx.globalAlpha=show;ctx.globalCompositeOperation='screen';
  for(const [color,width] of [['#29ffc2',30*(1-split*.75)],['#a5ffe7',9],['#fffbea',2.5]]){
   ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(...points[0]);
   for(const point of points.slice(1))ctx.lineTo(...point);
   ctx.stroke();
  }
  ctx.restore();
 }
 function shards(t,face){
  const age=t-194,alpha=unit(1-age/52);if(age<0||!alpha)return;
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let n=0;n<66;n++){
   const at=n/65,x=W*at,y=H*(.74-.48*(face===1?at:1-at)),r=2+n%7;
   const sign=n%2?1:-1,v=2.4+(n%13)*.34;
   ctx.save();ctx.translate(x+Math.cos(n*17)*age*3,y+sign*(13+age*v));ctx.rotate(n+age*.05);
   ctx.globalAlpha=alpha*(.5+(n%7)*.08);ctx.fillStyle=n%5?'#9bfce2':'#ffdf94';
   ctx.beginPath();ctx.moveTo(-r*2,0);ctx.lineTo(r,-r*.8);ctx.lineTo(r*.55,r);ctx.closePath();ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  if(t>=30)return;
  const s=1+time*.0009,alpha=ease(t/5)*(1-ease((t-24)/6));
  ctx.save();ctx.beginPath();ctx.moveTo(0,94);ctx.lineTo(W,55);ctx.lineTo(W,690);ctx.lineTo(0,755);ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,alpha);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=RexLimitProfile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,index]=camera(shots,t);
  const impact=t>=182?unit(1-(t-182)/13):0;
  const charge=ease((t-51)/81)*(1-ease((t-174)/12));
  const finale=ease((t-190)/14)*(1-ease((t-223)/26));
  frameClip();ctx.fillStyle='#041a1e';ctx.fillRect(0,0,W,H);
  art.image('court',-69-t*.19,-69,W+196,H+128);
  splitFuture(t,face,t*.19);
  world(cx,cy,zoom,roll,face,t,Math.max(impact,finale*.55));
  floor(t,charge);
  conduits(t,x+59,y-218,charge*.8);
  art.effect(0,705,232,280+charge*260,230+charge*180,charge*.86);
  if(t>=43&&t<206){
   const pneuma=ease((t-43)/21)*(1-ease((t-187)/19));
   art.grid('pneuma',t<76?0:t<116?1:2,3,1,x-181,y-30-Math.sin(t*.055)*18,345,{alpha:pneuma});
  }
  const blade=ease((t-100)/59)*(1-ease((t-176)/8));
  art.effect(1,x+mix(77,363,blade),y-mix(213,300,blade),90+blade*1100,57+blade*255,blade,-.50);
  target(opponent,tx,ty,t>=194?-.24-ease((t-194)/21)*.95:-.08+impact*.55);
  art.grid('poses',index,3,2,x,y,340);
  if(t>=175&&t<219){
   const slash=ease((t-175)/7)*(1-ease((t-190)/29));
   art.effect(2,854,455,1610+slash*180,582,slash*.87,-.12);
   art.effect(1,1055,546,1110,265,impact,-.33);
  }
  art.effect(3,1005,553,680+finale*610,440+finale*270,finale);
  ctx.restore();
  cutLine(t,face);shards(t,face);
  flash('206,255,238',impact*.28+finale*.15);
  bands(t,'#041216');cutin(t,time);
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/RexLimitProfile.contactHold;
  art.effect(0,x,y,138+74*p,118+32*p,1-p*.65,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const EdeaLimitVFX=(()=>{
 const {assets,ease,unit,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('edea',['cutin','court','poses','crystal','effects']);
 const shots=[
  [0,475,650,876,622,686,451,1.17,-.026,0],
  [38,503,648,884,624,701,461,1.26,.017,0],
  [71,511,647,900,620,699,456,1.13,-.038,0],
  [89,689,641,915,598,775,453,1.16,.068,1],
  [106,766,614,932,545,821,435,1.22,-.067,2],
  [117,1107,612,940,545,939,428,1.04,.081,3],
  [130,1056,564,931,572,933,428,1.05,.049,3],
  [146,899,458,944,605,896,402,.94,-.092,4],
  [162,817,530,957,610,864,437,1.16,-.041,4],
  [179,857,606,967,612,909,444,1.22,.065,1],
  [189,937,633,1011,596,968,448,1.29,-.058,3],
  [207,970,647,1256,434,997,440,1.02,.021,5],
  [238,970,650,1553,267,1012,447,.95,0,5]
 ];
 const cuts=[
  {at:85,duration:19,cell:1,angle:.07,face:1,y:-113,w:694,h:244},
  {at:102,duration:21,cell:2,angle:-1.03,face:1,y:-119,w:586,h:276},
  {at:144,duration:20,cell:1,angle:.60,face:-1,y:-113,w:740,h:316},
  {at:178,duration:39,cell:3,angle:-.11,face:1,y:-97,w:1220,h:485}
 ];
 function drawFighter(index,x,y,face,alpha=1){
  art.grid('poses',index,3,2,x,y,350,{face,alpha});
 }
 function reserve(t,x,y){
  const costs=[87,105,146];
  for(const [i,at] of [46,57,68].entries()){
   const value=ease((t-at)/8)*(1-ease((t-costs[i])/9));
   if(!value)continue;
   const px=x-70+i*70,py=y-316+Math.sin(t*.095+i*1.5)*11,s=57+10*value;
   ctx.save();ctx.translate(px,py);ctx.rotate((t-at)*.021);
   art.image('crystal',-s/2,-s/2,s,s,value);ctx.restore();
  }
 }
 function trail(t){
  if(t<82||t>=189)return;
  const strongest=Math.max(...cuts.map(({at,duration})=>unit(1-Math.abs(t-at-4)/duration)));
  for(let n=3;n>0;n--){
   const older=t-n*3,[x,y,,,,,,,pose]=camera(shots,older);
   drawFighter(pose,x,y,older>=116&&older<157?-1:1,strongest*(.20-n*.035));
  }
 }
 function cutin(t,time){
  if(t>=30)return;
  const s=1+time*.00095,alpha=ease(t/5)*(1-ease((t-23)/7));
  ctx.save();ctx.beginPath();ctx.moveTo(0,108);ctx.lineTo(W,56);ctx.lineTo(W,681);ctx.lineTo(0,748);ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,alpha);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=EdeaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const beat=Math.max(...cuts.map(({at,duration})=>t>=at?unit(1-(t-at)/duration):0));
  const guard=ease((t-31)/14)*(1-ease((t-78)/12));
  const final=ease((t-178)/8)*(1-ease((t-191)/24));
  frameClip();ctx.fillStyle='#1b253b';ctx.fillRect(0,0,W,H);
  const pan=ease((t-82)/112);
  art.image('court',-120-pan*88,-86+Math.sin(pan*Math.PI)*35,W+345,H+162);
  world(cx,cy,z,roll,face,t,beat*.7);
  trail(t);
  target(opponent,tx,ty,-.12+beat*.54-ease((t-188)/26)*1.08);
  drawFighter(index,x,y,t>=116&&t<157?-1:1);
  art.effect(0,x+95,y-166,340,362,guard*.72,-.08);
  reserve(t,x,y);
  for(const {at,duration,cell,angle,face:direction,y:height,w,h} of cuts){
   const strength=ease((t-at)/6)*(1-ease((t-at-7)/(duration-7)));
   art.effect(cell,cell===3?994:tx-31,cell===3?487:ty+height,w,h,strength*(cell===3?.76:.9),angle,direction);
  }
  art.effect(1,1067,545,1160,292,final*.74,.15);
  ctx.restore();flash('255,225,197',beat*.12+final*.12);
  bands(t,'#131824');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/EdeaLimitProfile.contactHold;
  art.effect(1,x,y,156+52*p,97,1-p*.61,-.10,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

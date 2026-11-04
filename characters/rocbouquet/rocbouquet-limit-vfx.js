'use strict';
const RocbouquetLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('rocbouquet',['cutin','court','poses','feathers','effects']);
 const shots=[
  [0,492,645,948,621,716,453,1.10,-.028,0],
  [35,505,626,936,618,718,436,1.22,.037,1],
  [57,514,598,920,603,710,421,1.14,-.038,1],
  [79,515,601,879,591,687,424,1.11,.032,2],
  [101,496,564,842,578,680,401,1.05,.057,2],
  [123,519,495,857,567,681,392,.94,-.058,3],
  [143,581,480,873,584,698,389,.96,-.051,3],
  [161,620,486,891,599,727,401,1.04,.036,3],
  [181,651,554,904,606,777,438,1.15,-.075,4],
  [190,669,590,908,601,805,442,1.26,.065,4],
  [207,660,619,1121,494,820,447,1.01,.053,5],
  [229,641,631,1337,381,872,452,.89,-.028,5],
  [252,640,632,1510,251,896,458,.87,0,5]
 ];
 function wing(index,x,y,alpha=1){
  art.grid('poses',index,3,2,x,y,418,{alpha});
 }
 function reflection(index,x,y){
  const floor=651;
  ctx.save();ctx.beginPath();ctx.rect(-150,floor,W+500,275);ctx.clip();
  ctx.translate(0,floor*1.57);ctx.scale(1,-.57);
  wing(index,x,y,.15);ctx.restore();
 }
 function current(t,x,y,weight){
  if(weight<=0)return;
  ctx.save();ctx.translate(x,y);
  const rings=[0,13,27,40];
  for(const offset of rings){
   const phase=((t+offset)%53)/53,r=36+phase*337;
   ctx.globalAlpha=weight*(1-phase)*.54;ctx.strokeStyle='#c5aaff';ctx.lineWidth=2;
   ctx.beginPath();ctx.ellipse(0,0,r,r*.24,0,0,TAU);ctx.stroke();
  }
  ctx.restore();
 }
 function weave(t,x,y,tx,ty,weight){
  if(weight<=0)return;
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let n=0;n<5;n++){
   const a=t*.092+n*TAU/5,offset=Math.sin(a)*100;
   ctx.globalAlpha=weight*(.56+n*.08);ctx.strokeStyle=n%2?'#ff91da':'#9757eb';ctx.lineWidth=n===2?5:2;
   ctx.beginPath();ctx.moveTo(x,y);
   ctx.bezierCurveTo(x+(tx-x)*.33,y-100+offset,tx-160,ty+offset,tx,ty);
   ctx.stroke();
  }
  ctx.restore();
 }
 function feathers(t,x,y,power){
  if(power<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(t*.045);
  const size=350+power*230;
  art.image('feathers',-size/2,-size/2,size,size,power*.89);
  ctx.restore();
 }
 function lightning(t,tx,ty,power){
  if(power<=0)return;
  const bolts=[[-234,-.28,150],[167,.24,160],[0,.015,231]];
  for(let i=0;i<bolts.length;i++){
   const [offset,angle,width]=bolts[i],delay=i===2?0:i+3;
   const strength=power*ease((t-183-delay)/5)*(i===2?1:.61);
   art.effect(1,tx+offset,ty-329,width+strength*112,710,strength,angle);
  }
 }
 function cutin(t,time){
  if(t>=31)return;
  const a=ease(t/5)*(1-ease((t-24)/7)),s=1+time*.0009;
  ctx.save();ctx.beginPath();ctx.moveTo(0,101);ctx.lineTo(W,55);ctx.lineTo(W,684);ctx.lineTo(0,752);ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,a);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=RocbouquetLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const pull=ease((t-46)/27)*(1-ease((t-107)/26));
  const storm=ease((t-108)/46)*(1-ease((t-188)/14));
  const shock=ease((t-184)/8)*(1-ease((t-195)/31));
  const hit=t>=188?unit(1-(t-188)/13):0;
  frameClip();ctx.fillStyle='#111222';ctx.fillRect(0,0,W,H);
  art.image('court',-92-t*.19,-76,W+254,H+128);
  world(cx,cy,z,roll,face,t,Math.max(shock*.75,hit));
  reflection(index,x,y);
  current(t,tx,655,pull*.62+shock*.38);
  art.effect(2,tx,ty-190,530+storm*324,419+storm*235,storm*.80,-t*.023);
  feathers(t,tx,ty-185,storm*.91);
  target(opponent,tx,ty,-.06-pull*.23+hit*.64-ease((t-197)/25)*.89);
  wing(index,x,y);
  weave(t,x+106,y-186,tx,ty-141,pull*.84);
  art.effect(0,tx,ty-130,270+pull*183,251+pull*143,pull*.81);
  lightning(t,908,615,shock);
  art.effect(3,909,599,755+shock*378,347+shock*177,shock*.88);
  ctx.restore();flash('226,201,255',hit*.27+shock*.11);
  bands(t,'#0f1020');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/RocbouquetLimitProfile.contactHold;
  art.effect(0,x,y,138+42*p,110,1-p*.57,-.10,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

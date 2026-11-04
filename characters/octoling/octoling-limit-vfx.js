'use strict';
const OctolingLimitVFX=(()=>{
 const {assets,unit,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('octoling',['cutin','court','poses','drone','effects']);
 const shots=[
  [0,520,649,853,621,705,449,1.19,-.03,0],
  [45,544,646,932,621,762,443,1.09,.029,0],
  [69,633,635,996,602,799,417,1.07,-.064,1],
  [102,580,615,1012,612,775,386,1.03,.047,2],
  [136,554,646,1029,619,771,387,.94,-.05,3],
  [160,608,628,1059,592,808,401,1.03,.046,3],
  [180,606,531,1059,569,825,404,1.08,-.041,4],
  [194,600,575,1088,572,848,415,1.01,.031,4],
  [217,574,642,1396,387,890,442,.95,-.021,5],
  [246,584,644,1578,207,908,453,.94,.013,5],
  [265,589,646,1725,187,911,458,.94,0,5]
 ];
 const droneShots=[
  [0,454,360,116,0],[62,491,324,128,1],[102,530,251,147,0],
  [135,592,226,156,1],[157,683,296,170,2],[177,690,323,183,2],
  [196,692,356,168,3],[223,504,313,131,0],[265,517,331,126,0]
 ];
 const colors=['#f9008e','#19d6e0','#cbe744','#ffbd33','#9b57ff'];
 function chips(t,x,y){
  for(let i=0;i<5;i++){
   const p=ease((t-77-i*6)/24);if(p<=0||t>=136)continue;
   const a=i*TAU/5+t*.04,r=224*(1-p)+25;
   ctx.save();ctx.translate(x+Math.cos(a)*r,y+Math.sin(a)*r*.77);
   ctx.rotate(a);ctx.globalAlpha*=ease(p*4)*(1-ease((t-112-i*3)/12));
   ctx.strokeStyle='#fff';ctx.fillStyle=colors[i];ctx.lineWidth=3;ctx.beginPath();
   for(let n=0;n<6;n++){
    const angle=n*TAU/6;ctx.lineTo(Math.cos(angle)*23,Math.sin(angle)*23);
   }
   ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
  }
 }
 function floorInk(t){
  ctx.save();
  for(let i=0;i<29;i++){
   const time=i<11?46+i*5:189+(i-11)*1.7,p=ease((t-time)/13);
   if(!p)continue;
   const x=400+i*33,y=616+(i*17%60),size=(26+i%7*9)*p;
   ctx.save();ctx.translate(x,y);ctx.rotate((i%5-2)*.075);
   ctx.fillStyle=colors[i<11?0:(i-11)%5];ctx.globalAlpha=.89;
   ctx.beginPath();ctx.ellipse(0,0,size*1.73,size*.29,0,0,TAU);ctx.fill();
   ctx.beginPath();ctx.ellipse(size*1.7,-size*.30,size*.43,size*.11,0,0,TAU);ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=OctolingLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const [dx,dy,ds,di]=camera(droneShots,t),beat=ease((t-151)/9)*(1-ease((t-180)/9));
  const blast=ease((t-188)/6)*(1-ease((t-205)/34));
  frameClip();ctx.fillStyle='#29313d';ctx.fillRect(0,0,W,H);
  art.image('court',-121-t*.23,-90,W+310,H+150);
  world(cx,cy,z,roll,face,t,Math.max(beat*.38,blast));
  floorInk(t);
  target(opponent,tx,ty,-.09+Math.sin(t*.15)*beat*.19-ease((t-194)/35)*1.50);
  art.grid('poses',index,3,2,x,y,312);
  art.grid('drone',di,2,2,dx,dy,ds,{anchorY:.5});
  chips(t,dx,dy);
  for(const [at,offset] of [[43,12],[53,-18],[63,28],[172,13],[178,-12],[184,22]]){
   const age=t-at;if(age<0||age>15)continue;
   const p=unit(age/15),muzzleX=x+138,muzzleY=y-139;
   art.strike(0,mix(muzzleX,tx+42,p),mix(muzzleY,ty-101+offset,p),318+119*p,115,1-ease((age-10)/5),-.06+offset*.006);
  }
  const targetY=ty-116,aim=Math.atan2(targetY-dy,tx-dx),length=Math.hypot(tx-dx,targetY-dy);
  art.strike(1,dx+Math.cos(aim)*length*.57,dy+Math.sin(aim)*length*.57,length*1.29,177+beat*69,beat*.97,aim);
  art.strike(2,1052,499,342+blast*413,339+blast*212,blast*.88);
  art.strike(3,1092,546,498+blast*693,305+blast*286,blast*.94);
  ctx.restore();flash('253,156,226',blast*.21);bands(t,'#1c1129');
  const opacity=ease(t/4)*(1-ease((t-25)/8));
  if(opacity){
   ctx.save();ctx.beginPath();ctx.moveTo(0,156);ctx.lineTo(W,83);ctx.lineTo(W,652);ctx.lineTo(0,729);ctx.closePath();ctx.clip();
   art.portrait(1.02+time*.0011,opacity);ctx.restore();
  }
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,152+time*5,95,1-time/OctolingLimitProfile.contactHold*.61,.12,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

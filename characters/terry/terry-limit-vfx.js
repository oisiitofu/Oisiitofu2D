'use strict';
const TerryLimitVFX=(()=>{
 const {assets,ease,unit,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('terry',['cutin','poses','court','effects','boss'],{blackMatte:true});
 // Time, Terry, opponent, camera center, lens, roll, and Terry pose.
 const shots=[
  [0,463,639,843,629,673,482,1.12,-.03,0],
  [27,572,639,839,622,711,478,1.18,-.018,4],
  [42,559,641,852,632,701,477,1.10,.02,1],
  [66,575,642,858,630,712,455,1.06,-.025,2],
  [85,575,641,879,602,727,440,1.08,.065,3],
  [105,497,644,868,628,732,421,.91,-.027,3],
  [130,459,641,889,625,755,411,.84,-.008,2],
  [156,491,643,932,593,782,418,.93,.052,3],
  [172,498,646,940,621,775,453,.95,-.032,3],
  [191,505,646,940,628,783,467,1.02,-.045,3],
  [201,525,645,974,597,811,461,1.13,.07,5],
  [219,533,643,1162,432,852,447,.91,-.024,5],
  [243,533,642,1380,310,873,436,.85,0,0]
 ];
 function boy(index,x,y,alpha=1){art.grid('poses',index,3,2,x,y,285,{alpha});}
 function crack(t,x,y,strength){
  if(strength<=0)return;
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=strength;
  for(let n=0;n<4;n++){
   ctx.strokeStyle=n===0?'#f0e1ff':'#bd78ff';ctx.lineWidth=n===0?3:1.4;
   const d=n%2?1:-1;ctx.beginPath();ctx.moveTo(x,y);
   for(let j=1;j<=8;j++){const k=(j*41+n*67+Math.floor(t/3)*13)%47;ctx.lineTo(x+j*d*(41+n*5),y+(k-23)*(.4+j*.11));}
   ctx.stroke();
  }
  ctx.restore();
 }
 function rubble(t,x,y,strength){
  ctx.save();
  for(let n=0;n<28;n++){
   const a=n*2.39996,v=(t+n*8)%29/29,dist=v*(62+(n%9)*23);
   ctx.save();ctx.translate(x+Math.cos(a)*dist,y-12-Math.sin(v*Math.PI)*(35+n%7*19));
   ctx.rotate(a+t*.09);ctx.globalAlpha=strength*(1-v*.7);
   ctx.fillStyle=n%4?'#635170':'#e0b5ff';ctx.beginPath();
   ctx.moveTo(-5-n%5,-4);ctx.lineTo(7,-6);ctx.lineTo(10,4);ctx.lineTo(-2,8);ctx.closePath();ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function summoning(t,x,y,weight){
  ctx.save();ctx.translate(x,y);ctx.scale(1,.26);ctx.rotate(t*.017);
  ctx.globalAlpha=weight;ctx.strokeStyle='#c599ff';ctx.lineWidth=3;
  for(const r of [95,117,168]){ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();}
  for(let i=0;i<8;i++){ctx.rotate(Math.PI/4);ctx.strokeRect(121,-10,28,20);}
  ctx.restore();
 }
 function cutin(t,time){
  if(t>=28)return;
  const opacity=ease(t/7)*unit((28-t)/7),s=1+time*.0013;
  ctx.save();ctx.beginPath();ctx.moveTo(0,138);ctx.lineTo(W,65);ctx.lineTo(W,647);ctx.lineTo(0,759);ctx.closePath();ctx.clip();
  art.portrait(s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=TerryLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const shock=Math.max(0,...[28,73,86,130,157,199,211].map(at=>t>=at?unit(1-(t-at)/15):0));
  frameClip();ctx.fillStyle='#100f24';ctx.fillRect(0,0,W,H);
  art.image('court',-74-t*.14,-107,W+166,H+123);
  const night=ease((t-85)/35)*(1-ease((t-217)/25));
  ctx.fillStyle='rgba(19,10,37,'+night*.42+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,shock);
  if(t>=43&&t<100){
   const field=ease((t-43)/27)*(1-ease((t-91)/9));
   summoning(t,842,640,field*.82);crack(t,842,637,field*.9);
   art.glow(0,842,630,435,139,field*.94);
   if(t>=73)art.strike(1,843,226,280,816,unit(1-(t-73)/26));
  }
  if(t>=96){
   const appears=ease((t-96)/29)*(1-ease((t-218)/24));
   const smash=ease((t-178)/22),height=460+128*smash;
   art.grid('boss',t>=186?1:0,2,1,899,520+74*smash+Math.sin(t*.14)*9,height,{alpha:appears,anchorY:.93});
   if(t<151)summoning(t,898,624,appears*.59);
  }
  target(opponent,tx,ty,shock*.38-(t>=197?.66:.12));
  boy(index,x,y);
  if(t>=25&&t<43)art.strike(2,tx-47,ty-91,277,153,unit(1-(t-25)/18));
  if(t>=153&&t<181){
   const hit=unit(1-(t-153)/28);
   art.strike(3,tx+9,ty-65,303,235,hit*.88);
   crack(t,tx,ty+15,hit*.62);
  }
  if(t>=198){
   const power=unit(1-(t-198)/42);
   art.strike(3,951,604,490+(t-198)*13,354,power);
   art.glow(0,949,626,535+(t-198)*15,165,power);
   crack(t,950,628,power);rubble(t,950,630,power);
  }
  ctx.restore();
  flash('205,171,255',shock*.18);bands(t);cutin(t,time);
  const out=ease((t-232)/12);
  if(out){ctx.fillStyle='rgba(14,8,22,'+out*.70+')';ctx.fillRect(0,0,W,H);}
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/TerryLimitProfile.contactHold;
  art.strike(2,x,y,112+52*p,74+23*p,1-p*.55,-.08,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

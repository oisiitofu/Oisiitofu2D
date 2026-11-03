'use strict';
const NierLimitVFX=(()=>{
 const {assets,unit,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('nier',['cutin','poses','court','effects','book','shadow']);
 const shots=[
  [0,480,648,831,632,680,487,1.13,-.016,0],
  [26,536,649,838,626,711,477,1.23,.018,1],
  [51,554,646,849,631,714,460,1.08,-.02,2],
  [68,550,641,847,625,700,437,1.02,.019,0],
  [82,635,520,848,604,748,424,1.16,-.075,1],
  [92,1005,533,857,554,867,431,1.08,.08,1],
  [104,1041,567,855,579,933,447,1.17,.045,2],
  [112,735,539,854,541,828,426,1.09,-.072,2],
  [123,689,494,868,577,807,419,1.14,-.035,3],
  [132,961,588,910,615,868,436,1.12,.054,4],
  [149,728,638,923,628,841,483,1.07,.012,5],
  [170,609,642,929,591,817,475,.98,.036,0],
  [188,743,475,931,618,805,433,1.03,-.054,3],
  [206,875,620,945,608,900,477,1.24,.087,4],
  [219,850,642,1099,504,907,463,1.01,-.028,5],
  [247,827,641,1350,291,922,446,.86,0,5]
 ];
 const cuts=[[91,846,444,.20,1],[110,850,464,-.14,-1],[127,885,489,.75,1],[206,925,495,.70,1]];
 function normal(index,x,y,alpha){art.grid('poses',index,3,2,x,y,285,{alpha});}
 function shadow(index,x,y,t,alpha=1){
  const face=t>=100&&t<122?-1:1;
  art.grid('shadow',index,3,2,x,y,345,{alpha,face,anchorY:.94});
 }
 function sigils(t,x,y,weight){
  if(weight<=0)return;
  ctx.save();ctx.translate(x,y);ctx.globalAlpha=weight;ctx.strokeStyle='#ed6070';ctx.lineWidth=1.65;
  for(let i=0;i<26;i++){
   const a=i*2.399963+t*.009,r=61+(i%8)*15;
   ctx.save();ctx.translate(Math.cos(a)*r,Math.sin(a)*r*.59);ctx.rotate(a);
   ctx.beginPath();ctx.moveTo(-7,6);ctx.lineTo(0,-7);ctx.lineTo(8,4);ctx.lineTo(-3,3);ctx.stroke();ctx.restore();
  }
  ctx.restore();
 }
 function spiral(t,x,y,weight){
  if(weight<=0)return;
  ctx.save();ctx.translate(x,y);ctx.scale(1,.29);ctx.rotate(t*.011);
  ctx.strokeStyle='#e65469';ctx.globalAlpha=weight;ctx.lineWidth=2.2;
  for(const r of [99,152,201]){ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();}
  for(let i=0;i<10;i++){ctx.rotate(Math.PI*.2);ctx.beginPath();ctx.moveTo(151,0);ctx.lineTo(197,15);ctx.lineTo(182,-19);ctx.closePath();ctx.stroke();}
  ctx.restore();
 }
 function cutin(t,time){
  if(t>=29)return;
  const p=ease(t/7)*unit((29-t)/6),s=1+Math.min(time,55)*.0011;
  ctx.save();ctx.beginPath();ctx.rect(0,103,W,598);ctx.clip();
  art.image('cutin',W*(1-s)*.5,H*(1-s)*.5,W*s,H*s,p);
  ctx.restore();
 }
 function dust(t,opacity){
  if(!opacity)return;
  ctx.save();ctx.fillStyle='#d9d3cf';
  for(let i=0;i<40;i++){
   ctx.globalAlpha=(i%8+2)*.018*opacity;const px=(i*163+t*(1+i%3)*.39)%W,py=(i*71+t*.44)%H;
   ctx.fillRect(px,py,1+i%4,1+i%2);
  }
  ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=NierLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const hit=cuts.findLast(v=>v[0]<=t),age=hit?t-hit[0]:100,shock=unit(1-age/14);
  frameClip();ctx.fillStyle='#151017';ctx.fillRect(0,0,W,H);
  art.image('court',-95-t*.12,-110,W+218,H+159);
  const night=ease((t-42)/29)*(1-ease((t-221)/24));
  ctx.fillStyle='rgba(18,6,18,'+night*.55+')';ctx.fillRect(0,0,W,H);
  dust(t,.55+night*.45);
  world(cx,cy,z,roll,face,t,shock);
  const changing=ease((t-48)/24),seal=ease((t-148)/15)*(1-ease((t-209)/25));
  const lift=ease((t-26)/24),leave=ease((t-73)/18);
  if(t>=25&&t<94)art.grid('book',0,1,1,x-59,y-208-lift*109,142,{alpha:lift*(1-leave),anchorY:.5});
  if(t>=35&&t<87){
   const aura=ease((t-35)/18)*(1-ease((t-74)/13));
   art.effect(2,x,y-98,368,390,aura*.82,t*.025);
   sigils(t,x,y-140,aura*.8);
  }
  if(seal){
   spiral(t,926,626,seal*.74);
   for(let i=0;i<4;i++){
    const rise=ease((t-158-i*4)/9)*(1-ease((t-207)/19));
    if(rise>0)art.effect(1,790+i*85,638-rise*147,171,321,rise*.83,(i-1.5)*.16);
   }
   if(t<178)art.effect(0,tx-58,ty-109,291,227,ease((t-149)/10)*(1-ease((t-170)/8)),.13);
  }
  target(opponent,tx,ty,-.18+shock*.48-(t>=207?.64:0));
  if(changing<1)normal(t<29?index:t<48?1:2,x,y,1-changing);
  if(changing>0){
   if(shock>.4&&t<139)shadow(index,x-(t<104?47:-46),y+9,t,.21*shock);
   shadow(index,x,y,t,changing);
  }
  if(hit&&age<17){
   const [,hx,hy,angle,direction]=hit,weight=unit(1-age/17),final=hit[0]===206;
   art.effect(3,hx,hy,final?760:498,final?285:161,weight,angle,direction);
   sigils(t,hx,hy,weight*.65);
   if(final)art.effect(2,tx,ty-97,490+age*13,390+age*9,weight*.91,angle-t*.013);
  }
  ctx.restore();
  flash('255,142,149',shock*.16);bands(t,'#070507');cutin(t,time);
  const out=ease((t-235)/13);
  if(out){ctx.fillStyle='rgba(10,5,12,'+out*.75+')';ctx.fillRect(0,0,W,H);}
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/NierLimitProfile.contactHold;
  art.effect(3,x,y,150+55*p,88+22*p,1-p*.54,-.12,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

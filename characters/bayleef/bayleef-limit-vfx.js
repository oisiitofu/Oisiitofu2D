'use strict';
const BayleefLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('bayleef',['cutin','court','poses','effects']);
 const shots=[
  [0,466,648,1000,623,720,423,1.08,-.014,0],
  [42,568,648,997,620,757,423,1.02,.015,1],
  [64,641,611,1028,611,812,405,.98,-.016,0],
  [81,700,648,1044,612,859,421,.96,.012,1],
  [106,602,650,1080,612,818,384,.90,.016,1],
  [142,477,650,1053,616,770,359,.80,-.013,2],
  [176,496,650,1098,609,797,384,.86,.023,3],
  [201,562,651,1247,496,875,405,.85,-.012,3],
  [251,532,649,1691,173,927,435,.89,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function solarBloom(x,y,t,strength){
  if(strength<=0)return;
  ctx.save();ctx.translate(x,y);
  ctx.globalAlpha=strength*.82;ctx.strokeStyle='#ffe77b';ctx.lineWidth=4;
  const radius=58+149*ease((t-116)/28);
  ctx.beginPath();ctx.ellipse(0,0,radius,radius*.43,-.22,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<16;i++){
   const angle=i*Math.PI/8+(t-115)*.065;
   const reach=radius+14+(i%4)*12;
   ctx.save();ctx.translate(Math.cos(angle)*reach,Math.sin(angle)*reach*.69);
   ctx.rotate(angle+Math.PI/4);
   ctx.fillStyle=i%3===0?'#fffbc9':'#bde950';
   ctx.fillRect(-5,-5,10,10);ctx.restore();
  }
  ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=BayleefLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const growth=pulse(t,114,139,143,165),charge=pulse(t,155,173,184,193),beam=pulse(t,183,196,201,226);
  const flinch=Math.max(...Array.from(BayleefLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#2a3020';ctx.fillRect(0,0,W,H);art.image('court',-78-t*.10,-51,W+178,H+110);
  world(cx,cy,z,roll,face,t,Math.max(beam,flinch*.47));
  solarBloom(x+28,y-175,t,Math.max(growth,charge*.7));
  art.glow(2,x+40,y-183,487+growth*181,522,Math.max(growth,charge*.53));
  art.grid('poses',pose,2,2,x,y,pose>=2?436:312,{face:pose===2?-1:1});
  target(opponent,tx+flinch*20,ty-flinch*21,-.1-flinch*.21-ease((t-196)/40)*1.42);
  for(const [start,hit,offset] of [[45,54,-31],[60,69,27]]){
   const flight=ease((t-start)/(hit-start));
   art.strike(0,mix(x+120,tx-9,flight),mix(y-140+offset,ty-95,flight),198,152,pulse(t,start,start+2,hit,hit+6),offset*.007);
  }
  for(const [start,hit,angle] of [[78,87,-.20],[97,107,.15]]){
   const reach=ease((t-start)/(hit-start)),length=225+352*reach;
   art.strike(1,x+80+length*.5,ty-118,length,163,pulse(t,start,hit,hit+3,hit+9),angle);
  }
  art.strike(2,tx,ty-100,182,171,pulse(t,172,173,177,183));
  const length=mix(219,1061,ease((t-183)/13));
  art.strike(3,x+29+length*.5,y-211,length,201+beam*171,beam,-.08);
  art.glow(2,x+22,y-162,482,471,growth*.72);
  ctx.restore();flash('255,221,115',Math.max(beam*.25,growth*.17));bands(t,'#292c20');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,146+time*5,121,1-time/BayleefLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

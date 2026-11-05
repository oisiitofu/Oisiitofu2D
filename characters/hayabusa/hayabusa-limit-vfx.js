'use strict';
const HayabusaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('hayabusa',['cutin','court','poses','effects']);
 const hits=[47,65,83,101,119,137,155,174];
 const shots=[
  [0,490,670,843,609,676,394,1.11,.014,0],
  [35,520,670,850,609,695,392,1.13,-.014,0],
  [47,611,670,870,607,749,391,1.10,.02,1],
  [65,631,653,890,450,771,362,1.10,-.018,2],
  [83,651,650,910,582,792,378,1.10,.018,1],
  [101,674,635,934,415,814,349,1.08,-.02,2],
  [119,696,628,956,557,838,364,1.09,.018,1],
  [137,719,614,979,391,860,337,1.07,-.02,2],
  [155,741,608,1001,532,882,352,1.08,.018,1],
  [174,764,602,1024,354,905,318,1.04,-.023,2],
  [195,627,685,1118,575,878,388,.89,.014,3],
  [217,627,685,1132,565,885,381,.91,-.014,3],
  [234,627,685,1140,557,889,376,.87,.022,3],
  [254,627,685,1457,327,953,377,.82,-.014,3],
  [272,627,685,1774,138,1014,378,.82,0,3]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=HayabusaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const flinch=Math.max(...Array.from(HayabusaLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const charge=pulse(t,19,35,41,48),ninpo=pulse(t,187,198,222,234),finish=pulse(t,229,234,242,262);
  frameClip();ctx.fillStyle='#101c2a';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.09,-66,W+189,H+134);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.65,finish));
  art.glow(0,x+14,y-150,330+charge*150,328+charge*150,charge*.60);
  art.glow(3,x+150,y-196,178+ninpo*160,178+ninpo*160,ninpo*.42);
  for(let n=0;n<hits.length;n++){
   const hit=hits[n],power=pulse(t,hit-5,hit,hit+1,hit+8),upper=n%2;
   // Cell 1 bulges up-left in the source; +1.05 turns its convex edge up-right.
   art.strike(upper?1:0,tx-75,ty-(upper?133:99),upper?390:391,upper?365:305,power,upper?1.05:(n%4?-.10:.10));
  }
  for(const [hit,offset] of [[207,-38],[217,31],[233,0]]){
   const travel=ease((t-hit+14)/14),ax=x+178,ay=y-196,bx=tx-12,by=ty-101+offset;
   art.strike(2,mix(ax,bx,travel)-37,mix(ay,by,travel),398,252,pulse(t,hit-14,hit-10,hit,hit+8),Math.atan2(by-ay,bx-ax));
   art.strike(3,tx-15,ty-101+offset,hit===233?780:326,hit===233?780:326,hit===233?finish:pulse(t,hit-1,hit,hit+2,hit+10));
  }
  art.grid('poses',pose,2,2,x,y,426);
  target(opponent,tx+flinch*20,ty-flinch*18,-.10-flinch*.28-ease((t-235)/28)*1.46);
  ctx.restore();flash('255,202,160',Math.max(flinch*.13,finish*.24));bands(t,'#0b101b');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,170+time*6,146,1-time/HayabusaLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

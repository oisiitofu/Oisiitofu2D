'use strict';
const KlonoaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('klonoa',['cutin','court','poses','effects','spirit']);
 const shots=[
  [0,447,646,978,628,725,425,1.09,.014,0],
  [56,503,628,1011,617,757,410,1.00,-.012,0],
  [80,539,514,1026,590,786,364,.96,.018,1],
  [106,641,468,1025,525,830,332,.89,-.019,2],
  [135,614,515,1063,460,849,316,.84,.022,2],
  [167,536,603,1122,541,835,361,.87,-.019,1],
  [192,522,645,1156,587,857,391,.86,.014,3],
  [211,563,643,1175,547,878,385,.82,-.013,3],
  [227,586,642,1422,394,978,377,.85,.016,3],
  [249,587,644,1780,213,1003,401,.89,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=KlonoaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const charge=pulse(t,166,201,207,214),finish=pulse(t,204,212,218,240);
  const flinch=Math.max(...Array.from(KlonoaLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+8)));
  const capture=pulse(t,82,91,115,128);
  frameClip();ctx.fillStyle='#172448';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.14,-54,W+181,H+113);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.46,finish));
  art.glow(1,tx,ty-82,370+capture*111,260+capture*87,capture*.67,t*.032);
  target(opponent,tx+flinch*26,ty-flinch*22,-.12-flinch*.25-capture*.3-ease((t-214)/30)*1.41);
  art.grid('poses',pose,2,2,x,y,294);
  art.grid('spirit',0,1,1,x+116+19*Math.sin(t*.082),y-202+20*Math.cos(t*.08),136,{alpha:pulse(t,33,55,218,242)});
  for(const hit of [48,65,91,115,142,162]){
   const flight=ease((t-hit+12)/12),strength=pulse(t,hit-12,hit-6,hit+2,hit+9);
   const effect=hit<80?0:hit<130?1:2;
   art.strike(effect,mix(x+133,tx-27,flight),mix(y-146,ty-102,flight),185+effect*92,135+effect*67,strength,effect===1?t*.047:-.12);
  }
  const mx=x+133,my=y-148,dx=tx+139-mx,dy=ty-93-my;
  art.glow(1,mx,my,312+charge*199,282+charge*148,charge*.74,t*.053);
  art.strike(3,mx+dx/2,my+dy/2,Math.hypot(dx,dy)+finish*185,213+finish*281,finish,Math.atan2(dy,dx));
  ctx.restore();flash('203,255,231',Math.max(flinch*.10,finish*.22));bands(t,'#212742');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(1,x,y,146+time*5,111,1-time/KlonoaLimitProfile.contactHold*.6,.12,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

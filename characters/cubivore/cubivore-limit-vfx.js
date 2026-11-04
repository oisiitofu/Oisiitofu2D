'use strict';
const CubivoreLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('cubivore',['cutin','court','poses','effects','wedge']);
 const shots=[
  [0,431,649,998,638,720,442,1.10,-.015,0],
  [41,510,649,974,641,719,438,1.07,.021,1],
  [60,788,641,1000,632,756,435,1.04,-.026,1],
  [111,564,648,1017,632,749,411,.98,.016,0],
  [131,553,649,1017,629,742,401,.91,-.018,2],
  [156,669,449,1055,619,811,366,.83,-.033,3],
  [178,862,602,1069,601,935,432,1.00,.027,3],
  [203,745,646,1428,331,976,437,.86,.018,2],
  [236,726,649,1768,185,949,446,.87,0,0]
 ];
 const beat=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 function draw({target:opponent,face,time}){
  const t=CubivoreLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const tackle=beat(t,49,59,61,71);
  const gather=beat(t,65,105,127,145),change=beat(t,107,122,132,150);
  const claw=beat(t,155,166,174,186),blast=beat(t,173,180,186,215);
  const recoil=-.14-ease((t-177)/38)*1.46;
  frameClip();
  ctx.fillStyle='#442b26';ctx.fillRect(0,0,W,H);
  art.image('court',-63-t*.13,-55,W+169,H+111);
  world(cx,cy,z,roll,face,t,Math.max(blast,claw*.52));
  art.glow(1,x,y-101,430+change*229,381+change*214,gather*.58);
  if(t<173)art.grid('poses',pose,2,2,x,y,pose>=2?345:258);
  for(let i=0;i<3;i++){
   const arrive=71+15*i,age=t-arrive+18,p=ease(age/18);
   const cx=mix(tx-i*58,x+64,p),cy=mix(420+i*37,y-124,p)-Math.sin(p*Math.PI)*69;
   art.grid('wedge',0,1,1,cx,cy,109-p*21,{anchorY:.5,alpha:beat(t,arrive-19,arrive-12,arrive,arrive+6)});
  }
  if(t<188)target(opponent,tx,ty,recoil);
  art.strike(2,mix(x+83,tx,.65),ty-100,266,159,tackle,-.2,-1);
  art.strike(1,x+30,y-130,358+change*246,346+change*165,change*.84);
  art.strike(2,mix(x+126,1034,ease((t-155)/20)),mix(y-136,509,ease((t-155)/20)),379+claw*265,232+claw*148,claw,-.14,-1);
  art.strike(3,1062,526,458+blast*594,342+blast*224,blast);
  if(t>=173)art.grid('poses',pose,2,2,x,y,pose>=2?345:258);
  if(t>=188)target(opponent,tx,ty,recoil);
  ctx.restore();
  flash('255,197,132',Math.max(blast*.24,change*.15));bands(t,'#382324');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(2,x,y,137+time*5,122,1-time/CubivoreLimitProfile.contactHold*.59,0,-face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

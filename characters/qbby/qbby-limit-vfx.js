'use strict';
const QbbyLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('qbby',['cutin','court','poses','effects','blocks']);
 const shots=[
  [0,410,649,994,635,708,438,1.10,.016,0],
  [44,410,649,992,635,713,428,1.04,-.014,1],
  [81,426,645,998,621,728,393,.92,.018,1],
  [117,658,451,1026,624,778,376,.85,-.023,2],
  [144,793,387,1044,619,845,363,.86,.017,2],
  [168,762,612,1059,620,854,437,.97,-.026,3],
  [190,702,649,1282,370,925,433,.89,.021,3],
  [232,700,649,1731,178,921,448,.89,0,0]
 ];
 const beat=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 const chain=[[493,595],[572,595],[651,595],[651,516],[730,516],[730,437]];
 function draw({target:opponent,face,time}){
  const t=QbbyLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const gate=beat(t,88,122,165,190),wave=beat(t,144,153,167,182);
  const blast=beat(t,167,177,182,209),recoil=-.13-ease((t-174)/37)*1.5;
  frameClip();
  ctx.fillStyle='#172738';ctx.fillRect(0,0,W,H);
  art.image('court',-72-t*.12,-55,W+171,H+110);
  world(cx,cy,z,roll,face,t,Math.max(blast,wave*.49));
  art.grid('blocks',1,2,1,1061,648,496,{alpha:gate});
  const switchOn=ease((t-112)/12),switchFade=beat(t,70,84,147,174);
  ctx.save();ctx.globalAlpha*=switchFade;
  ctx.fillStyle='#1b2434';ctx.fillRect(688,411,83,19);
  ctx.fillStyle=switchOn>.5?'#85f3ff':'#496679';
  ctx.fillRect(695,411+switchOn*6,69,9);
  ctx.restore();
  for(let i=0;i<chain.length;i++){
   const [bx,by]=chain[i],age=t-(38+9*i);
   const birth=ease(age/7),fold=ease((t-127-i*2)/22),shatter=ease((t-173-i*2)/16);
   art.grid('blocks',0,2,1,mix(bx,998+i%2*75,fold),mix(by,610-Math.floor(i/2)*77,fold),
    139+birth*27,{anchorY:.5,alpha:birth*(1-shatter)});
  }
  if(t<171)art.grid('poses',pose,2,2,x,y,247);
  if(t<184)target(opponent,tx,ty,recoil);
  art.strike(2,mix(x+95,1090,ease((t-145)/25)),mix(y-105,512,ease((t-145)/25)),337+wave*312,202+wave*85,wave);
  art.strike(3,1057,509,422+blast*618,378+blast*193,blast);
  if(t>=171)art.grid('poses',pose,2,2,x,y,247);
  if(t>=184)target(opponent,tx,ty,recoil);
  ctx.restore();
  flash('160,234,255',blast*.26);bands(t,'#152230');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(2,x,y,130+time*6,120,1-time/QbbyLimitProfile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

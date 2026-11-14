"use strict";

const AruruLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=AruruLimitProfile;
 const art=assets('aruru',['cutin','court','poses','motion','pieces','effects']);
 const shots=[
  [0,333,750,1240,741,803,411,.96,0,1],
  [30,333,750,1240,741,803,411,.96,0,1],
  [52,586,750,1240,741,852,412,.94,-.011,1],
  [64,650,750,1240,741,878,410,.94,.009,2],
  [78,665,750,1235,739,883,407,.92,0,3],
  [95,646,750,1238,741,864,406,.92,0,-2],
  [114,505,596,1238,737,820,373,.86,-.014,-4],
  [136,407,665,1235,734,812,378,.88,.012,4],
  [150,378,750,1239,741,807,415,.91,0,5],
  [170,410,750,1244,741,826,414,.92,0,6],
  [187,410,750,1240,723,831,409,.92,.009,6],
  [197,419,750,1255,738,843,412,.91,0,2],
  [207,446,712,1258,724,854,399,.91,-.007,4],
  [217,456,750,1264,737,860,412,.91,0,5],
  [227,472,750,1269,723,868,410,.90,.01,3],
  [247,473,750,1280,711,900,412,.89,-.009,5],
  [260,615,681,1289,716,925,378,.88,0,7],
  [273,752,532,1300,691,965,335,.85,-.012,7],
  [287,868,508,1318,632,1045,334,.83,.017,8],
  [303,914,616,1505,477,1098,367,.79,0,8],
  [310,933,674,1629,412,1172,379,.78,0,4],
  [318,957,750,1692,365,1200,406,.76,0,5],
  [330,957,750,1813,319,1240,409,.76,0,5]
 ];
 const colors={R:0,B:1,G:2,Y:3};
 const sparkColors={R:'#ff6d88',B:'#6cd8ff',G:'#8df888',Y:'#ffe87a'};
 const cell=75,baseX=491,baseY=708;
 const tileX=column=>baseX+column*cell;
 const tileY=row=>baseY-row*cell;
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function drawPiece(piece,x,y,alpha=1,scale=1){
  art.grid('pieces',colors[piece.color],2,2,x,y,83*scale,{alpha,anchorY:.5});
 }

 function drawBoard(t){
  const alpha=ease((t-21)/21)*(1-ease((t-253)/28));
  if(alpha<=0)return;
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.fillStyle='#081827c4';
  ctx.fillRect(baseX-cell/2,tileY(5)-cell/2,cell*6,cell*6);
  ctx.lineWidth=3;ctx.strokeStyle='#80c7cc';
  ctx.strokeRect(baseX-cell/2,tileY(5)-cell/2,cell*6,cell*6);
  ctx.strokeStyle='#345b68';ctx.lineWidth=1;
  ctx.beginPath();
  for(let i=1;i<6;i++){
   const x=baseX-cell/2+i*cell,y=tileY(5)-cell/2+i*cell;
   ctx.moveTo(x,tileY(5)-cell/2);ctx.lineTo(x,baseY+cell/2);
   ctx.moveTo(baseX-cell/2,y);ctx.lineTo(tileX(5)+cell/2,y);
  }
  ctx.stroke();
  const clear=profile.clears.findLast(step=>step.time<=t);
  if(clear){
   const age=t-clear.time;
   const falling=ease((age-5)/14);
   clear.before.forEach((column,x)=>column.forEach((piece,from)=>{
    if(clear.ids.has(piece.id)){
     const pop=1-ease(age/10);
     drawPiece(piece,tileX(x),tileY(from),pop,1+ease(age/7)*.23);
     const px=tileX(x),py=tileY(from);
     art.strike(0,px,py,143,126,pop);
     ctx.save();ctx.globalAlpha*=pop;ctx.fillStyle=sparkColors[piece.color];
     for(let i=0;i<5;i++){
      const angle=i*Math.PI*.4+(piece.id%5)*.36;
      const reach=24+age*6;
      ctx.beginPath();ctx.arc(px+Math.cos(angle)*reach,py+Math.sin(angle)*reach,5,0,Math.PI*2);ctx.fill();
     }
     ctx.restore();
     return;
    }
    const to=clear.after[x].findIndex(candidate=>candidate.id===piece.id);
    drawPiece(piece,tileX(x),tileY(mix(from,to,falling)));
   }));
  }else{
   profile.initial.forEach((column,x)=>column.forEach((piece,y)=>drawPiece(piece,tileX(x),tileY(y))));
   profile.drops.forEach((drop,index)=>{
    const progress=ease((t-drop.time+41)/41);
    if(progress<=0)return;
    const center=tileX(drop.column+.5),spin=(1-progress)*(index?-1:1)*Math.PI*1.05;
    drop.pieces.forEach((piece,n)=>{
     const direction=n===0?-1:1;
     const x=center+Math.cos(spin)*direction*cell/2;
     const y=mix(-70,tileY(piece.y),progress)+Math.sin(spin)*direction*cell/2;
     drawPiece(piece,x,y);
    });
   });
  }
  ctx.restore();
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const combo=Math.max(...profile.clears.map(({time})=>pulse(t,time,3,9)));
  const finish=pulse(t,287,5,24);
  frameClip();
  ctx.fillStyle='#102b34';ctx.fillRect(0,0,W,H);
  art.image('court',-80-cx*.024,-55-cy*.038,W+213,H+108);
  ctx.save();
  const tint=ctx.createLinearGradient(0,0,W,H);
  tint.addColorStop(0,'#22245e91');tint.addColorStop(.56,'#28294f29');
  tint.addColorStop(1,'#802a6252');ctx.fillStyle=tint;ctx.fillRect(0,0,W,H);
  ctx.restore();
  world(cx,cy,zoom,roll,face,t,Math.max(combo*.37,finish));
  drawBoard(t);
  const springboard=pulse(t,260,14,9);
  drawPiece({color:'B'},620,704,springboard,2.5);
  art.strike(0,620,704,230,200,pulse(t,261,3,8));
  target(opponent,tx,ty-combo*8,-.08-combo*.31-ease((t-288)/38)*1.55,2.75);

  for(const [index,{time:hit}] of profile.clears.entries()){
   const fall=ease((t-hit+16)/16);
   const strength=pulse(t,hit,4,10);
   if(fall<=0||t>hit+12)continue;
   for(let i=0;i<=index;i++){
    const offset=(i-index/2)*68;
    const py=mix(-86-i*33,ty-145,fall),px=tx+offset,r=26+i*3;
    ctx.save();
    ctx.globalAlpha=ease((t-hit+16)/6)*(1-ease((t-hit)/8));
    ctx.fillStyle='#b9c9d6';ctx.strokeStyle='#26354d';ctx.lineWidth=4;
    ctx.beginPath();ctx.ellipse(px,py,r,r*.85,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#fff';
    for(const side of [-1,1]){
     ctx.beginPath();ctx.ellipse(px+side*r*.36,py-r*.08,r*.16,r*.25,side*.2,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
   }
   art.strike(index%2?1:2,tx,ty-143,290+index*42,258+index*31,strength);
  }
  art.glow(0,x+124,y-170,350,302,pulse(t,166,9,26)*.45);
  art.grid(pose<4?'poses':'motion',pose%4,2,2,x,y,437,{face:Math.sign(signedPose)});
  art.glow(3,x+152,y-194,445,386,pulse(t,278,19,14)*.41);
  art.strike(3,mix(x+260,tx-15,.68),ty-159,820,703,finish);
  ctx.restore();
  flash('255,240,208',Math.max(combo*.075,finish*.16));
  bands(t,'#071a26');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,178+time*5,155+time*4,1-time/profile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

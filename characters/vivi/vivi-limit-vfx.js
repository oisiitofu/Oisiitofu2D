'use strict';

const ViviLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('vivi',['cutin','effects']);
 const shots=[
  [0,430,664,1081,664,756,428,.94,0,0],
  [39,475,664,1081,664,794,421,.94,0,8],
  [48,507,664,1081,664,799,422,.96,.009,6],
  [61,516,664,1107,664,817,432,.94,0,3],
  [76,603,596,1113,612,856,388,.91,-.019,4],
  [90,651,552,1157,625,889,367,.9,.018,16],
  [105,599,638,1172,644,889,424,.92,0,13],
  [119,513,664,1151,664,832,430,.9,-.016,14],
  [132,562,664,1197,625,874,407,.9,0,11],
  [149,550,664,1215,592,859,405,.89,.016,18],
  [175,472,664,1201,650,843,384,.8,-.02,8],
  [200,503,664,1226,648,875,369,.76,0,18],
  [211,503,664,1301,628,915,379,.78,.017,18],
  [241,503,664,1675,375,1070,394,.76,0,0]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function draw({attacker,target:opponent,face,time}){
  const t=ViviLimitProfile.shotTime(time);
  const [x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[54,71,90,110,129,149];
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,3,10)));
  const finish=pulse(t,207,4,25);
  frameClip();
  const sky=ctx.createRadialGradient(W*.58,H*.4,10,W*.58,H*.4,W*.66);
  sky.addColorStop(0,'#342355');sky.addColorStop(.56,'#181831');sky.addColorStop(1,'#080d1e');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#deb8ff';
  for(let i=0;i<65;i++){
   const px=((i*269+t*(i%3-1)*.7)%W+W)%W,py=(i*83)%H;
   ctx.globalAlpha=.17+(i%6)*.1;ctx.fillRect(px,py,i%7===0?5:2,i%7===0?5:2);
  }
  ctx.globalAlpha=1;
  for(let i=0;i<5;i++){
   const x=W*.08+i*W*.22-(cx-730)*.12;
   ctx.strokeStyle=i%2===0?'#44335d':'#34294b';ctx.lineWidth=20;
   ctx.beginPath();ctx.moveTo(x,H*.83);ctx.lineTo(x,H*.46);
   ctx.quadraticCurveTo(x+12,H*.29,x+135,H*.21);
   ctx.quadraticCurveTo(x+258,H*.29,x+270,H*.46);
   ctx.lineTo(x+270,H*.83);ctx.stroke();
  }
  world(cx,cy,z,roll,face,t,Math.max(impact*.54,finish));
  ctx.fillStyle='#1c1c3b';ctx.fillRect(-2000,666,6000,650);
  ctx.strokeStyle='#7664bd';ctx.lineWidth=3;
  for(const [px,r] of [[x,212],[tx,230]]){
   ctx.beginPath();ctx.ellipse(px,671,r,r*.23,0,0,Math.PI*2);ctx.stroke();
   ctx.beginPath();ctx.ellipse(px,671,r+31,(r+31)*.23,0,0,Math.PI*2);ctx.stroke();
  }
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.15);
  target(opponent,tx,ty-impact*12,-.07-impact*.35-ease((t-207)/31)*1.36,2.6);
  for(const [index,hit] of hits.entries()){
   const kind=index%3,lead=kind===0?13:kind===1?5:3;
   const strength=pulse(t,hit,lead,9);
   if(strength<=0)continue;
   const progress=ease((t-hit+lead)/lead);
   if(kind===0){
    art.strike(0,mix(x+125,tx,progress),mix(y-119,ty-103,progress),254,214,strength);
   }else if(kind===1){
    art.strike(1,tx,ty-152,404,256*progress+80,strength);
   }else{
    art.strike(2,tx,ty-347,309,680,strength);
   }
  }
  const fall=ease((t-181)/26),meteor=310+395*fall;
  art.strike(3,tx+mix(-190,0,fall),mix(-60,ty-106,fall),meteor,meteor,pulse(t,207,25,18));
  ctx.save();
  const burst=ease((t-206)/4)*(1-ease((t-211)/20));
  ctx.globalAlpha=burst*.82;ctx.fillStyle='#d4a5ff';
  for(let i=0;i<17;i++){
   const angle=i*2.4,distance=76+ease((t-209)/21)*(120+i%5*38);
   const px=tx+Math.cos(angle)*distance,py=ty-103+Math.sin(angle)*distance;
   ctx.beginPath();ctx.arc(px,py,6+i%3,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=finish*.9;ctx.strokeStyle='#e4b8ff';ctx.lineWidth=7;
  const wave=125+630*ease((t-207)/21);
  ctx.beginPath();ctx.ellipse(tx,ty-75,wave,wave*.3,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  ctx.restore();
  flash('182,139,255',Math.max(impact*.13,finish*.2));bands(t,'#0a0b19');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-16)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,139+time*5,138,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

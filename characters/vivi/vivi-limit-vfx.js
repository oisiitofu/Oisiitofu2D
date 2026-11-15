'use strict';

const ViviLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('vivi',['cutin','effects','court'],{revision:2});
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
  const width=W+262,height=width*9/16;
  art.image('court',-(width-W)*.5-(cx-864)*.09,-75-(cy-410)*.09,width,height);
  world(cx,cy,z,roll,face,t,Math.max(impact*.54,finish));
  if(finish>0){
   art.glow(3,tx,ty-52,638,212,finish*.49);
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
  const collapse=ease((t-209)/14),fallStrength=pulse(t,207,25,19);
  art.strike(3,tx+mix(-190,0,fall),mix(-60,ty-106,fall),meteor+190*collapse,meteor-232*collapse,fallStrength,t*.013);
  art.strike(2,tx,ty-222,344+326*collapse,522,pulse(t,211,4,18),-.18);
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

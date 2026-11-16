'use strict';

const ViviLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('vivi',['cutin','effects','court','finish'],{revision:3});
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
  [197,503,664,1226,648,888,323,.71,-.01,18],
  [207,503,664,1263,641,931,379,.87,.022,18],
  [216,503,664,1361,554,968,370,.74,.016,18],
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
  ctx.fillStyle='rgba(7,4,25,'+(pulse(t,198,16,33)*.47)+')';
  ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.54,finish));
  const impactX=1245,ground=664;
  const finishArt=(slot,x,y,w,h,strength,angle)=>art.strike(slot,x,y,w,h,strength,angle,1,'finish');
  const tear=pulse(t,184,17,23);
  finishArt(0,impactX-176,122,690,524,tear,.045);
  const shock=pulse(t,210,4,29),spread=ease((t-207)/24);
  art.glow(3,impactX,ground-48,758,221,finish*.46);
  finishArt(3,impactX,ground-13,mix(438,1350,spread),mix(326,560,spread),shock*.87,.025);
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
  const fall=Math.pow(LimitCinematic.unit((t-184)/23),1.7);
  finishArt(1,mix(impactX-130,impactX-58,fall),mix(-171,ground-345,fall),
   572,749,pulse(t,207,21,5),-.17);
  const pillar=pulse(t,208,2,19),rise=ease((t-206)/10);
  const pillarHeight=mix(512,848,rise);
  finishArt(2,impactX,ground-pillarHeight*.34,mix(530,814,rise),pillarHeight,pillar,-.021);
  ctx.restore();
  flash('182,139,255',Math.max(impact*.13,finish*.2));bands(t,'#0a0b19');
  portraitPanel(t,26,art.portrait);
  ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,139+time*5,138,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';

const HornetLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('hornet',['cutin','effects','court','finish'],{revision:3});
 const shots=[
  [0,400,677,1065,670,747,437,.94,0,1],[32,548,649,1065,670,811,400,.92,-.03,43],
  [46,873,667,1065,654,979,440,.98,.023,41],[62,1020,739,1117,641,1068,456,.95,.03,4],
  [80,1269,572,1102,601,1191,389,.9,-.04,-16],[99,1158,366,1118,593,1136,320,.87,.033,-17],
  [117,868,453,1098,549,985,337,.91,-.028,13],[137,900,587,1127,535,1009,368,.95,.016,10],
  [158,960,492,1130,521,1040,332,.87,0,45],[178,978,450,1145,517,1070,331,1.07,-.022,45],
  [182,1074,435,1188,495,1112,326,1.11,.023,46],[194,1122,569,1390,390,1234,389,.9,.014,5],
  [209,1048,665,1590,312,1253,408,.79,-.009,5],[215,1048,677,1810,147,1355,406,.75,0,1]
 ];
 const anchors=[[582,105],[1320,105],[1047,52]];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 const silk=(slot,x,y,w,h,strength,angle=0,face=1)=>art.strike(slot,x,y,w,h,strength,angle,face,'finish');
 function thread(x1,y1,x2,y2,alpha){
  const dx=x2-x1,dy=y2-y1;
  silk(0,(x1+x2)*.5,(y1+y2)*.5,Math.hypot(dx,dy)*1.07,248,alpha,Math.atan2(dy,dx));
 }

 function draw({attacker,target:opponent,face,time}){
  const t=HornetLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[46,62,80,99,117,137];
  const hitStrength=Math.max(...hits.map(hit=>pulse(t,hit,4,8)));
  const storm=pulse(t,182,7,25);
  frameClip();
  const width=W+290,height=width*9/16;
  art.image('court',-(width-W)*.5-(cx-1000)*.08,-78-(cy-408)*.09,width,height);
  ctx.fillStyle='rgba(16,9,24,'+(pulse(t,176,13,34)*.47)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(storm,hitStrength*.7));
  const tether=ease((t-26)/10)*(1-ease((t-136)/14));
  const [ax,ay]=anchors[t<69?0:t<111?1:2];
  thread(x,y-112,ax,ay,tether*.56);
  const hold=pulse(t,175,14,8),needleX=x+70,needleY=y-78;
  for(const [i,[anchorX,anchorY]] of anchors.entries()){
   thread(needleX,needleY,anchorX,anchorY,hold*pulse(t,175,15-i*4,12)*.67);
  }
  silk(1,1058,362,771,588,pulse(t,181,11,8)*.86,-.15);
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.1);
  target(opponent,tx,ty-hitStrength*10,-.14-hitStrength*.4-ease((t-186)/25)*1.42,2.65);
  for(const [i,hit] of hits.entries()){
   const angle=[.07,-.26,-1.1,1,.71,-.64][i],strength=pulse(t,hit,5,10);
   art.strike(i%3,tx-10,ty-99,447+20*i,268,strength,angle);
   silk(0,tx-12,ty-101,475,207,strength*.67,angle,i===2||i===3?-1:1);
  }
  const release=ease((t-182)/22);
  silk(2,mix(1290,1468,release),mix(350,230,release),mix(598,927,release),mix(595,760,release),pulse(t,182,2,13),-.35);
  silk(3,mix(1160,1315,release),300,mix(530,940,release),mix(443,725,release),pulse(t,190,7,20)*.82,-.45-release*.55);
  art.glow(1,tx,ty-111,628,432,pulse(t,182,2,12)*.40,-.29);
  ctx.restore();
  flash('255,215,173',Math.max(hitStrength*.13,storm*.18));bands(t,'#160d18');
  portraitPanel(t,29,art.portrait);ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,163+time*4,126,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

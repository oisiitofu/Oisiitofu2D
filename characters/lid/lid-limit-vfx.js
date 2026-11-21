'use strict';
const LidLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('lid',['cutin','effects','court','props']);
 const hits=[...LidLimitProfile.combo.keys()];
 const shots=[
 [0,430,677,1110,670,790,430,.94,0,0],
 [31,650,677,1110,670,875,430,.95,-.01,40],
 [47,825,670,1110,660,960,429,.98,.02,41],
 [65,1030,510,1160,620,1064,365,.9,-.03,42],
 [84,820,390,1180,610,1040,335,.82,0,39],
 [104,650,370,1145,642,1020,370,.78,.012,39],
 [124,630,415,1220,625,1035,385,.79,-.012,43],
 [144,685,450,1155,635,1040,395,.8,.01,44],
 [172,640,670,1200,670,1050,407,.82,0,39],
 [207,605,670,1200,670,1080,414,.8,-.015,47],
 [215,560,650,1200,626,1090,400,.78,.025,47],
 [237,535,670,1430,460,1185,407,.73,-.01,39],
 [270,550,670,1890,290,1330,410,.7,0,0]
 ];
 const pulse=(t,h,lead=3,tail=10)=>ease((t-h+lead)/lead)*(1-ease((t-h-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=LidLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t),impact=Math.max(...hits.map(h=>pulse(t,h))),finish=pulse(t,215,2,30);
  frameClip();const w=W+270,h=w*9/16;art.image('court',-(w-W)/2-(cx-1000)*.08,H*.51+(677-cy)*z-h*.78,w,h);
  ctx.fillStyle='rgba(18,31,55,'+pulse(t,211,23,45)*.34+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.35,finish*.8));
  // One ship crosses behind both characters; its nose faces its travel direction.
  const arrival=ease((t-76)/34),departure=ease((t-226)/35);
  if(t>=76)art.grid('props',1,2,1,mix(450,1210,arrival)+departure*750,220-departure*150,920,{anchorY:.5,face:-1,alpha:arrival*(1-departure)});
  for(const [n,hit]of hits.entries()){
   const power=pulse(t,hit);if(n<2)art.strike(0,tx,ty-110,350,260,power,n?.25:0);
   else{const pointX=[0,0,1140,1250,1080,1225][n],pointY=570;const progress=ease((t-hit+12)/12),sx=pointX+(n%2?190:-220),sy=170;
    if(t>hit-13&&t<hit+4){const dx=pointX-sx,dy=pointY-sy;art.strike(1,mix(sx,pointX,progress),mix(sy,pointY,progress),250,96,pulse(t,hit-5,8,8),Math.atan2(dy,dx));}
    art.strike(2,pointX,575,360,300,power*.9);}
  }
  const bloom=ease((t-215)/17);
  art.strike(2,1245,506,mix(330,750,bloom),mix(300,610,bloom),finish);
  art.strike(2,1020,565,420,360,pulse(t,222,3,24)*.85,-.15);
  art.strike(3,1175,650,1040,260,pulse(t,218,3,29));
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.05);
  // Victim stays in front of smoke so the sequence remains readable.
  target(opponent,tx,ty-impact*12,-.1-impact*.22-ease((t-215)/36)*1.1,2.45);
  ctx.restore();flash('255,212,144',Math.max(impact*.1,finish*.17));bands(t,'#111b2d');portraitPanel(t,-25,art.portrait);ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,160+time*3,140,1-time/23);}
 return{load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

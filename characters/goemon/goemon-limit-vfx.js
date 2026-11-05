'use strict';
const GoemonLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('goemon',['cutin','court','poses','robot','effects']);
 const shots=[
  [0,520,650,850,606,702,394,1.10,.014,0],
  [38,620,650,861,602,745,392,1.12,-.016,0],
  [45,660,650,899,574,779,389,1.10,.02,1],
  [63,510,694,850,480,710,365,.88,-.014,2],
  [73,555,694,863,471,730,362,.90,.018,2],
  [99,585,694,891,467,754,359,.93,-.018,2],
  [125,617,694,920,462,782,354,.94,.018,2],
  [149,648,694,951,456,810,351,.95,-.018,2],
  [161,672,694,972,451,827,348,.96,.02,2],
  [181,690,694,888,280,799,336,.90,-.025,2],
  [204,674,694,1008,435,830,333,.83,.014,3],
  [229,674,694,1083,444,878,332,.88,-.016,3],
  [249,674,694,1360,218,936,333,.78,.01,3],
  [266,674,694,1660,130,985,338,.78,0,3]
 ];
 const punches=[72,88,100,112,124,136,148,160];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=GoemonLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const flinch=Math.max(...Array.from(GoemonLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  const finish=pulse(t,224,229,237,258),charge=pulse(t,198,215,224,230);
  frameClip();ctx.fillStyle='#081629';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.1,-66,W+189,H+134);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.65,finish));
  if(t<60){
   art.grid('poses',pose,2,2,x,y,337);
   art.strike(0,tx-69,ty-106,332,245,pulse(t,39,44,46,54));
   art.strike(2,tx-30,ty-109,199,172,pulse(t,43,44,47,54));
  }else{
   const robotHeight=660;
   const punch=punches.find(hit=>t>=hit-5&&t<=hit+4);
   const robotPose=t>=197?3:t>=174?2:punch?1:0;
   const enter=ease((t-57)/8);
   art.grid('robot',robotPose,2,2,x,y+35*(1-enter),robotHeight,{alpha:enter});
   for(const hit of punches){
    const power=pulse(t,hit-5,hit,hit+1,hit+7);
    art.strike(1,tx-122,ty-110,390,185,power,(hit%3-1)*.07);
    art.strike(2,tx-31,ty-110,224,190,power);
   }
   art.strike(0,tx-43,ty-100,359,320,pulse(t,175,181,183,193),-.9);
   art.strike(2,tx-22,ty-101,282,241,pulse(t,180,181,185,195));
   // Origin is the open mouth of robot cell 3, never the chest or hands.
   const mouthX=x+72,mouthY=y-356;
   art.glow(2,mouthX,mouthY,100+charge*142,86+charge*132,charge*.62);
   const endX=tx+42,beamWidth=Math.max(200,endX-mouthX);
   art.strike(3,mouthX+beamWidth*.5,mouthY,beamWidth+32,370+finish*120,finish);
   art.strike(2,tx-10,ty-100,325+finish*118,280+finish*86,finish);
   // Keep pilot command and victim readable above the dense attack layer.
   art.grid('poses',t<190?2:3,2,2,x-260,y+7,199);
  }
  target(opponent,tx+flinch*19,ty-flinch*20,-.10-flinch*.26-ease((t-230)/28)*1.42);
  ctx.restore();flash('255,214,150',Math.max(flinch*.11,finish*.22));bands(t,'#0a1126');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(2,x,y,167+time*6,127,1-time/GoemonLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

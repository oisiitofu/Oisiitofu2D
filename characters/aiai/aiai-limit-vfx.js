"use strict";

const AiAiLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=AiAiLimitProfile;
 const art=assets('aiai',['cutin','court','poses','golden','ball','props','effects']);
 const shots=[
  [0,335,467,878,710,655,431,.94,0,1],
  [30,335,467,878,710,655,431,.94,0,1],
  [45,439,525,878,710,700,421,.92,.016,1],
  [60,548,508,878,710,733,424,.90,.028,2],
  [72,631,650,872,714,771,451,.90,.022,3],
  [83,757,690,868,698,831,435,.89,.027,3],
  [99,913,558,999,577,947,372,.87,-.022,4],
  [118,1071,493,1151,469,1025,328,.83,-.022,2],
  [135,1024,391,1115,431,1010,291,.81,.011,-2],
  [161,864,385,966,441,953,298,.81,.018,-4],
  [181,972,501,1074,553,1009,369,.84,-.021,4],
  [201,1133,662,1258,664,1180,412,.87,.015,3],
  [224,1322,577,1412,597,1310,361,.87,-.023,2],
  [241,1485,523,1470,582,1400,333,.85,-.01,5],
  [261,1293,602,1177,642,1260,388,.87,.019,-6],
  [280,1092,540,1240,624,1192,380,.89,.013,-5],
  [297,1168,583,1354,612,1258,367,.85,-.019,5],
  [312,1380,550,1524,576,1450,364,.84,-.024,6],
  [323,1587,500,1692,517,1570,342,.79,-.015,7],
  [340,1760,545,1916,393,1705,350,.76,0,7],
  [365,1820,572,2145,271,1814,362,.74,0,8]
 ];
 const lowerRail=[[200,390],[335,467],[439,525],[590,620],[757,690],[863,714],[981,701],[1133,662],[1293,602],[1485,523],[1587,500],[1755,543],[1946,603]];
 const upperRail=[[600,420],[864,385],[1032,415],[1153,450],[1340,439]];
 const returnRail=[[935,476],[1092,540],[1168,583],[1293,602]];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function rail(points,high=false){
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();
  points.forEach(([x,y],index)=>index===0?ctx.moveTo(x,y+10):ctx.lineTo(x,y+10));
  ctx.lineWidth=37;ctx.strokeStyle='#073149';ctx.stroke();
  ctx.lineWidth=25;ctx.strokeStyle=high?'#498b8e':'#297b83';ctx.stroke();
  ctx.lineWidth=9;ctx.strokeStyle=high?'#a7dfc2':'#73d7cf';ctx.stroke();
  ctx.setLineDash([15,29]);ctx.lineWidth=3;ctx.strokeStyle='#eafcd5';ctx.stroke();
  ctx.restore();
 }

 function rider(t,x,y,signedPose){
  const pose=Math.abs(signedPose)-1,gold=pose>=4;
  const shell=ease((t-44)/15);
  const lean=Math.sign(signedPose)*(pose%4===2?.18:pose%4===3?-.15:.07);
  const center=y-150;
  ctx.save();ctx.translate(x,center);ctx.rotate(lean*shell);
  art.grid(gold?'golden':'poses',pose%4,2,2,0,mix(150,101,shell),278,{face:Math.sign(signedPose)});
  ctx.restore();
  ctx.save();ctx.translate(x,center);ctx.rotate((t-45)*.09);
  art.grid('ball',gold?1:0,2,1,0,0,321,{anchorY:.5,alpha:shell*.76});
  ctx.restore();
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),time=>pulse(t,time,3,9)));
  const finish=pulse(t,323,5,21);
  frameClip();
  ctx.fillStyle='#156b93';ctx.fillRect(0,0,W,H);
  art.image('court',-83-cx*.024,-65-cy*.048,W+227,H+140);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.55,finish));
  rail(upperRail,true);
  rail(returnRail,true);
  rail(lowerRail);
  art.grid('props',0,2,2,870,724,171);
  art.grid('props',0,2,2,1165,475,167,{face:-1});
  art.grid('props',0,2,2,791,405,156);
  art.grid('props',1,2,2,1471,392,191,{alpha:1-ease((t-233)/8)});
  art.grid('props',2,2,2,1605,507,438);
  art.grid('props',3,2,2,1512,518,180);
  const speed=Math.max(pulse(t,72,11,17),pulse(t,117,12,11),pulse(t,161,10,12),pulse(t,200,10,12),pulse(t,317,20,13));
  const direction=Math.sign(pose);
  art.glow(1,x-direction*163,y-149,481,345,speed*.49,-.13*direction,direction);
  art.glow(2,x,y-155,510,435,pulse(t,242,13,17)*.67);
  art.strike(3,tx+50,ty-137,845,657,finish);
  target(opponent,tx,ty-hit*8,-.14-hit*.39-ease((t-325)/27)*1.7,2.67);
  rider(t,x,y,pose);
  for(const [index,beat] of [...profile.combo.keys()].entries()){
   const strength=pulse(t,beat,3,9);
   art.strike(index===4?2:0,mix(x,tx,.57),ty-131,324+index*20,270+index*15,strength);
  }
  art.strike(2,tx-37,ty-126,337,302,pulse(t,323,3,8));
  ctx.restore();
  flash('255,237,180',Math.max(hit*.07,finish*.18));
  bands(t,'#082335');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,178+time*5,149+time*4,1-time/profile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

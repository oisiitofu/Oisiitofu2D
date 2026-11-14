"use strict";

const MegaManExeLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=MegaManExeLimitProfile;
 const art=assets('megamanexe',['cutin','court','poses','chips','finish','props','effects']);
 const sheets=['poses','chips','finish'];
 const shots=[
  [0,575,751,1161,750,866,429,.93,0,1],
  [30,575,751,1161,750,866,429,.93,0,1],
  [49,727,751,1168,727,947,420,.90,.012,3],
  [64,727,628,1235,744,983,386,.83,-.013,2],
  [78,786,628,1253,713,1017,382,.83,.015,3],
  [101,797,628,1283,749,1041,391,.82,0,4],
  [122,1042,628,1340,700,1191,379,.80,-.02,5],
  [149,1042,747,1358,741,1200,421,.82,0,5],
  [164,1182,747,1390,720,1286,427,.85,.024,6],
  [185,1131,747,1451,743,1291,425,.83,0,6],
  [207,1257,747,1486,708,1372,418,.82,-.022,7],
  [231,1257,667,1554,744,1405,390,.79,0,8],
  [252,1313,667,1612,697,1462,392,.78,.015,8],
  [286,1313,747,1660,715,1487,418,.76,-.018,9],
  [310,1358,747,1668,741,1512,430,.74,0,10],
  [334,1401,747,1709,660,1555,423,.69,.025,11],
  [357,1401,747,1983,460,1648,397,.64,0,11],
  [404,1401,747,2248,240,1801,372,.61,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,334,5,31);
  frameClip();
  ctx.fillStyle='#101d35';ctx.fillRect(0,0,W,H);
  art.image('court',-86-cx*.018,-78-cy*.036,W+234,H+165);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.48,finish));
  const panel=pulse(t,122,23,48);
  for(let index=0;index<3;index++){
   art.grid('props',0,2,2,889+index*143,690,530,{alpha:panel*(.82-index*.14)});
  }
  art.grid('props',2,2,2,1042,664,639,{alpha:pulse(t,120,10,24)});
  const chips=pulse(t,309,25,28);
  art.grid('props',1,2,2,x-193,y-336,333,{alpha:chips});
  art.grid('props',3,2,2,tx+78,ty+22,578,{alpha:finish});
  target(opponent,tx,ty-hit*10,-.07-hit*.35-ease((t-335)/39)*1.45,2.65);
  art.grid(sheets[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,497);
  for(const [beat,kind,angle] of [[49,0,.03],[78,0,.14],[122,2,-.13],[164,1,.02],[207,1,-.17],[252,2,-.51],[286,1,.06]]){
   const strikeX=kind===0?mix(x+143,tx,.72):tx-42;
   art.strike(kind,strikeX,ty-105,kind===0?570:536,342,pulse(t,beat,4,10),angle);
  }
  art.glow(2,x+172,y-150,656,452,chips*.47,-.32);
  art.strike(3,tx-78,ty-96,1140,755,finish,-.18);
  ctx.restore();
  flash('199,255,225',Math.max(hit*.053,finish*.16));bands(t,'#171b37');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,172+time*5,139+time*4,1-time/profile.contactHold*.65,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

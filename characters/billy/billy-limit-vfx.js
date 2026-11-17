'use strict';

const BillyLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('billy',['cutin','effects','court','motion']);
 const hits=[...BillyLimitProfile.combo.keys()];
 const shots=[
  [0,424,673,1104,670,771,429,.94,0,0],[31,700,673,1104,670,919,428,.96,-.013,31],
  [46,810,670,1119,658,966,428,.97,.02,23],[63,882,658,1161,623,1020,418,.91,-.022,34],
  [81,1189,655,1149,635,1177,414,.95,.019,-34],[100,1283,444,1204,570,1232,339,.87,-.03,-37],
  [118,1015,416,1244,542,1129,337,.85,.019,29],[138,1001,663,1286,645,1147,425,.93,-.017,40],
  [159,827,674,1322,659,1064,431,.90,.009,34],[178,854,483,1317,635,1066,353,.86,-.018,37],
  [194,883,671,1336,658,1111,439,1.02,.02,31],[211,917,672,1343,642,1147,425,1.04,.026,23],
  [224,922,672,1541,470,1236,414,.84,.008,23],[248,917,672,1911,306,1409,424,.74,0,0]
 ];
 const pulse=(t,h,lead,tail)=>ease((t-h+lead)/lead)*(1-ease((t-h-2)/tail));

 function ray(fromX,fromY,toX,toY,strength,stretch=1){
  if(strength<=0)return;
  const dx=toX-fromX,dy=toY-fromY,angle=Math.atan2(dy,dx);
  const length=Math.hypot(dx,dy)*stretch;
  art.strike(1,fromX+Math.cos(angle)*length*.45,fromY+Math.sin(angle)*length*.45,length,181,strength,angle);
  art.strike(0,fromX,fromY,209,176,strength*.83,angle);
 }
 function draw({attacker,target:opponent,face,time}){
  const t=BillyLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(h=>pulse(t,h,3,9))),finish=pulse(t,211,2,22);
  frameClip();
  const w=W+351,h=w*9/16,floor=H*.51+(672-cy)*z;
  art.image('court',-(w-W)*.5-(cx-1095)*.10,Math.min(-8,floor-h*.81),w,h);
  ctx.fillStyle='rgba(21,9,34,'+(pulse(t,208,16,34)*.48)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.54,finish));
  const spread=ease((t-211)/18),aimX=1339,aimY=526;
  art.strike(2,aimX,aimY,mix(533,1161,spread),mix(443,685,spread),pulse(t,214,5,25)*.87,-.19);
  const sprite={...attacker,x,y,face:Math.sign(pose||1),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  if(!attacker.color&&t>=151&&t<231){
   const stance=t<170?0:t<191?1:2;
   art.grid('motion',stance,3,1,x,y,[311,364,341][stance],{anchorY:.94});
  }else drawSprite(sprite,1,Math.abs(pose),3.08);
  target(opponent,tx,ty-impact*14,-.12-impact*.34-ease((t-212)/24)*1.37,2.51);
  for(const [i,hit] of hits.entries()){
   const power=pulse(t,hit,3,8);
   if(i===2)art.strike(0,tx,ty-116,433,292,power,.23);
   else ray(x+86*Math.sign(pose||1),y-(i%2?135:118),tx,ty-115,power);
  }
  const upperMuzzle=y-(attacker.color?211:254),lowerMuzzle=y-(attacker.color?187:200);
  ray(x+158,upperMuzzle,aimX,aimY,pulse(t,211,2,9),1.2);
  ray(x+143,lowerMuzzle,aimX,aimY,pulse(t,211,1,10),1.2);
  art.strike(3,aimX,aimY,mix(454,837,spread),mix(365,738,spread),pulse(t,211,1,14),-.16);
  ctx.restore();
  flash('255,192,135',Math.max(impact*.12,pulse(t,211,1,7)*.17));
  bands(t,'#25172d');portraitPanel(t,-22,art.portrait);ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,156+time*4,143,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

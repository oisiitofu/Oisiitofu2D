'use strict';
const EdelgardLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('edelgard',['cutin','effects','throne','debris'],{revision:2});
 const shots=[
  [0,387,672,1078,605,732,423,.93,0,0],[33,697,672,1078,605,888,421,.98,0,2],
  [46,897,673,1081,598,990,414,1.02,.022,11],[64,1001,641,1157,569,1079,404,.96,-.02,8],
  [83,1084,605,1224,550,1154,381,.93,.024,10],[103,1153,543,1325,575,1239,369,.92,-.024,13],
  [123,1267,568,1417,555,1342,386,.96,.022,42],[143,1397,531,1553,514,1475,372,.92,-.021,44],
  [171,1372,536,1577,528,1475,393,.89,0,45],[194,1381,529,1564,527,1473,387,.91,-.016,15],
  [207,1410,532,1586,513,1498,377,.99,.027,16],[241,1410,532,2024,303,1630,399,.76,0,0]
 ];
 const pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=EdelgardLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...EdelgardLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,207,5,26);
  frameClip();
  const width=W+365,height=width*9/16;
  const ground=H*.51+(Math.max(532,y)-cy)*z;
  ctx.save();
  if(face<0){ctx.translate(W,0);ctx.scale(-1,1);}
  art.image('throne',-(width-W)*.48-(cx-1100)*.145,Math.min(-9,ground-height*.78),width,height);
  ctx.restore();
  ctx.fillStyle='rgba(32,13,19,'+(finish*.27)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.66,finish));
  const spread=ease((t-207)/17),finishX=1586,groundY=537;
  art.grid('debris',0,2,1,finishX+spread*81,groundY+91,608+spread*499,{anchorY:.64,alpha:finish});
  art.grid('debris',1,2,1,finishX+spread*146,groundY-101,607+spread*311,{anchorY:.48,alpha:pulse(t,216,7,23)*.83});
  art.glow(1,x+112,y-133,382,322,pulse(t,194,15,11)*.53,-.37);
  art.strike(3,finishX+spread*105,groundY-159,632+spread*519,411+spread*164,finish,-.24);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.17);
  target(opponent,tx,ty-impact*13,-.12-impact*.38-ease((t-208)/26)*1.36,2.54);
  for(const [i,h] of hits.entries()){
   art.strike([0,1,2,0,1,2][i],tx-11,ty-112,421+i*16,328,pulse(t,h,4,9),[-.26,.29,.15,-.31,-.19,.16][i]);
  }
  art.strike(2,finishX-39,groundY-113,360+spread*114,280,pulse(t,207,2,9),.19);
  ctx.restore();flash('255,173,133',Math.max(impact*.11,finish*.22));bands(t,'#241b2c');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,170+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

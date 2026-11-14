'use strict';

const VincentLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('vincent',['cutin','effects']);
 const shots=[
  [0,390,670,1012,668,697,420,.96,0,1],[34,590,670,1012,668,801,426,.95,-.016,42],
  [46,696,671,1022,659,858,432,.99,.02,42],[63,818,671,1053,645,942,435,.97,-.014,43],
  [82,762,521,1102,586,927,381,.91,.021,44],[95,634,499,1110,576,874,372,.89,0,45],
  [102,689,417,1128,546,905,334,.86,.03,46],[123,993,267,1173,543,1088,321,.87,-.017,46],
  [143,1038,448,1242,533,1140,336,.93,.024,47],[164,876,415,1296,614,1070,369,.84,-.022,48],
  [192,915,345,1296,637,1092,352,.86,-.01,45],[205,987,371,1309,629,1155,361,.94,.028,47],
  [224,1010,559,1580,376,1236,361,.81,0,48],[240,1000,670,1786,275,1372,403,.79,0,1]
 ];
 const hits=[46,63,82,102,123,143];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=VincentLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9)));
  const finish=pulse(t,205,4,26),shift=Math.max(pulse(t,94,9,9),pulse(t,232,5,8));
  frameClip();
  const sky=ctx.createRadialGradient(W*.59,H*.34,10,W*.59,H*.34,W*.75);
  sky.addColorStop(0,'#6e384e');sky.addColorStop(.52,'#312037');sky.addColorStop(1,'#101422');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.52,finish));
  for(let i=0;i<13;i++){
   const px=i*285-1200,top=235+i%4*59;
   ctx.fillStyle=i%2?'#332335':'#281c2e';ctx.fillRect(px,top,195,669-top);
   ctx.fillStyle='#815864';
   for(let j=0;j<4;j++)ctx.fillRect(px+26+j*39,top+25,8,31);
  }
  ctx.fillStyle='#302737';ctx.fillRect(-1800,671,6000,540);
  art.glow(3,x,y-145,615,564,shift);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  const chaosScale=pose>=45?3.55:3.15;
  if(pose>=45){
   ctx.save();ctx.shadowColor='#f15a84';ctx.shadowBlur=19+shift*28;
   drawSprite(sprite,1,pose-1,chaosScale);ctx.restore();
  }else drawSprite(sprite,1,pose-1,chaosScale);
  target(opponent,tx,ty-impact*11,-.13-impact*.34-ease((t-206)/29)*1.35,2.55);
  for(const [i,hit] of hits.entries()){
   const power=pulse(t,hit,4,8);
   if(i<3){
    const sx=x+108,sy=y-103,dx=tx-sx,dy=ty-111-sy;
    art.strike(0,sx+dx/2,sy+dy/2,Math.hypot(dx,dy)+80,130,power,Math.atan2(dy,dx));
    art.strike(1,tx,ty-107,235,228,power);
   }else{
    art.strike(i===3?1:2,tx-25,ty-127,363+i*18,309,power,[-.4,1.06,-.39][i-3]);
   }
  }
  const dx=tx-x-56,dy=ty-129-(y-145);
  art.strike(0,x+56+dx*.53,y-145+dy*.53,Math.hypot(dx,dy)+110,290,finish,Math.atan2(dy,dx));
  art.strike(3,tx,ty-128,mix(480,944,ease((t-205)/18)),522,finish,-.28);
  ctx.restore();flash('255,133,155',Math.max(shift*.23,impact*.11,finish*.2));bands(t,'#140d1d');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(1,x,y,165+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

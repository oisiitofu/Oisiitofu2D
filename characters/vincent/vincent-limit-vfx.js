'use strict';

const VincentLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('vincent',['cutin','effects','court'],{revision:2});
 const shots=[
  [0,390,670,1012,668,697,420,.96,0,1],[34,590,670,1012,668,801,426,.95,-.016,42],
  [46,696,671,1022,659,858,432,.99,.02,42],[63,704,671,1053,645,892,435,.97,-.014,43],
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
  const finish=pulse(t,205,4,26),shift=Math.max(pulse(t,92,8,11),pulse(t,232,5,8));
  frameClip();
  const width=W+366;
  art.image('court',-(width-W)*.5-(cx-1030)*.115,-98-(cy-402)*.14,width,width*9/16);
  world(cx,cy,z,roll,face,t,Math.max(impact*.52,finish));
  const burst=ease((t-205)/18);
  const muzzleX=x+56,muzzleY=y-145,dx=tx-muzzleX,dy=ty-129-muzzleY;
  const beamAngle=Math.atan2(dy,dx),beamLength=Math.hypot(dx,dy)+155;
  art.strike(3,tx+110+burst*115,ty-149+burst*43,mix(625,1150,burst),580,finish,-.12);
  art.glow(0,muzzleX+dx*.53,muzzleY+dy*.53,beamLength+86,477,finish*.68,beamAngle);
  art.strike(0,muzzleX+dx*.53,muzzleY+dy*.53,beamLength,343,finish,beamAngle);
  art.glow(3,x,y-145,565,550,shift*.76,-.13);
  art.glow(1,x,y-140,358,373,shift*.81);
  art.glow(1,muzzleX,muzzleY,235,244,pulse(t,205,18,8)*.62);
  const chaos=t>=92&&t<232;
  const frame=chaos?Math.max(44,pose-1):t<92?Math.min(43,pose-1):0;
  const sprite={...attacker,x,y,face:frame===41||frame===42?-1:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  if(chaos){
   ctx.save();ctx.shadowColor='#f15a84';ctx.shadowBlur=12+shift*21;
   drawSprite(sprite,1,frame,3.55);ctx.restore();
  }else drawSprite(sprite,1,frame,3.15);
  target(opponent,tx,ty-impact*11,-.13-impact*.34-ease((t-206)/29)*1.35,2.55);
  for(const [i,hit] of hits.entries()){
   const power=pulse(t,hit,4,8);
   if(i<3){
    const sx=x+[7,306,15][i],sy=y-[88,125,215][i],dx=tx-sx,dy=ty-111-sy;
    art.strike(0,sx+dx/2,sy+dy/2,Math.hypot(dx,dy)+26,130,power,Math.atan2(dy,dx));
    art.glow(1,sx,sy,121,103,pulse(t,hit,2,4)*.64);
    art.strike(1,tx,ty-107,235,228,power);
   }else{
    art.strike(i===3?1:2,tx-25,ty-127,363+i*18,309,power,[-.4,1.06,-.39][i-3]);
   }
  }
  art.strike(1,tx-4,ty-126,342+burst*90,299,pulse(t,205,2,10),.08);
  ctx.restore();flash('255,133,155',Math.max(shift*.23,impact*.11,finish*.2));bands(t,'#140d1d');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(1,x,y,165+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

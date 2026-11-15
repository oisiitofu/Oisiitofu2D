'use strict';

const CliveLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('clive',['cutin','effects','court','ifrit'],{revision:2});
 const shots=[
  [0,411,674,1039,671,730,433,.94,0,1],[35,668,674,1039,671,855,424,.97,-.013,35],
  [46,846,641,1059,649,944,422,.98,.025,10],[64,925,611,1106,627,1013,414,.95,-.017,8],
  [84,992,675,1157,572,1076,407,.96,.02,19],[104,943,562,1197,556,1065,391,.89,-.019,15],
  [123,1022,444,1245,519,1145,333,.89,.025,11],[143,1145,522,1314,596,1230,368,.94,-.022,18],
  [163,1123,674,1366,637,1244,426,.9,0,4],[186,1148,674,1371,650,1263,435,.88,-.017,19],
  [204,1182,660,1394,630,1288,408,.91,.025,9],[239,1182,674,1953,361,1506,404,.77,0,1]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function draw({attacker,target:opponent,face,time}){
  const t=CliveLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...CliveLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,204,5,28),charge=pulse(t,193,25,13);
  frameClip();
  const width=W+360;
  art.image('court',-(width-W)*.5-(cx-1030)*.12,-102-(cy-408)*.13,width,width*9/16);
  world(cx,cy,z,roll,face,t,Math.max(hit*.58,finish));
  const ice=pulse(t,104,7,16);
  art.strike(2,980,566,426,296,ice);
  const apparition=ease((t-168)/25)*(1-ease((t-204)/15));
  const lift=ease((t-167)/27);
  art.image('ifrit',x-384,y-753-lift*70,770,770,apparition*.67);
  art.glow(3,x+63,y-161,487,561,charge*.62,-.24);
  const spread=ease((t-204)/19);
  for(const [offset,height,delay,angle] of [[-193,622,2,-.14],[0,935,0,.07],[206,711,3,.23]]){
   const power=pulse(t,204+delay,5,21);
   const px=tx+offset*(1+spread*.48),py=ty-38-height*.45;
   art.glow(3,px,py,440+spread*141,height,power*.58,angle);
   art.strike(3,px,py,372+spread*91,height,power,angle);
  }
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,3.14);
  target(opponent,tx,ty-hit*13,-.09-hit*.36-ease((t-205)/27)*1.36,2.52);
  for(const [i,h] of hits.entries()){
   const slot=[0,0,1,2,0,3][i];
   art.strike(slot,tx-11,ty-120,400+i*12,324,pulse(t,h,4,10),[.28,-.62,0,.13,.71,-.26][i]);
  }
  art.strike(1,tx-18,ty-84,382+spread*195,270,pulse(t,204,2,13),-.15);
  art.glow(0,tx+86*spread,ty-86,649+spread*451,320,finish*.7,-.14);
  ctx.restore();
  flash('255,165,113',Math.max(hit*.1,finish*.25));bands(t,'#221421');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,170+time*4,150,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

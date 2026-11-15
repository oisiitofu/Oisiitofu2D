'use strict';

const TidusLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('tidus',['cutin','effects','court','ball'],{revision:2});
 const shots=[
  [0,374,672,1020,672,700,430,.94,0,1],[34,690,672,1020,672,854,433,.94,-.017,6],
  [45,847,672,1030,654,934,437,1,.022,17],[62,916,662,1080,613,997,412,.97,-.02,19],
  [80,994,567,1185,547,1087,360,.91,-.026,25],[99,1092,462,1255,527,1173,326,.88,.023,30],
  [119,1199,415,1341,522,1270,308,.88,-.029,28],[139,1288,592,1425,563,1356,376,.92,.02,27],
  [162,1044,672,1454,617,1250,427,.87,-.017,7],[181,1038,520,1442,626,1241,350,.89,.023,46],
  [191,1120,434,1462,615,1291,333,.93,-.019,46],[199,1118,445,1480,621,1299,352,.87,.015,56],
  [234,1116,672,1995,337,1465,414,.77,0,1]
 ];
 const hits=[45,62,80,99,119,139],pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=TidusLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hit=Math.max(...hits.map(h=>pulse(t,h,4,9))),finish=pulse(t,199,5,25);
  frameClip();
  const width=W+360;
  art.image('court',-(width-W)*.5-(cx-1050)*.12,-96-(cy-412)*.14,width,width*9/16);
  world(cx,cy,z,roll,face,t,Math.max(hit*.54,finish));
  const spread=ease((t-199)/18);
  const rise=pulse(t,177,12,18);
  art.glow(1,x-25,y+63,545,274,rise*.65,-.18);
  art.strike(3,tx+103+spread*144,ty-115-spread*68,582+spread*505,415+spread*196,finish,-.11);
  art.glow(1,tx+208*spread,ty-88,614+spread*513,398,finish*.62,-.14);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,t>=191&&t<196?57:pose-1,3.12);
  target(opponent,tx,ty-hit*13,-.13-hit*.33-ease((t-200)/29)*1.35,2.52);
  for(const [i,h] of hits.entries()){
   const slot=i%3;
   art.strike(slot,tx-14,ty-125,383+i*14,315,pulse(t,h,4,10),[-.21,.52,-.77,.9,-.44,.23][i],slot===0?-1:1);
  }
  const flight=ease((t-191)/8),throwUp=ease((t-164)/27);
  const startX=x+31,startY=y-46;
  const apexX=x+219,apexY=y-159;
  const bx=mix(mix(startX,apexX,throwUp),tx,flight);
  const by=mix(mix(startY,apexY,throwUp)-108*Math.sin(Math.PI*throwUp),ty-111,flight);
  const ballAlpha=ease((t-165)/5)*(1-ease((t-199)/3));
  const wake=pulse(t,198,7,7);
  const pathAngle=Math.atan2(ty-111-apexY,tx-apexX);
  art.glow(1,bx-66*Math.cos(pathAngle),by-66*Math.sin(pathAngle),315,182,wake*.82,pathAngle);
  ctx.save();ctx.translate(bx,by);ctx.rotate(t*.27);
  art.image('ball',-41,-41,82,82,ballAlpha);
  ctx.restore();
  const spray=ease((t-197)/6)*(1-ease((t-204)/18));
  ctx.save();ctx.globalAlpha=spray*.9;ctx.fillStyle='#c1f9ff';
  for(let i=0;i<21;i++){
   const age=ease((t-197)/22),angle=i*2.4,reach=85+age*(170+i%5*42);
   const px=tx+Math.cos(angle)*reach,py=ty-110+Math.sin(angle)*reach*.73;
   ctx.beginPath();ctx.ellipse(px,py,10+i%4,4,angle,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  art.strike(2,tx-14,ty-116,376+spread*155,333,pulse(t,199,2,12),.16);
  ctx.restore();flash('181,234,255',Math.max(hit*.11,finish*.24));bands(t,'#101e36');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,163+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';

const ColetteLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('colette',['cutin','effects','sanctuary','angel']);
 const shots=[
  [0,470,669,1110,669,790,429,.92,0,0],[31,698,669,1110,669,904,429,.96,0,4],
  [46,908,667,1118,658,1013,431,1.01,.015,13],[64,701,572,1184,609,943,392,.93,-.021,7],
  [82,687,390,1247,560,969,348,.86,.023,14],[101,892,274,1299,509,1096,293,.81,-.021,16],
  [120,712,442,1204,549,959,349,.91,.02,10],[140,830,307,1186,548,1008,304,.87,-.024,13],
  [166,697,417,1267,631,982,366,.85,0,16],[187,782,355,1282,650,1032,362,.86,-.012,8],
  [204,805,367,1286,643,1046,368,.91,.02,16],[221,821,508,1489,484,1118,369,.81,.01,4],
  [241,845,670,1802,331,1293,419,.76,0,0]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 const loops=[[130,-136],[-155,117],[94,-231],[-130,181],[178,-110],[-166,-174]];

 function draw({attacker,target:opponent,face,time}){
  const t=ColetteLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...ColetteLimitProfile.combo.keys()];
  const impact=Math.max(...hits.map(h=>pulse(t,h,4,9))),finish=pulse(t,204,5,22);
  frameClip();
  const width=W+350;
  art.image('sanctuary',-(width-W)*.49-(cx-1040)*.12,-106-(cy-416)*.13,width,width*9/16);
  ctx.fillStyle='rgba(36,27,68,'+(finish*.26)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.54,finish));
  for(const [i,column] of [1040,1286,1528].entries()){
   const h=[198,204,210][i],light=pulse(t,h,5,19),extend=ease((t-h+2)/11);
   const height=[635,851,733][i]+extend*100;
   art.strike(3,column,666-height*.46,235+extend*124+i*38,height,light,[.15,.01,-.16][i]);
   art.glow(3,column,666-height*.48,310+extend*181,height*1.06,light*.39,[.15,.01,-.16][i]);
  }
  const wings=ease((t-55)/17)*(1-ease((t-221)/20));
  const beat=Math.sin(t*.17);
  art.grid('angel',1,2,1,x-34,y-124,309+beat*25,{anchorY:.53,alpha:wings*.88});
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.14);
  target(opponent,tx,ty-impact*14,-.11-impact*.35-ease((t-205)/24)*1.43,2.56);
  for(const [i,h] of hits.entries()){
   const swing=pulse(t,h,15,10);
   if(swing<=0)continue;
   const returning=t>h,progress=returning?1-ease((t-h)/11):ease((t-h+15)/15);
   const arc=Math.sin(Math.PI*progress),[bend,lift]=loops[i];
   const ringX=mix(x+91,tx,progress)+bend*arc;
   const ringY=mix(y-123,ty-115,progress)+lift*arc*(returning?-.64:1);
   const angle=(i%2?1:-1)*(t*.19+i),direction=returning?-1:1;
   art.glow(1,ringX-60*direction,ringY,275,162,swing*.51,angle*.22,direction);
   ctx.save();ctx.translate(ringX,ringY);ctx.rotate(angle);
   art.grid('angel',0,2,1,0,0,151,{anchorY:.5,alpha:swing});
   ctx.restore();
   art.strike([0,2,0,1,1,2][i],tx-8,ty-117,366+i*16,294,pulse(t,h,4,9),
    [-.39,.2,-.66,.49,-.13,.35][i]);
  }
  art.strike(2,1286,532,403,352,pulse(t,204,2,10),-.17);
  art.glow(2,1342,565,532,428,finish*.31,.3);
  ctx.restore();
  flash('255,233,199',Math.max(impact*.1,finish*.21));
  bands(t,'#252039');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time}){art.strike(0,x,y,169+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

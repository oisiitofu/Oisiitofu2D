'use strict';

const GenisLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('genis',['cutin','effects','observatory','spells','motion']);
 const shots=[
  [0,450,669,1116,667,783,429,.93,0,0],[31,703,669,1116,667,909,429,.96,0,22],
  [45,904,670,1123,656,1013,432,1.01,.017,19],[62,788,655,1227,604,1008,418,.93,-.024,31],
  [80,598,558,1279,573,938,392,.86,.019,34],[100,704,668,1238,634,971,425,.89,-.024,39],
  [120,829,463,1265,557,1047,371,.87,.021,36],[140,647,660,1328,621,988,421,.87,-.019,29],
  [171,668,669,1295,650,982,430,.85,0,39],[191,695,669,1294,641,995,428,.88,0,24],
  [208,700,669,1286,648,993,424,.93,.02,24],[225,693,669,1534,455,1114,400,.81,.01,33],
  [246,681,669,1801,323,1241,406,.76,0,0]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));

 function draw({attacker,target:opponent,face,time}){
  const t=GenisLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...GenisLimitProfile.combo.keys()];
  const impact=Math.max(...hits.map(h=>pulse(t,h,4,9))),finish=pulse(t,208,4,25);
  frameClip();
  const width=W+356,height=width*9/16;
  const ground=H*.51+(669-cy)*z;
  art.image('observatory',-(width-W)*.48-(cx-1040)*.13,ground-height*.82,width,height);
  ctx.fillStyle='rgba(9,16,50,'+(finish*.29)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.53,finish));
  const capture=pulse(t,100,9,12),convergence=pulse(t,202,22,10),surge=ease((t-208)/17);
  art.grid('spells',0,2,1,tx,ty-64,477,{anchorY:.52,alpha:capture});
  art.grid('spells',0,2,1,1286,657,574+surge*408,{anchorY:.55,alpha:Math.max(convergence*.85,finish*.85)});
  for(let i=0;i<3;i++){
   const a=t*.07+i*2.094,reach=89+225*(1-ease((t-183)/21));
   art.grid('spells',1,2,1,1286+Math.cos(a)*reach,277+Math.sin(a)*reach*.55,184,
    {anchorY:.5,alpha:convergence*.87});
  }
  const fall=ease((t-200)/8),bladeHeight=696+surge*301;
  art.glow(3,1286,665-bladeHeight*.45-192*(1-fall),395+surge*444,bladeHeight*1.08,finish*.35);
  art.strike(3,1286,665-bladeHeight*.45-192*(1-fall),308+surge*289,bladeHeight,finish);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  if(!attacker.color&&t>=178&&t<217){
   const motion=t<189?0:t<200?1:2;
   art.grid('motion',motion,3,1,x,y,285,{anchorY:.95});
  }else drawSprite(sprite,1,pose,3.23);
  target(opponent,tx,ty-impact*12,-.11-impact*.35-ease((t-209)/26)*1.42,2.56);
  for(const [i,h] of hits.entries()){
   const strength=pulse(t,h,4,9);
   if(i===1||i===2){
    const flight=ease((t-h+14)/14),travel=pulse(t,h,14,4);
    const px=mix(x+97,tx,flight),py=mix(y-117,ty-111,flight)+Math.sin(flight*Math.PI)*(i===1?41:-112);
    art.strike(i-1,px,py,274+flight*59,176+flight*36,travel,i===1?.13:-.21);
   }
   art.strike([2,0,1,2,2,2][i],tx-7,ty-116,384+i*15,310,strength,
    [-.27,.21,.43,-.35,.19,-.4][i]);
  }
  art.strike(2,1286,529,377+surge*147,311,pulse(t,208,2,9),-.15);
  art.glow(2,1356,525,488+surge*296,362,finish*.42,.21);
  ctx.restore();
  flash('200,219,255',Math.max(impact*.1,finish*.22));
  bands(t,'#1a2039');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time}){art.strike(2,x,y,166+time*4,146,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

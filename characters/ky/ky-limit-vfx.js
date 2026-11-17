'use strict';

const KyLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('ky',['cutin','effects','sky','motion']);
 const hits=[...KyLimitProfile.combo.keys()];
 const shots=[
  [0,455,669,1090,668,779,422,.93,0,0],[30,707,669,1090,668,899,433,.99,-.014,51],
  [47,758,668,1097,649,948,425,.97,.021,51],[63,1004,681,1126,630,1078,431,.97,.013,15],
  [82,1053,537,1164,590,1110,381,.92,-.025,16],[101,1147,421,1213,517,1180,330,.85,.022,45],
  [120,1112,661,1286,522,1203,412,.91,-.018,13],[140,1178,537,1381,536,1281,385,.9,.019,44],
  [158,1027,668,1394,568,1135,430,1.04,-.025,43],[178,1036,665,1417,553,1231,396,.84,0,50],
  [193,1151,555,1447,456,1296,349,.83,-.028,33],[210,1372,414,1533,379,1471,321,.9,.032,42],
  [225,1655,278,1750,252,1600,321,.73,.009,42],[239,1619,448,1910,108,1603,395,.72,0,14],
  [247,1573,559,1963,38,1610,420,.72,0,0]
 ];
 const pulse=(t,h,lead,tail)=>ease((t-h+lead)/lead)*(1-ease((t-h-2)/tail));

 function draw({attacker,target:opponent,face,time}){
  const t=KyLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(h=>pulse(t,h,3,9)));
  const install=pulse(t,158,7,14),charge=pulse(t,196,20,13),finish=pulse(t,210,3,20);
  frameClip();
  const width=W+350;
  art.image('sky',-(width-W)*.5-(cx-1100)*.1,-90-(cy-393)*.14,width,width*9/16);
  ctx.fillStyle='rgba(5,11,31,'+Math.max(install*.29,charge*.27,finish*.28)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.58,finish));
  const powered=attacker.kyInstallTime>0||t>=158&&t<239;
  art.strike(1,x,y-221,478,602,install*.9);
  art.glow(1,x,y-114,253,353,powered?.41:.05);
  art.strike(1,1444,263,494,652,charge*.75,.15);
  const climb=ease((t-193)/32);
  art.strike(2,mix(1126,1626,climb),mix(516,242,climb),mix(550,1060,climb),mix(460,784,climb),
   Math.max(charge*.84,finish),.13);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  if(!attacker.color&&t>=153&&t<231){
   const stance=t<177?0:t<201?1:2;
   art.grid('motion',stance,3,1,x,y,[291,340,351][stance],{anchorY:.95});
  }else drawSprite(sprite,1,pose,3.1);
  target(opponent,tx,ty-impact*13,-.09-impact*.4-ease((t-211)/24)*1.32,2.55);
  for(const [i,h] of hits.entries()){
   const strength=pulse(t,h,i===0?6:4,9);
   art.strike(i===4?1:0,tx-12,ty-(i===4?241:114),i===4?430:430+i*19,i===4?658:286,strength,
    [.25,-.41,-.18,.2,0,-.86][i]);
  }
  const spread=ease((t-209)/16);
  art.strike(3,1536+spread*122,291-spread*70,430+spread*419,365+spread*411,finish,-.24);
  ctx.restore();
  flash('195,225,255',Math.max(impact*.13,install*.15,pulse(t,210,1,7)*.16));
  bands(t,'#101c36');portraitPanel(t,24,art.portrait);ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,146+time*4,139,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

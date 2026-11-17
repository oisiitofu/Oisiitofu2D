'use strict';

const NaegiLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('naegi',['cutin','effects','court','motion']);
 const hits=[...NaegiLimitProfile.combo.keys()];
 const claims=['証言','時刻','証拠','足取り','食い違い','矛盾'];
 const shots=[
  [0,428,670,1065,668,748,426,.92,0,0],[29,595,670,1065,668,827,430,.96,-.011,8],
  [46,798,670,1065,657,966,428,1,.013,6],[63,753,670,1115,615,930,410,.93,-.023,9],
  [81,904,675,1140,575,1030,406,.94,.02,16],[100,1046,633,1192,588,1120,377,.89,-.023,8],
  [119,956,593,1211,637,1085,393,.9,.011,13],[139,858,670,1220,658,1041,432,.94,-.016,9],
  [166,830,670,1272,665,1024,434,.94,-.018,8],[185,880,667,1285,662,1047,429,1.03,.01,8],
  [207,975,667,1280,657,1160,430,1.02,.02,9],[221,982,668,1539,514,1248,412,.83,.007,9],
  [243,973,670,1850,311,1367,412,.76,0,0]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function caption(value,x,y,face,alpha,size){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;
  ctx.font='bold '+size+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineJoin='round';ctx.lineWidth=size*.15;ctx.strokeStyle='#341f28';ctx.fillStyle='#fff3d1';
  ctx.strokeText(value,0,0);ctx.fillText(value,0,0);ctx.restore();
 }

 function draw({attacker,target:opponent,face,time}){
  const t=NaegiLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(h=>pulse(t,h,3,9))),finish=pulse(t,207,2,21);
  frameClip();
  const w=W+326,h=w*9/16,floor=H*.51+(670-cy)*z;
  art.image('court',-(w-W)*.5-(cx-1060)*.09,Math.min(-6,floor-h*.82),w,h);
  ctx.fillStyle='rgba(28,12,28,'+(pulse(t,205,20,28)*.52)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.53,finish));
  for(const [i,hit] of hits.entries()){
   const pane=pulse(t,hit-6,8,5);
   const claimX=tx+42+(i%2?29:-7),claimY=ty-218-(i%3)*43;
   art.strike(0,claimX,claimY,367+i*10,280,pane,0,face);
   caption(claims[i],claimX,claimY,face,pane,44);
  }
  const claim=pulse(t,200,24,5);
  art.strike(0,1301,407,485,437,claim,0,face);
  caption('矛盾',1301,407,face,claim,76);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  if(!attacker.color&&t>=169&&t<224){
   const stance=t<189?0:t<203?1:2;
   art.grid('motion',stance,3,1,x,y,[296,305,302][stance],{anchorY:.94});
  }else drawSprite(sprite,1,pose,3.1);
  target(opponent,tx,ty-impact*13,-.11-impact*.37-ease((t-207)/24)*1.37,2.62);
  for(const [i,hit] of hits.entries()){
   const f=ease((t-hit+6)/6),power=pulse(t,hit,5,8);
   const qx=mix(x+70,tx-10,f),qy=mix(y-130,ty-107,f);
   art.strike(1,qx,qy,410,263,power,[.11,-.33,-.61,.27,-.25,.06][i]);
   art.strike(3,tx,ty-111,303,298,pulse(t,hit,2,8)*.8);
  }
  const spread=ease((t-207)/19),fingerX=x+140,fingerY=y-149;
  art.strike(2,fingerX+mix(292,511,spread),fingerY-mix(13,108,spread),mix(635,1105,spread),mix(459,734,spread),finish,-.17);
  art.strike(3,1300,512,mix(379,799,spread),mix(373,606,spread),pulse(t,207,1,15));
  ctx.restore();
  flash('255,207,132',Math.max(impact*.105,pulse(t,207,1,7)*.15));
  bands(t,'#201525');
  caption('それは違うよ！',W*.51,H*.26,1,pulse(t,207,1,16),72);
  portraitPanel(t,-24,art.portrait);ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(3,x,y,150+time*4,139,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

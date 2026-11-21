'use strict';

const LightningLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('lightning',['cutin','effects','court','finish'],{revision:3});
 const shots=[
  [0,391,672,1051,672,721,431,.94,0,1],[32,693,669,1051,672,875,431,.98,-.014,35],
  [44,869,668,1064,655,970,434,1,.019,7],[59,929,646,1103,630,1016,418,.97,-.018,8],
  [74,902,574,1113,593,1008,382,.95,.027,14],[90,1116,423,1161,563,1138,332,.9,-.021,11],
  [106,1321,494,1188,571,1254,362,.93,.026,-9],[122,1377,629,1207,636,1291,418,.96,-.019,-13],
  [139,1130,629,1011,597,1071,413,.98,.021,-16],[154,951,498,1085,601,1017,350,.91,-.021,17],
  [169,969,423,1090,616,1038,323,.91,-.026,17],[178,1003,408,1100,633,1090,352,.92,.025,12],
  [186,1046,514,1212,590,1138,384,.84,.011,12],[201,1104,645,1507,421,1264,405,.78,-.008,3],
  [209,1115,672,1644,328,1290,403,.77,0,1]
 ];
 const hits=[44,59,74,90,106,122,139],pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=LightningLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hit=Math.max(...hits.map(h=>pulse(t,h,3,8))),finish=pulse(t,178,2,14);
  frameClip();
  const width=W+350;
  art.image('court',-(width-W)*.5-(cx-1025)*.12,-101-(cy-414)*.14,width,width*9/16);
  ctx.fillStyle='rgba(17,14,55,'+pulse(t,177,19,25)*.54+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.61,finish));
  const spread=ease((t-178)/17);
  const charge=pulse(t,177,17,4);
  art.glow(2,x+38,y-163,332,230,charge*.75,-1.04);
  art.strike(1,1249+spread*88,230,407+spread*224,851,finish,-.16,1,'finish');
  art.strike(2,1140+spread*138,612,590+spread*551,232+spread*146,pulse(t,182,5,20),.04,1,'finish');
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.18);
  target(opponent,tx,ty-hit*14,-.1-hit*.38-ease((t-179)/26)*1.35,2.55);
  for(const [i,h] of hits.entries()){
   const power=pulse(t,h,3,8);
   if(i===2||i===5){
    const sx=x+Math.sign(pose)*106,sy=y-127,dx=tx-sx,dy=ty-126-sy;
    art.strike(2,sx+dx*.5,sy+dy*.5,Math.hypot(dx,dy)+75,124,power,Math.atan2(dy,dx));
   }else art.strike(i%2,tx,ty-116,429+i*12,320,power,[-.42,.62,0,-1.2,.46,0,.16][i],i>=4?-1:1);
  }
  art.strike(0,mix(x+120,tx+247,spread),mix(y-60,ty-104,spread),579+spread*325,432+spread*110,finish,1.02,1,'finish');
  ctx.restore();flash('219,194,255',Math.max(hit*.11,finish*.14));bands(t,'#171427');
  portraitPanel(t,-31,(zoom,alpha)=>art.portrait(zoom,alpha));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,168+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

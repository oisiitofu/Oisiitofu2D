'use strict';
const PawapuroLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('pawapuro',['cutin','court','poses','effects']);
 const shots=[
  [0,459,647,960,607,721,394,1.07,.014,0],
  [43,558,647,990,605,777,393,1.03,-.014,0],
  [49,558,647,991,605,777,393,1.03,-.014,1],
  [60,575,647,1033,605,808,393,1.02,.014,0],
  [68,575,647,1035,605,808,393,1.02,.014,1],
  [78,587,647,1071,604,832,393,1.01,-.014,0],
  [86,587,647,1074,604,832,393,1.01,-.014,1],
  [98,605,647,1100,604,855,393,.98,.015,0],
  [106,605,647,1103,604,855,393,.98,.015,1],
  [118,850,647,1132,603,995,392,1.04,-.017,2],
  [127,850,647,1135,603,995,392,1.04,-.017,3],
  [138,897,647,1172,602,1037,391,1.04,.018,2],
  [148,897,647,1175,602,1037,391,1.04,.018,3],
  [160,938,647,1210,601,1077,390,1.04,-.019,2],
  [170,938,647,1213,601,1077,390,1.04,-.019,3],
  [179,977,647,1252,600,1117,389,1.05,.020,2],
  [189,977,647,1255,600,1117,389,1.05,.020,3],
  [208,924,647,1274,594,1100,382,.86,-.013,2],
  [229,1023,647,1301,569,1162,358,.95,.023,3],
  [244,1023,647,1633,305,1201,374,.81,-.014,3],
  [260,1023,647,1907,174,1260,381,.82,0,3]
 ];
 const pitches=[[48,-16],[67,15],[85,-9],[105,8]];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=PawapuroLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const charge=pulse(t,197,212,222,229),finish=pulse(t,224,228,234,253);
  const flinch=Math.max(...Array.from(PawapuroLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+7)));
  frameClip();ctx.fillStyle='#362039';ctx.fillRect(0,0,W,H);art.image('court',-73-t*.12,-66,W+189,H+134);
  world(cx,cy,z,roll,face,t,Math.max(flinch*.58,finish));
  for(const [hit,offset] of pitches){
   const flight=ease((t-hit+10)/10),fromX=x+110,fromY=y-136,toX=tx-29,toY=ty-99+offset;
   art.strike(0,mix(fromX,toX,flight),mix(fromY,toY,flight),313,313*650/740,pulse(t,hit-10,hit-7,hit,hit+5),Math.atan2(toY-fromY,toX-fromX));
  }
  art.glow(2,x+123,y-158,290+charge*171,244+charge*151,charge*.48);
  for(const [hit,angle] of [[126,-.12],[147,.10],[169,-.17],[188,-.33]]){
   const impact=pulse(t,hit-4,hit,hit+1,hit+8);
   art.strike(1,tx-65,ty-111,340,236,impact,angle);
   art.strike(2,tx-43,ty-106,202,170,impact);
  }
  art.strike(1,tx-65,ty-113,429+finish*150,286+finish*118,finish,-.23);
  art.strike(2,tx-40,ty-109,278+finish*146,221+finish*122,finish);
  const homerWidth=390+finish*320;
  art.strike(3,tx-.272*homerWidth,ty-110+.217*homerWidth,homerWidth,homerWidth*650/740,finish,-.08);
  let currentPose=pose;
  if(t<116)currentPose=pitches.some(([hit])=>t>=hit-10&&t<=hit+3)?1:0;
  art.grid('poses',currentPose,2,2,x,y,339);
  target(opponent,tx+flinch*23,ty-flinch*22,-.10-flinch*.29-ease((t-229)/28)*1.48);
  ctx.restore();flash('255,223,164',Math.max(flinch*.12,finish*.24));bands(t,'#2d1e34');
  const title=ease((t-229)/7)*(1-ease((t-250)/10));
  if(title>0){
   ctx.save();ctx.globalAlpha*=title;ctx.textAlign='center';ctx.font='900 68px "Arial Black",sans-serif';
   ctx.lineWidth=9;ctx.strokeStyle='#142c67';ctx.fillStyle='#ffe17d';ctx.strokeText('HOME RUN!',W*.5,135);ctx.fillText('HOME RUN!',W*.5,135);ctx.restore();
  }
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(2,x,y,163+time*6,121,1-time/PawapuroLimitProfile.contactHold*.6,-.10,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

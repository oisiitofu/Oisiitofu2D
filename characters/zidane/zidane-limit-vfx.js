'use strict';

const ZidaneLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('zidane',['cutin','effects','court','dock'],{revision:2});
 const shots=[
  [0,395,675,1055,673,720,428,.91,0,1],[35,685,675,1055,673,870,438,.97,-.011,31],
  [47,864,675,1067,664,965,442,1,.019,7],[65,934,671,1141,626,1036,414,.95,-.02,8],
  [83,1064,501,1194,583,1129,360,.91,.024,9],[103,1338,412,1190,539,1267,308,.87,-.029,-12],
  [122,1290,575,1159,599,1223,409,.93,.018,-17],[142,947,511,1129,563,1038,375,.91,-.023,16],
  [163,858,675,1155,612,1004,421,.87,0,47],[182,893,584,1188,620,1040,383,.9,-.009,11],
  [194,968,482,1213,609,1090,361,.98,.024,20],[228,973,675,1722,332,1211,401,.79,0,1]
 ];
 const hits=[47,65,83,103,122,142];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=ZidaneLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9))),finish=pulse(t,194,5,25);
  const trance=pulse(t,162,9,38);
  frameClip();
  const width=W+368;
  art.image('court',-(width-W)*.5-(cx-1000)*.12,-99-(cy-402)*.14,width,width*9/16);
  world(cx,cy,z,roll,face,t,Math.max(impact*.54,finish));
  const platforms=ease((t-27)/12)*(1-ease((t-150)/17));
  for(const [px,py,span] of [[698,500,405],[1200,419,270],[1215,576,256]]){
   art.image('dock',px,py-7,span,span*.18,platforms);
  }
  art.glow(2,x,y-133,452,425,trance*.83);
  art.glow(0,x,y-111,530,379,trance*.43,-.24);
  const spread=ease((t-194)/18);
  art.glow(3,tx+122*spread,ty-130,644+spread*483,530,finish*.66,-.27);
  art.strike(3,tx+93*spread,ty-130,547+spread*448,329+spread*82,finish,-.25);
  art.strike(3,tx+67*spread,ty-137,521+spread*352,362+spread*68,finish,.18,-1);
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.1);
  target(opponent,tx,ty-impact*13,-.11-impact*.33-ease((t-195)/28)*1.33,2.55);
  for(const [i,hit] of hits.entries()){
   art.strike(i===2?2:i%2,tx-21,ty-108,383+i*12,301,pulse(t,hit,4,9),[-.17,.37,-.57,.92,-.81,.49][i]);
  }
  art.strike(2,tx,ty-125,318+spread*154,301,pulse(t,194,2,13));
  ctx.restore();flash('255,218,176',Math.max(trance*.15,impact*.11,finish*.21));bands(t,'#172135');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(2,x,y,168+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const MidnaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('midna',['cutin','court','poses','beast','effects']);
 const shots=[
  [0,549,649,877,616,721,442,1.17,-.031,0],
  [42,600,618,944,590,757,422,1.12,.035,0],
  [67,532,612,978,582,750,403,1.00,-.035,1],
  [98,493,540,1019,586,755,390,.94,.041,2],
  [118,477,500,1033,588,749,373,.92,-.033,3],
  [143,471,503,1034,577,760,397,.89,.035,3],
  [162,479,519,1044,581,787,398,.95,-.046,3],
  [177,500,538,1064,560,833,412,1.04,.044,3],
  [196,519,546,1215,422,873,416,.97,-.029,3],
  [220,511,571,1479,273,895,434,.94,.017,4],
  [247,513,635,1703,190,906,446,.93,0,5]
 ];
 const beastShots=[
  [104,471,651,488,0],[127,453,651,671,0],[151,464,641,739,1],
  [162,470,643,725,1],[176,752,640,731,2],[188,768,638,715,2],
  [204,549,636,658,3],[224,504,632,600,3]
 ];
 function fragments(t,x,y){
  const alpha=ease((t-59)/13)*(1-ease((t-102)/12));
  if(!alpha)return;
  const phase=ease((t-63)/43),s=1-phase;
  for(let i=0;i<3;i++){
   const angle=t*.072+i*TAU/3;
   art.effect(0,x+Math.cos(angle)*(30+s*230),y-141+Math.sin(angle)*(18+s*155),
    89+s*47,92+s*51,alpha*(.80+i*.08),angle);
  }
 }
 function blocks(t,x,y,strength){
  if(!strength)return;
  ctx.save();
  for(let i=0;i<43;i++){
   const age=t-177-i%6;if(age<0)continue;
   const angle=i*2.39996,velocity=4+i%9*1.7,size=3+i%5*4;
   ctx.save();ctx.translate(x+Math.cos(angle)*age*velocity+age*5,y+Math.sin(angle)*age*velocity*.62-age*2);
   ctx.rotate(angle+age*.07);ctx.globalAlpha=strength*(.54+i%4*.14);
   ctx.fillStyle=['#111322','#55daca','#f7a758'][i%3];ctx.fillRect(-size/2,-size/2,size,size);
   ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  const s=1.032+time*.0011,opacity=ease(t/4)*(1-ease((t-23)/9));
  if(!opacity)return;
  ctx.save();ctx.beginPath();ctx.moveTo(0,100);ctx.lineTo(W,151);ctx.lineTo(W,715);ctx.lineTo(0,664);ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=MidnaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const [bx,by,height,beastIndex]=camera(beastShots,t);
  const transform=ease((t-101)/13)*(1-ease((t-125)/19));
  const strike=ease((t-174)/7)*(1-ease((t-185)/31));
  frameClip();ctx.fillStyle='#1a192b';ctx.fillRect(0,0,W,H);
  art.image('court',-114-t*.18,-107+ease((t-71)/64)*61,W+306,H+166);
  world(cx,cy,z,roll,face,t,Math.max(strike,transform*.40));
  target(opponent,tx,ty,-.11+Math.sin(t*.13)*.13-ease((t-179)/32)*1.26);
  const rise=ease((t-104)/17),revert=ease((t-207)/25);
  art.effect(1,481,376,490+transform*331,449+transform*249,transform*.84,-t*.012);
  art.grid('poses',index,3,2,x,y,330,{alpha:1-rise+revert});
  art.grid('beast',beastIndex,2,2,bx,by,height,{alpha:rise*(1-revert)});
  fragments(t,x,y);
  const sweep=ease((t-163)/7)*(1-ease((t-176)/17));
  art.effect(2,937,457,513+sweep*446,233+sweep*118,sweep*.93,.032);
  art.effect(3,1066,467,464+strike*635,345+strike*276,strike*.87);
  blocks(t,1066,461,ease((t-177)/5)*(1-ease((t-187)/37)));
  ctx.restore();flash('163,241,204',Math.max(strike*.17,transform*.15));
  bands(t,'#131522');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/MidnaLimitProfile.contactHold;
  art.effect(2,x,y,171+56*p,128,1-p*.56,.10,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const WelchLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('welch',['cutin','court','poses','prop','effects']);
 const shots=[
  [0,477,653,912,622,703,456,1.14,-.029,0],
  [33,590,646,891,620,750,453,1.24,.044,1],
  [49,653,646,922,612,787,449,1.24,-.057,1],
  [69,682,646,969,574,805,439,1.13,.075,2],
  [88,638,568,968,599,801,418,1.04,-.067,3],
  [110,617,431,974,617,812,358,.93,.069,3],
  [130,609,638,976,613,798,438,1.04,.052,4],
  [149,609,641,984,616,792,433,1.03,-.040,4],
  [168,594,641,984,614,803,408,.95,-.084,4],
  [178,583,641,997,602,824,429,1.12,.065,4],
  [194,580,646,1167,476,869,444,1.03,-.041,5],
  [218,589,650,1391,333,903,444,.96,.023,5],
  [245,593,650,1540,245,935,453,.93,0,5]
 ];
 function fallingProp(t){
  if(t<89||t>=207)return;
  const tossed=unit((t-89)/33),fall=unit((t-149)/29),impact=unit((t-178)/20);
  const grow=ease((t-119)/35),rotation=t<148?tossed*TAU*2+grow*Math.PI:Math.PI+impact*.23;
  const width=155+grow*260,height=293+grow*542;
  const x=mix(648,994,ease((t-90)/43))-impact*59;
  const y=fall>0?-508+fall*fall*711-impact*38:443-tossed*966;
  const opacity=1-ease((t-195)/12);
  art.effect(2,x,y-147,324+fall*164,730,fall*(1-impact)*.7);
  ctx.save();ctx.translate(x,y);ctx.rotate(rotation);
  art.image('prop',-width/2,-height/2,width,height,opacity);ctx.restore();
 }
 function stars(t,x,y,weight){
  if(!weight)return;
  ctx.save();
  for(let n=0;n<44;n++){
   const age=t-174-n%6;if(age<0)continue;
   const a=n*2.39996,r=30+age*(5+n%7*1.2),size=5+n%9;
   ctx.save();ctx.translate(x+Math.cos(a)*r,y+Math.sin(a)*r*.63-age*2.1);ctx.rotate(a+age*.11);
   ctx.globalAlpha=weight*(.50+n%5*.11);
   ctx.strokeStyle=n%2?'#952d83':'#1d4488';ctx.fillStyle=['#ffee8b','#ffb0e2','#a5f7ff'][n%3];ctx.lineWidth=1.5;
   ctx.beginPath();for(let j=0;j<10;j++){
    const q=j*TAU/10-Math.PI/2,r=j%2?size*.42:size;
    if(j===0)ctx.moveTo(Math.cos(q)*r,Math.sin(q)*r);else ctx.lineTo(Math.cos(q)*r,Math.sin(q)*r);
   }
   ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  if(t>=30)return;
  const s=1+time*.001,a=ease(t/5)*(1-ease((t-23)/7));
  ctx.save();ctx.beginPath();ctx.moveTo(0,101);ctx.lineTo(W,67);ctx.lineTo(W,687);ctx.lineTo(0,751);ctx.closePath();ctx.clip();
  art.image('cutin',W*(1-s)/2,H*(1-s)/2,W*s,H*s,a);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=WelchLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const hit=t>=176?unit(1-(t-176)/16):0;
  const blast=ease((t-175)/7)*(1-ease((t-189)/33));
  frameClip();ctx.fillStyle='#202542';ctx.fillRect(0,0,W,H);
  const pan=ease((t-88)/28)*(1-ease((t-118)/17));
  art.image('court',-105-t*.18,-96+pan*111,W+287,H+171);
  world(cx,cy,z,roll,face,t,Math.max(hit,blast*.52));
  const shadow=ease((t-139)/38)*(1-ease((t-178)/14));
  if(shadow>0){
   ctx.fillStyle='rgba(15,13,42,'+(shadow*.58)+')';
   ctx.beginPath();ctx.ellipse(994,642,102+shadow*87,14+shadow*17,0,0,TAU);ctx.fill();
  }
  target(opponent,tx,ty,-.13+hit*.68-ease((t-181)/23)*1.18);
  art.grid('poses',t>=178&&t<207?4:index,3,2,x,y,356);
  for(const [i,at] of [34,49,66].entries()){
   const strength=ease((t-at)/4)*(1-ease((t-at-6)/13));
   art.effect(0,tx-34,ty-121,249+i*54,192+i*45,strength*.90,(i-1)*.34);
  }
  const launch=ease((t-87)/11)*(1-ease((t-106)/17));
  art.effect(1,698,362,592,222,launch*.76,-.78);
  fallingProp(t);
  art.effect(3,991,595,760+blast*441,406+blast*203,blast*.81);
  stars(t,993,579,blast);
  ctx.restore();flash('255,215,223',hit*.22);
  bands(t,'#15172b');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/WelchLimitProfile.contactHold;
  art.effect(0,x,y,154+43*p,112,1-p*.59,-.09,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

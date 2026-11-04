'use strict';
const AshleyLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('ashley',['cutin','court','poses','effects','props']);
 const shots=[
  [0,410,652,967,628,688,430,1.12,.022,0],
  [46,424,648,964,632,710,445,1.06,-.012,0],
  [79,425,526,967,629,714,380,.93,.019,1],
  [116,514,594,992,632,733,403,.99,-.021,2],
  [145,433,630,1028,598,771,417,.87,.028,3],
  [170,419,640,1068,601,796,425,.94,-.018,3],
  [188,428,650,1134,564,815,441,.94,.027,3],
  [217,413,649,1455,337,896,441,.87,-.014,0],
  [250,425,651,1744,204,914,454,.88,0,0]
 ];
 const beat=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 function draw({target:opponent,face,time}){
  const t=AshleyLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const red=beat(t,39,49,214,245),pot=beat(t,56,74,190,220),boil=beat(t,87,142,164,186);
  const beam=beat(t,156,165,181,192),blast=beat(t,176,187,194,222);
  const redX=mix(x+57,660,ease((t-43)/47))+Math.sin(t*.10)*51;
  const redY=mix(y-193,409,ease((t-42)/50))+Math.sin(t*.15)*33;
  frameClip();
  ctx.fillStyle='#18102c';ctx.fillRect(0,0,W,H);
  art.image('court',-73-t*.12,-57,W+179,H+117);
  world(cx,cy,z,roll,face,t,Math.max(blast,beam*.45));
  art.glow(3,690,536,356+boil*260,320+boil*237,boil*.63,-.18);
  art.grid('props',1,2,1,698,646,290+pot*26,{alpha:pot});
  art.grid('poses',pose,2,2,x,y,286);
  art.grid('props',0,2,1,redX,redY,157,{anchorY:.55,alpha:red});
  const recoil=-.11-ease((t-185)/42)*1.34;
  if(t<194)target(opponent,tx,ty,recoil);
  const rayLength=mix(140,589,ease((t-156)/10));
  art.strike(2,690+rayLength*.5,520,rayLength,216+beam*84,beam,-.06);
  art.strike(3,1086,504,462+blast*568,360+blast*217,blast);
  if(t>=194)target(opponent,tx,ty,recoil);
  ctx.restore();
  flash('210,169,255',Math.max(blast*.29,beam*.13));bands(t,'#170d24');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(3,x,y,149+time*4,130,1-time/AshleyLimitProfile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

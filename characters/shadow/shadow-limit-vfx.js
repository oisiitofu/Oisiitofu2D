"use strict";
const ShadowLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('shadow',['cutin','court','poses','motion','avatars','effects']);
 const shots=[[0,0,0,1160,625,1000,405,.92,0,0],[35,0,0,1160,625,1050,405,.90,0,0],[54,0,0,1160,625,1110,405,.93,.012,0],[88,0,0,1160,625,1170,380,.88,-.012,0],[121,0,0,1160,625,1040,405,.90,0,0],[170,0,0,1160,625,1080,350,.80,0,0],[210,0,0,1160,625,1140,330,.77,0,0],[263,0,0,1270,625,1190,360,.76,0,0],[298,0,0,1400,625,1260,370,.72,0,0],[320,0,0,1400,625,1260,370,.69,.016,0],[340,0,0,1650,440,1370,370,.72,0,0],[360,0,0,1920,180,1480,350,.74,0,0]];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function body(t){
  if(t<32)return {x:650,y:740,p:t<20?0:4,face:1,a:1};
  if(t<69)return {x:900,y:760,p:1,face:1,a:pulse(t,39,46,62,69)};
  if(t<103)return {x:1400,y:580,p:2,face:-1,a:pulse(t,74,80,96,103)};
  if(t<140)return {x:700,y:700,p:6,face:1,a:pulse(t,106,112,133,140)};
  if(t<165)return {x:980,y:730,p:t<153?3:5,face:1,a:pulse(t,142,147,160,165)};
  if(t<184)return {x:950,y:620,p:7,face:1,a:1};
  if(t<222)return {x:950,y:620,p:8,face:1,a:1};
  if(t<253)return {x:780,y:510,p:9,face:1,a:pulse(t,222,228,247,253)};
  if(t<279)return {x:1550,y:450,p:9,face:-1,a:pulse(t,253,257,273,279)};
  if(t<309)return {x:1100,y:740,p:10,face:1,a:pulse(t,279,284,305,310)};
  return {x:1100,y:740,p:t<343?11:8,face:1,a:1};
 }
 function actor(t){const {x,y,p,face,a}=body(t);art.grid(p>=8?'avatars':p<4?'poses':'motion',p%4,2,2,x,y,p>=8?950:550,{alpha:a,face});}
 function spear(t,tx,ty,a){
  const {x,y,p,face}=body(t),q=(p>=8?950/800:550/640),[px,py]=p>=8?[650,705]:[620,260],cw=p>=8?900:780,ch=p>=8?800:640;
  const sx=x+face*(px-cw/2)*q,sy=y+(py-ch*.96)*q,d=Math.hypot(tx-sx,ty-95-sy),angle=Math.atan2(ty-95-sy,tx-sx),s=d/570;
  // The source Chaos Spear was normalized to RIGHT before this rotation. No additional face flip.
  art.strike(1,sx+285*s*Math.cos(angle),sy+285*s*Math.sin(angle),740*s,650*s,a,angle);
 }
 function draw({target:opponent,face,time}){
  const t=ShadowLimitProfile.shotTime(time),[,,tx,ty,cx,cy,z,roll]=camera(shots,t),b=body(t);
  const hit=Math.max(...Array.from(ShadowLimitProfile.combo.keys(),n=>pulse(t,n-1,n,n+2,n+7)));
  const awake=pulse(t,164,181,187,204),charge=pulse(t,282,301,312,321),finish=pulse(t,314,320,329,347);
  frameClip();ctx.fillStyle='#080c23';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.filter='grayscale('+(pulse(t,26,34,165,185)*.82)+')';art.image('court',-70,-60,W+140,H+120);ctx.restore();
  world(cx,cy,z,roll,face,t,Math.max(hit*.5,finish));
  art.glow(2,tx,ty-100,650,570,pulse(t,27,34,166,185)*.20);
  for(const [n,dir,angle] of [[54,1,-.35],[88,-1,.7]])art.strike(0,tx-dir*65,ty-95,500,439,pulse(t,n-4,n,n+1,n+9),angle,dir);
  for(const n of [121,241,263]){const a=pulse(t,n-4,n,n+1,n+8);if(a>0)spear(t,tx,ty,a);}
  art.glow(2,b.x,b.y-250,650,570,Math.max(awake*.45,charge*.30));
  art.strike(3,tx-150,ty-110,1240,1089,finish);
  // Keep the frozen victim's pose fixed until the final release; chaos impacts still have visible cores.
  target(opponent,tx,ty,-.10-ease((t-321)/30)*1.44,2.3);
  actor(t);
  ctx.restore();flash('255,213,162',Math.max(hit*.08,awake*.13,finish*.20));bands(t,'#130b18');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,185+time*5,163,1-time/ShadowLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

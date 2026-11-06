"use strict";
const KurabeLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('kurabe',['cutin','court','pilot','cockpit','poses','motion','effects']);
 const shots=[
 [0,650,760,1210,625,900,420,.96,0,8],[30,650,760,1210,625,900,420,.96,0,9],
 [49,650,760,1210,625,900,420,.93,-.01,10],[66,560,100,1210,625,860,330,.73,0,0],
 [76,560,760,1210,625,860,405,.72,.012,0],[94,560,760,1220,400,880,350,.78,0,1],
 [105,560,760,1220,400,880,350,.78,.012,1],[111,535,760,1220,400,875,350,.78,0,2],
 [117,550,760,1220,400,880,350,.78,.012,1],[123,525,760,1220,400,875,350,.78,0,2],
 [129,540,760,1220,400,875,350,.78,.012,1],[141,520,760,1220,430,865,350,.78,0,2],
 [155,570,760,1220,625,890,405,.74,0,3],[169,625,760,1220,625,920,410,.74,0,4],
 [180,625,760,1280,625,950,410,.73,.01,4],[199,625,760,1320,650,970,420,.72,.01,4],
 [218,650,760,1340,755,1000,430,.70,0,3],[235,730,760,1370,755,1040,430,.73,-.01,5],
 [258,850,760,1380,755,1110,430,.76,.012,5],[270,865,760,1400,755,1130,430,.77,0,6],
 [281,900,760,1420,755,1160,430,.77,.012,6],[299,920,760,1440,755,1180,430,.74,0,5],
 [320,950,760,1470,755,1210,430,.70,.016,6],[338,950,760,1720,570,1320,425,.71,0,7],
 [355,950,760,1940,340,1420,405,.72,0,7],[365,950,760,2180,180,1520,380,.72,0,11]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function actor(t){const [x,y,,,,,,,p]=camera(shots,t);art.grid(p>=8?'pilot':p<4?'poses':'motion',p%4,2,2,x,y,p>=8?550:750);}
 // Source coordinates refer to the packed 740x650 effect cell; body anchors use 780x640.
 function line(n,sx,sy,ex,ey,a,root=70,tip=690){
  if(a<=0)return;const d=Math.hypot(ex-sx,ey-sy),q=d/(tip-root),angle=Math.atan2(ey-sy,ex-sx);
  art.strike(n,sx+(370-root)*q*Math.cos(angle),sy+(370-root)*q*Math.sin(angle),740*q,650*q,a,angle);
 }
 function muzzle(t){const [x,y,,,,,,,p]=camera(shots,t),q=750/640;const [px,py]=p===2?[640,190]:[650,220];return [x+(px-390)*q,y+(py-614.4)*q];}
 function torch(t){const [x,y,,,,,,,p]=camera(shots,t),q=750/640;return [x+230*q,y+((p===6?550:530)-614.4)*q];}
 function draw({target:opponent,face,time}){
  const t=KurabeLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll]=camera(shots,t);
  const hit=Math.max(...Array.from(KurabeLimitProfile.combo.keys(),n=>pulse(t,n-1,n,n+2,n+7)));
  const land=pulse(t,72,76,78,88),finish=pulse(t,314,320,329,346),charge=pulse(t,230,247,253,264);
  frameClip();ctx.fillStyle='#081528';ctx.fillRect(0,0,W,H);art.image('court',-70,-60,W+140,H+120);
  if(t>=42&&t<63){const q=Math.max((W+50)/1672,(H+30)/941),w=1672*q,h=941*q;art.image('cockpit',(W-w)/2,(H-h)/2,w,h);bands(t,'#08111e');ctx.restore();return;}
  world(cx,cy,z,roll,face,t,Math.max(hit*.55,land*.7,finish));
  art.glow(3,x,y-250,370,325,charge*.24);
  actor(t);
  for(const n of [105,117,129]){const a=pulse(t,n-3,n,n+1,n+7),[sx,sy]=muzzle(t);line(0,sx,sy,tx,ty-95,a);}
  // The rocket follows an arcing trajectory from the opened shoulder pod to the victim.
  for(const [start,end] of [[164,180],[182,199]]){const p=Math.max(0,Math.min(1,(t-start)/(end-start)));if(t>=start&&t<=end){const sx=625,sy=280,ex=tx,ey=ty-95,rx=sx+(ex-sx)*p,ry=sy+(ey-sy)*p-260*Math.sin(Math.PI*p),ang=Math.atan2(ey-sy-260*Math.PI*Math.cos(Math.PI*p),ex-sx);art.strike(1,rx,ry,260,228,1,ang);}art.strike(3,tx,ty-95,450,395,pulse(t,end-2,end,end+1,end+8));}
  const plasma=Math.max(...[258,281].map(n=>pulse(t,n-4,n,n+2,n+11)),finish);
  const [sx,sy]=torch(t);line(2,sx,sy,tx,ty-95,plasma,155,600);
  art.strike(3,tx,ty-95,1100,965,finish);
  target(opponent,tx+hit*15,ty-hit*14,-.10-hit*.18-ease((t-321)/30)*1.44);
  ctx.restore();flash('160,221,255',Math.max(hit*.07,land*.06,finish*.19));bands(t,'#08111e');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){art.strike(0,x,y,185+time*5,163,1-time/KurabeLimitProfile.contactHold*.6,0,face);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

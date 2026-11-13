"use strict";

const SakunaLimitVFX=(()=>{
 const {assets,ease,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=SakunaLimitProfile;
 const art=assets('sakuna',['cutin','court','poses','swing','finish','props','effects']);
 const atlases=['poses','swing','finish'];
 const hook={x:1120,y:250};
 const shots=[
  [0,523,746,1065,731,796,417,.93,0,1],
  [30,523,746,1065,731,796,417,.93,0,1],
  [56,882,711,1138,683,1010,407,.88,-.017,2],
  [81,926,672,1140,703,1039,387,.86,-.019,4],
  [103,967,589,1167,634,1068,353,.83,-.032,5],
  [126,1167,609,1368,603,1255,365,.81,-.016,3],
  [146,1392,497,1568,497,1458,337,.78,.028,6],
  [163,1494,417,1611,539,1530,305,.76,.032,6],
  [184,1494,492,1670,564,1572,342,.77,.009,7],
  [202,1329,594,1483,581,1398,365,.82,-.027,7],
  [222,1219,576,1025,609,1142,367,.82,-.035,-8],
  [253,1084,487,962,467,1058,318,.81,.024,-9],
  [271,983,424,1189,586,1101,323,.77,.027,10],
  [288,1110,370,1402,668,1275,338,.74,.017,9],
  [311,1269,508,1518,722,1382,390,.75,-.021,11],
  [333,1448,748,1671,704,1534,424,.73,-.027,12],
  [357,1448,748,2020,490,1703,386,.67,0,12],
  [382,1448,748,2236,302,1788,351,.62,0,1]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function tether(t,x,y,tx,ty){
  const hooked=ease((t-74)/16)*(1-ease((t-165)/18));
  const grabbed=ease((t-176)/8)*(1-ease((t-224)/13));
  if(hooked===0&&grabbed===0)return;
  const endX=grabbed>0?tx:hook.x;
  const endY=grabbed>0?ty-108:hook.y;
  const startY=y-179;
  const strength=Math.max(hooked,grabbed);
  ctx.save();ctx.globalAlpha*=strength;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x,startY);
  ctx.bezierCurveTo(x+(endX-x)*.29,startY-65,endX-(endX-x)*.24,endY+36,endX,endY);
  ctx.strokeStyle='#ad7040';ctx.lineWidth=18;ctx.stroke();
  ctx.strokeStyle='#fff3ce';ctx.lineWidth=11;ctx.stroke();
  ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const finish=pulse(t,333,4,24);
  frameClip();
  ctx.fillStyle='#473e30';ctx.fillRect(0,0,W,H);
  art.image('court',-89-cx*.018,-82-cy*.022,W+240,H+166);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.55,finish));
  art.grid('props',0,2,2,937,752,689);
  art.grid('props',1,2,2,1408,767,505);
  art.grid('props',2,2,2,1450+ease((t-332)/35)*416,762,613,{alpha:pulse(t,336,5,29)});
  art.glow(2,x,y-145,483,360,pulse(t,311,10,16)*.66);
  tether(t,x,y,tx,ty);
  art.strike(3,tx+67,ty-113,1077,676,finish);
  target(opponent,tx,ty-hit*10,-.12-hit*.39-ease((t-334)/35)*1.45,2.76);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,448,{face:Math.sign(signedPose)});
  for(const [beat,kind,angle,direction] of [[56,0,-.16,1],[103,1,-.37,1],[146,0,.18,1],[184,1,.16,1],[222,2,.3,-1],[253,2,-.48,1],[288,0,.55,1]]){
   art.strike(kind,tx,ty-108,kind===1?485:434,324,pulse(t,beat,3,10),angle,direction);
  }
  ctx.restore();
  flash('255,237,182',Math.max(hit*.055,finish*.16));bands(t,'#302b25');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,171+time*5,142+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

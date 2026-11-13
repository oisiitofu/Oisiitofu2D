"use strict";

const AdolLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=AdolLimitProfile;
 const art=assets('adol',['cutin','court','poses','motion','flame','props','effects']);
 const atlases=['poses','motion','flame'];
 const shots=[
  [0,523,751,1096,731,826,422,.96,0,1],
  [29,523,751,1096,731,826,422,.96,0,1],
  [55,844,748,1140,720,994,422,.89,-.024,2],
  [80,918,752,1260,732,1102,423,.87,.028,3],
  [101,1085,752,1360,721,1236,421,.85,.045,5],
  [129,1274,741,1531,708,1401,414,.83,.018,5],
  [154,1400,559,1601,665,1502,360,.82,-.052,6],
  [173,1503,494,1700,697,1601,342,.82,-.028,7],
  [194,1621,736,1841,722,1749,423,.83,.022,8],
  [215,1681,749,1952,730,1825,427,.83,0,9],
  [234,1742,749,2003,722,1870,423,.84,-.015,9],
  [264,1799,749,2076,716,1930,421,.84,.019,10],
  [291,1830,749,2178,718,2007,423,.82,-.012,11],
  [312,1825,748,2287,722,2067,427,.79,0,11],
  [331,1825,748,2332,714,2063,422,.72,.017,10],
  [353,1825,748,2590,486,2181,394,.67,0,10],
  [376,1825,748,2867,313,2259,384,.64,0,10]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));

 function shore(t,x,y){
  art.grid('props',2,2,2,1906,901,946,{alpha:ease((t-158)/18)});
  const ride=ease((t-76)/12)*(1-ease((t-164)/11));
  art.grid('props',1,2,2,x-164,y+61,567,{alpha:ride*.79});
  art.grid('props',0,2,2,x+21,y+53,429,{alpha:ride});
  art.grid('props',3,2,2,x-257,y+40,290,{alpha:ride*pulse(t,133,25,29)});
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,4,10)));
  const finish=pulse(t,331,4,25);
  frameClip();
  ctx.fillStyle='#173c46';ctx.fillRect(0,0,W,H);
  art.image('court',-84-cx*.014,-79-cy*.029,W+240,H+158);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.57,finish));
  shore(t,x,y);
  art.strike(2,1882,682,753,371,pulse(t,270,26,39)*.76);
  const beamX=mix(x+178,tx+46,.57),beamY=y-157;
  art.glow(3,x+174,beamY,386,266,pulse(t,319,22,15)*.69);
  art.strike(3,beamX,beamY,tx-x+313,388,finish);
  target(opponent,tx,ty-hit*13,-.13-hit*.35-ease((t-334)/34)*1.53,2.74);
  art.grid(atlases[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,467);
  for(const [beat,kind,angle] of [[55,0,.03],[101,1,-.04],[154,1,-.23],[194,0,.12],[234,0,-.24],[264,0,.24],[291,0,-.14]]){
   art.strike(kind,tx-26,ty-118,kind===1?472:351,kind===1?313:285,pulse(t,beat,3,11),angle);
  }
  ctx.restore();
  flash('255,229,181',Math.max(hit*.054,finish*.16));bands(t,'#123038');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(0,x,y,175+time*5,145+time*4,1-time/profile.contactHold*.63,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

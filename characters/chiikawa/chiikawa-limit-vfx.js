'use strict';
const ChiikawaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=ChiikawaLimitProfile;
 const art=assets('chiikawa',['cutin','court','poses','pole','finish','props','effects']);
 const sheets=['poses','pole','finish'];
 const shots=[
  [0,597,752,1112,747,856,424,.94,0,1],
  [29,682,752,1112,747,893,425,.93,0,1],
  [47,805,753,1145,729,974,421,.88,.019,2],
  [64,863,733,1178,697,1020,405,.85,-.024,3],
  [82,973,593,1214,679,1091,372,.83,.023,4],
  [101,1078,750,1288,710,1185,417,.83,-.019,5],
  [119,1081,675,1321,647,1202,378,.82,.018,6],
  [138,1184,681,1362,692,1273,402,.79,-.022,7],
  [157,1228,752,1418,710,1324,421,.80,.018,8],
  [180,1271,751,1494,746,1393,427,.77,0,9],
  [203,1344,751,1527,683,1433,402,.72,.024,10],
  [226,1344,752,1810,481,1533,378,.65,0,11],
  [261,1344,752,2162,267,1666,355,.61,0,12]
 ];
 const pulse=(t,at,lead,tail)=>ease((t-at+lead)/lead)*(1-ease((t-at-1)/tail));
 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,pose]=camera(shots,t);
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,7)));
  const finish=pulse(t,203,4,29);
  frameClip();ctx.fillStyle='#71586d';ctx.fillRect(0,0,W,H);
  art.image('court',-84-cx*.018,-87-cy*.078,W+241,H+178);
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.48,finish));
  art.grid('props',2,2,2,1492,797,536,{alpha:.74});
  art.grid('props',1,2,2,tx+97,ty+30,540,{alpha:Math.max(pulse(t,82,5,17),pulse(t,138,5,17))});
  art.grid('props',0,2,2,mix(x-420,x-242,ease((t-95)/89)),752,391,{alpha:pulse(t,180,85,72)});
  target(opponent,tx,ty-hit*11,-.1-hit*.36-ease((t-204)/40)*1.42,2.59);
  art.grid(sheets[Math.floor((pose-1)/4)],(pose-1)%4,2,2,x,y,458);
  for(const [beat,kind,angle] of [[47,0,.09],[64,1,-.16],[82,2,-.15],[101,1,.13],[119,2,-.21],[138,0,.16],[157,1,.07]]){
   art.strike(kind,tx-33,ty-99,kind===2?500:430,317,pulse(t,beat,3,8),angle);
  }
  art.grid('props',3,2,2,tx+136,ty+54,535,{alpha:finish});
  art.strike(3,tx+97,ty-93,950,632,finish,.09);
  ctx.restore();flash('255,232,247',Math.max(hit*.044,finish*.16));bands(t,'#463744');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(1,x,y,169+time*5,141+time*4,1-time/profile.contactHold*.66,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

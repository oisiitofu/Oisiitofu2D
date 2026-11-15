'use strict';

const DietrichLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('dietrich',['cutin','effects','citadel','marks']);
 const shots=[
  [0,433,672,1120,671,777,432,.93,0,0],[31,702,672,1120,671,911,429,.96,0,41],
  [45,908,671,1112,654,1010,432,1.01,.019,8],[63,1219,522,1120,606,1170,373,.93,-.026,-46],
  [82,1554,431,1499,573,1517,352,.88,.015,-45],[102,1073,321,1327,570,1200,315,.84,-.021,45],
  [122,831,514,1092,614,961,387,.9,.026,46],[142,1049,672,1278,640,1164,426,.97,-.022,11],
  [172,736,671,1275,668,1006,431,.87,0,43],[193,772,517,1274,665,1023,394,.85,-.019,45],
  [208,927,581,1279,642,1103,414,.96,.03,47],[224,1009,666,1473,477,1241,401,.85,.01,40],
  [244,1035,671,1884,302,1432,395,.79,0,0]
 ];
 const seals=[{x:1505,y:655,hit:82},{x:1042,y:663,hit:122},{x:1280,y:670,hit:142}];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));

 function draw({attacker,target:opponent,face,time}){
  const t=DietrichLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...DietrichLimitProfile.combo.keys()];
  const impact=Math.max(...hits.map(h=>pulse(t,h,4,9))),finish=pulse(t,208,5,24);
  frameClip();
  const width=W+355;
  art.image('citadel',-(width-W)*.49-(cx-1080)*.12,-98-(cy-416)*.12,width,width*9/16);
  ctx.fillStyle='rgba(25,9,40,'+(finish*.25)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.54,finish));
  for(const [i,seal] of seals.entries()){
   const active=ease((t-(41+i*34))/9)*(1-ease((t-215)/16));
   const flare=pulse(t,seal.hit,6,12);
   art.grid('marks',0,2,1,seal.x,seal.y+99,360+72*flare,{anchorY:.53,alpha:active*(.67+.33*flare)});
   art.glow(1,seal.x,seal.y-84,292,221,flare*.46,-.2);
   const h=[201,205,208][i],eruption=pulse(t,h,4,20),rise=ease((t-h+4)/14);
   const height=[408,509,690][i]+rise*123;
   art.strike(3,seal.x,seal.y-height*.42,273+rise*188,height,eruption,[.29,-.33,.06][i]);
   art.glow(3,seal.x,seal.y-height*.43,331+rise*222,height*1.06,eruption*.35,[.29,-.33,.06][i]);
  }
  const dust=ease((t-208)/17);
  art.grid('marks',1,2,1,1320+dust*123,661,590+dust*313,{anchorY:.6,alpha:finish*.74});
  const sprite={...attacker,x,y,face:Math.sign(pose||1),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose),3.15);
  target(opponent,tx,ty-impact*13,-.12-impact*.37-ease((t-209)/25)*1.38,2.54);
  for(const [i,h] of hits.entries()){
   art.strike([0,1,2,0,2,1][i],tx,ty-119,409+i*15,318,pulse(t,h,4,9),
    [-.21,.32,-.61,.48,-.23,.28][i],Math.sign(tx-x));
  }
  art.strike(2,1279+dust*86,535,374+dust*172,318,pulse(t,208,2,10),-.27);
  art.glow(2,1280+dust*102,543,483+dust*258,353,pulse(t,211,4,16)*.42,.24);
  ctx.restore();
  flash('220,147,255',Math.max(impact*.1,finish*.2));
  bands(t,'#1c1628');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time}){art.strike(0,x,y,169+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

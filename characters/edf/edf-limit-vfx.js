'use strict';
const EdfLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('edf',['cutin','court','poses','effects','barga']);
 const shots=[
  [0,426,653,943,627,698,441,1.13,.012,0],
  [58,474,653,961,626,725,432,1.03,-.009,0],
  [80,453,653,997,614,747,416,.95,.014,1],
  [103,441,653,1024,610,770,400,.90,-.016,2],
  [146,421,653,1069,603,804,385,.81,.018,2],
  [181,404,653,1096,599,800,359,.75,-.012,2],
  [210,401,653,1123,430,830,360,.77,.018,3],
  [226,396,653,1413,414,978,396,.83,-.017,3],
  [251,408,653,1728,208,983,421,.85,0,2]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=EdfLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=pulse(t,210,216,220,239);
  const flinch=Math.max(...Array.from(EdfLimitProfile.combo.keys(),hit=>pulse(t,hit-1,hit,hit+2,hit+8)));
  const barga=pulse(t,169,200,235,251);
  frameClip();ctx.fillStyle='#31383a';ctx.fillRect(0,0,W,H);art.image('court',-76-t*.12,-55,W+181,H+116);
  world(cx,cy,z,roll,face,t,Math.max(impact,flinch*.59));
  if(barga>0)art.grid('barga',t<212?0:1,2,1,672+ease((t-201)/16)*133,648+130*(1-barga),674,{alpha:barga});
  art.grid('poses',pose,2,2,x,y,297);
  target(opponent,tx+flinch*18,ty-flinch*26,-.08-flinch*.18-ease((t-216)/28)*1.35);
  for(const hit of [44,51,59]){
   const progress=ease((t-hit+5)/5);
   art.strike(0,mix(x+132,tx-63,progress),mix(y-196,ty-113,progress),270,86,pulse(t,hit-5,hit-2,hit,hit+4));
  }
  const rocket=ease((t-72)/11);
  art.strike(1,mix(x+115,tx-35,rocket),mix(y-210,ty-108,rocket),325,145,pulse(t,72,75,83,87),.17);
  for(const [hit,offset] of [[83,0],[117,-117],[132,82],[147,-55],[163,27]]){
   const blast=pulse(t,hit-2,hit,hit+4,hit+16);
   if(hit!==83){
    const drop=ease((t-hit+9)/9);
    art.strike(1,tx+offset+190*(1-drop),ty-131-340*(1-drop),214,99,pulse(t,hit-10,hit-7,hit,hit+1),2.06);
   }
   art.strike(2,tx+offset,ty-96,244+128*blast,183+158*blast,blast);
  }
  art.strike(3,1173,511,492+572*impact,305+285*impact,impact);
  art.strike(2,tx-67,ty-91,244,195,pulse(t,213,216,218,224));
  ctx.restore();flash('255,218,171',Math.max(impact*.19,flinch*.11));bands(t,'#292827');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/11)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,158+time*6,97,1-time/EdfLimitProfile.contactHold*.6,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

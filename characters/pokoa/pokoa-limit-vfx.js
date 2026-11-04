'use strict';
const PokoaLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('pokoa',['cutin','court','poses','effects']);
 const shots=[
  [0,470,649,1001,627,723,429,1.10,.012,0],
  [74,506,649,1000,615,752,417,1.04,-.016,1],
  [109,482,649,1035,618,752,420,.98,.014,2],
  [126,479,650,1043,606,761,368,.78,-.021,3],
  [168,566,641,1107,575,819,390,.84,.018,3],
  [189,624,623,1213,491,870,395,.89,-.018,3],
  [213,581,649,1451,338,920,428,.88,.012,0],
  [246,553,649,1711,167,930,432,.87,0,0]
 ];
 const pulse=(t,a,b,c,d)=>ease((t-a)/(b-a))*(1-ease((t-c)/(d-c)));
 function draw({target:opponent,face,time}){
  const t=PokoaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const change=pulse(t,100,115,126,140),jet=pulse(t,84,93,95,104);
  const wave=pulse(t,136,145,170,179),crest=pulse(t,169,186,193,222);
  const flinch=Math.max(...Array.from(PokoaLimitProfile.combo.keys(),frame=>pulse(t,frame-1,frame,frame+2,frame+8)));
  frameClip();ctx.fillStyle='#263d4a';ctx.fillRect(0,0,W,H);art.image('court',-72-t*.12,-52,W+172,H+112);
  world(cx,cy,z,roll,face,t,Math.max(crest,flinch*.46));
  art.glow(2,x,y-149,469+change*210,440,change);
  art.strike(3,mix(x+142,tx-48,ease((t-132)/41)),ty-112,423+wave*235,221+wave*152,wave*.84);
  art.grid('poses',pose,2,2,x,y,pose===3?408:288,{alpha:1-change*.31});
  target(opponent,tx+flinch*21,ty-flinch*19,-.12-flinch*.21-ease((t-185)/41)*1.49);
  for(const [start,hit,offset] of [[44,54,0],[58,68,-45]]){
   const flight=ease((t-start)/(hit-start));
   art.strike(0,mix(x+100,tx+7,flight),mix(y-140+offset,ty-101,flight),232,172,pulse(t,start,start+3,hit,hit+7),offset*.006);
  }
  art.strike(1,mix(x+105,tx-55,ease((t-84)/9)),ty-107,331,151,jet);
  art.strike(1,tx+5,ty-95,155,111,flinch*.72,-.26);
  art.strike(3,1175,437,455+crest*608,287+crest*295,crest,-.12);
  ctx.restore();flash('183,238,255',Math.max(crest*.23,change*.15));bands(t,'#243143');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,131+time*6,109,1-time/PokoaLimitProfile.contactHold*.6,-.09*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

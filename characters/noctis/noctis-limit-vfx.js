'use strict';

const NoctisLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('noctis',['cutin','effects','court','armory','finish'],{revision:3});
 const shots=[
  [0,409,671,1036,670,723,428,.93,0,1],[34,583,671,1036,670,813,429,.96,-.01,13],
  [45,574,670,1036,669,812,429,.96,0,14],[46,844,651,1047,664,945,426,.99,.022,7],
  [64,920,628,1113,625,1017,412,.96,-.017,9],[78,914,626,1142,597,1028,411,.88,0,14],
  [81,914,626,1143,586,1028,411,.88,0,14],[82,1278,337,1143,586,1210,298,.87,.024,-12],
  [102,1241,526,1134,590,1188,366,.94,-.018,-17],[119,1225,520,1087,577,1156,365,.88,0,-14],
  [121,1225,520,1087,577,1156,365,.88,0,-14],[122,729,474,1087,577,929,351,.9,.023,11],
  [142,836,601,1118,629,977,414,.95,-.018,7],[168,747,671,1148,656,945,430,.86,0,1],
  [185,797,671,1167,646,982,419,.96,-.017,13],[195,884,635,1184,632,1034,403,.99,.024,9],
  [205,963,619,1327,546,1145,387,.87,.008,17],[219,955,653,1557,399,1227,389,.79,0,17],
  [232,944,673,1697,317,1265,406,.76,0,1]
 ];
 const warps=[[46,662,570,874,529,0],[82,986,506,1272,211,2],[122,1153,398,732,326,1]];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function blade(slot,x,y,angle,size,alpha){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);
  art.grid('armory',slot,2,2,0,0,size,{anchorY:.5,alpha});
  ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=NoctisLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...NoctisLimitProfile.combo.keys()],hit=Math.max(...hits.map(h=>pulse(t,h,3,9)));
  const finish=pulse(t,195,2,16),spread=ease((t-195)/19);
  const focusX=1184,focusY=514;
  frameClip();
  const width=W+350;
  art.image('court',-(width-W)*.5-(cx-1010)*.13,-99-(cy-398)*.14,width,width*9/16);
  ctx.fillStyle='rgba(4,12,37,'+pulse(t,195,25,29)*.38+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(hit*.51,finish));
  for(const [h,sx,sy,ex,ey,slot] of warps){
   const flight=ease((t-h+12)/12);
   const angle=Math.atan2(ey-sy,ex-sx),length=Math.hypot(ex-sx,ey-sy);
   blade(slot,mix(sx,ex,flight),mix(sy,ey,flight),angle,196,pulse(t,h,12,5));
   art.glow(2,mix(sx,ex,.5),mix(sy,ey,.5),length+147,208,pulse(t,h,3,9)*.74,angle);
   art.strike(1,ex,ey,279,383,pulse(t,h,2,8),angle+.8);
  }
  art.strike(2,focusX+126+spread*158,626,685+spread*351,245,pulse(t,201,4,25),-.04,1,'finish');
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.16);
  target(opponent,tx,ty-hit*12,-.08-hit*.34-ease((t-196)/27)*1.38,2.56);
  for(const [i,h] of hits.entries()){
   const slot=i%2===0?0:2;
   const direction=i===2||i===3?-1:1;
   art.strike(slot,tx-16,ty-118,428,326,pulse(t,h,3,9),[-.25,.44,1.19,-.62,.77,-.2][i],slot===0?-direction:direction);
  }
  const converge=ease((t-181)/14),gathering=pulse(t,193,29,7);
  for(let i=0;i<9;i++){
   const a=i*Math.PI*2/9+t*.031*(1-converge);
   const startX=x+Math.cos(a)*329,startY=y-163+Math.sin(a)*232;
   const px=mix(startX,focusX,converge),py=mix(startY,focusY,converge);
   const angle=Math.atan2(focusY-startY,focusX-startX);
   blade(i%4,px,py,angle,188,gathering);
  }
  art.strike(0,focusX+70+spread*140,focusY-20-spread*54,615+spread*370,378+spread*90,finish,-.41,1,'finish');
  art.strike(1,focusX+161+spread*231,focusY-36,590+spread*356,451,pulse(t,197,3,18),-.13,1,'finish');
  art.strike(3,focusX,focusY,278+spread*153,276,pulse(t,195,1,8),.09,1,'finish');
  ctx.restore();flash('173,228,255',Math.max(hit*.1,finish*.22));bands(t,'#121b37');
  portraitPanel(t,-29,(zoom,alpha)=>art.portrait(zoom,alpha));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,168+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

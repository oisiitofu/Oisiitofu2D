'use strict';
const ArusLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('arus',['cutin','effects','court','ledge'],{revision:2});
 const shots=[
  [0,447,670,1006,670,729,431,.97,0,0],[33,668,670,1006,670,837,430,.98,0,20],
  [45,830,669,1007,651,920,432,1.02,.018,18],[63,877,668,1059,625,968,415,.97,-.02,6],
  [82,986,510,1133,573,1060,359,.91,.025,45],[102,1134,399,1197,532,1165,315,.88,-.021,13],
  [121,1352,521,1166,570,1261,372,.93,.02,-16],[141,1218,657,1033,634,1125,422,.98,-.018,-43],
  [160,1202,670,966,640,1084,432,.88,0,-47],[193,1202,670,957,628,1079,426,.96,.021,-42],
  [226,1200,670,393,347,909,408,.77,0,-1]
 ];
 const pulse=(t,h,lead,tail)=>ease((t-h+lead)/lead)*(1-ease((t-h-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=ArusLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...ArusLimitProfile.combo.keys()],shock=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,193,5,25),charge=pulse(t,176,18,11);
  frameClip();
  const width=W+362;
  art.image('court',-(width-W)*.5-(cx-1010)*.12,-99-(cy-413)*.14,width,width*9/16);
  world(cx,cy,z,roll,face,t,Math.max(shock*.52,finish));
  const stepping=ease((t-47)/19)*(1-ease((t-110)/15));
  art.image('ledge',910,508,153,38,stepping);
  const spread=ease((t-193)/18);
  art.glow(2,x-63,y-300,389,661,charge*.76);
  art.glow(3,tx-151*spread,ty-130,686+spread*478,464,finish*.66,-.12,-1);
  art.strike(3,tx-84-150*spread,ty-123,614+spread*468,421+spread*93,finish,-.08,-1);
  const sprite={...attacker,x,y,face:pose<0?-1:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose),3.18);
  target(opponent,tx,ty-shock*13,-.12-shock*.33+ease((t-193)/25)*1.4,2.58);
  for(const [i,h] of hits.entries()){
   const slot=[1,0,0,0,2,0][i],direction=i>=4?-1:1;
   art.strike(slot,tx+6,ty-115,388+i*19,314,pulse(t,h,4,9),[0,-.43,-.82,.79,.33,-.2][i],slot===0?-direction:direction);
  }
  art.strike(2,x-70,y-285,301,572,pulse(t,190,7,10));
  art.strike(1,tx+15,ty-95,299+spread*144,238,pulse(t,193,2,11),.12);
  ctx.restore();flash('255,246,180',Math.max(shock*.11,finish*.23));bands(t,'#172c38');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(1,x,y,168+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

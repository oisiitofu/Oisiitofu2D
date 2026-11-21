'use strict';
const ArusLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('arus',['cutin','effects','court','ledge','finish'],{revision:3});
 const shots=[
  [0,447,670,1006,670,729,431,.97,0,0],[33,668,670,1006,670,837,430,.98,0,20],
  [45,830,669,1007,651,920,432,1.02,.018,18],[63,877,668,1059,625,968,415,.97,-.02,6],
  [82,986,510,1133,573,1060,359,.91,.025,45],[102,1134,399,1197,532,1165,315,.88,-.021,13],
  [121,1352,521,1166,570,1261,372,.93,.02,-16],[141,1218,657,1033,634,1125,422,.98,-.018,-43],
  [160,1202,670,966,640,1084,432,.88,0,-47],[184,1190,670,960,636,1071,423,.94,-.013,-47],
  [193,1127,657,957,628,1044,413,.97,.021,-42],[204,1114,670,782,529,985,402,.85,.008,-43],
  [217,1121,670,529,400,915,406,.78,0,-47],[226,1131,670,393,347,886,408,.77,0,-1]
 ];
 const pulse=(t,h,lead,tail)=>ease((t-h+lead)/lead)*(1-ease((t-h-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=ArusLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...ArusLimitProfile.combo.keys()],shock=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,193,2,18),charge=pulse(t,176,18,11);
  frameClip();
  const width=W+362;
  art.image('court',-(width-W)*.5-(cx-1010)*.12,-99-(cy-413)*.14,width,width*9/16);
  ctx.fillStyle='rgba(14,28,54,'+pulse(t,192,22,28)*.47+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(shock*.52,finish));
  const stepping=ease((t-47)/19)*(1-ease((t-110)/15));
  art.image('ledge',910,508,153,38,stepping);
  const spread=ease((t-193)/18);
  const focusX=957,focusY=510;
  art.strike(1,x-70,y-295,223,568,pulse(t,186,10,7),0,1,'finish');
  art.glow(2,x-63,y-300,319,591,charge*.41);
  art.strike(2,focusX-105-spread*170,638,685+spread*514,249+spread*87,pulse(t,198,4,23),0,1,'finish');
  const sprite={...attacker,x,y,face:pose<0?-1:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose),3.18);
  target(opponent,tx,ty-shock*13,-.12-shock*.33+ease((t-193)/25)*1.4,2.58);
  for(const [i,h] of hits.entries()){
   const slot=[1,0,0,0,2,0][i],direction=i>=4?-1:1;
   art.strike(slot,tx+6,ty-115,388+i*19,314,pulse(t,h,4,9),[0,-.43,-.82,.79,.33,-.2][i],slot===0?-direction:direction);
  }
  art.strike(0,focusX-70-spread*181,focusY-14-spread*21,607+spread*410,389+spread*105,finish,.10,1,'finish');
  art.strike(3,focusX,focusY,234+spread*98,233,pulse(t,193,1,8),.12,1,'finish');
  ctx.restore();flash('255,246,180',Math.max(shock*.11,finish*.23));bands(t,'#172c38');
  portraitPanel(t,29,(zoom,alpha)=>art.portrait(zoom,alpha));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(1,x,y,168+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';

const HanaLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('hanajs',['cutin','effects','forge','parts'],{revision:2});
 const portraits=HanaKit.forms.slice(1).map(id=>assets(id,['cutin'],{revision:2}));
 const load=()=>Promise.all([art.load(),...portraits.map(portrait=>portrait.load())]);
 const shots=[
  [0,443,672,1094,670,769,430,.94,0,0],[34,708,672,1094,670,901,432,.97,0,12],
  [46,891,664,1101,659,996,429,1,.017,6],[64,962,632,1171,619,1066,407,.96,-.018,9],
  [83,1055,490,1243,564,1149,362,.9,.023,45],[103,1434,347,1274,545,1354,309,.85,-.024,-15],
  [123,1397,483,1214,551,1305,366,.89,.021,-13],[143,1013,557,1158,606,1085,391,.93,-.019,9],
  [167,864,637,1213,643,1039,423,.87,0,46],[197,1015,411,1267,583,1141,337,.85,-.02,43],
  [211,1147,517,1345,613,1241,378,.96,.023,45],[246,1151,672,1840,335,1441,402,.75,0,0]
 ];
 const pulse=(t,h,l,r)=>ease((t-h+l)/l)*(1-ease((t-h-2)/r));
 function draw({attacker,target:opponent,face,time}){
  const t=HanaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...HanaLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,211,5,25),shift=Math.max(pulse(t,72,4,9),pulse(t,111,4,9),pulse(t,243,4,7));
  const startJob=HanaKit.index(attacker);
  const middleJob=startJob===1?0:1;
  const job=t<72||t>=243?startJob:t<111?middleJob:2;
  const id=HanaKit.forms[job];
  frameClip();
  const width=W+342,height=width*9/16;
  const ground=H*.51+(674-cy)*z;
  art.image('forge',-(width-W)*.51-(cx-1080)*.13,Math.min(-7,ground-height*.79),width,height);
  ctx.fillStyle='rgba(35,12,37,'+(finish*.23)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.57,finish));
  const sign=pose<0?-1:1,index=Math.abs(pose);
  art.grid('parts',1,2,1,x,y-124,434,{anchorY:.5,alpha:shift*.94});
  const thrust=Math.max(pulse(t,83,9,13),pulse(t,103,7,11),pulse(t,202,12,11));
  ctx.save();ctx.translate(x-sign*125,y-56);ctx.rotate(sign*.28);
  art.grid('parts',0,2,1,0,0,226,{anchorY:.5,alpha:thrust*.92,face:sign});
  ctx.restore();
  const charge=pulse(t,205,10,5),launch=ease((t-211)/17),originX=1168,originY=415;
  art.glow(2,x+86,y-99,342,281,charge*.79,.54);
  const angle=.27-launch*.17,lanceWidth=713+launch*707,lanceX=originX+lanceWidth*.35;
  art.glow(3,lanceX+56,originY+Math.sin(angle)*lanceWidth*.35,lanceWidth*1.1,524,finish*.48,angle);
  art.strike(3,lanceX,originY+Math.sin(angle)*lanceWidth*.35,lanceWidth,359+launch*166,finish,angle);
  const sprite={...attacker,characterId:id,character:CharacterData[id],x,y,
   face:sign*(HanaKit.flip({characterId:id},index)?-1:1),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,index,3.13);
  target(opponent,tx,ty-impact*13,-.1-impact*.37-ease((t-212)/27)*1.34,2.54);
  for(const [i,h] of hits.entries()){
   art.strike([0,0,1,1,2,2][i],tx-12,ty-114,399+i*15,323,pulse(t,h,4,9),
    [-.28,.48,-.76,.29,.58,-.19][i],Math.sign(tx-x));
  }
  art.strike(0,tx+41,ty-131,281+launch*211,235,pulse(t,211,2,10),.27);
  art.glow(2,tx+170,ty-163,440+launch*254,384,pulse(t,217,5,13)*.33,.61);
  ctx.restore();flash('255,185,228',Math.max(impact*.12,shift*.19,finish*.22));bands(t,'#231d38');
  (startJob===0?art:portraits[startJob-1]).portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,168+time*4,146,1-time/23);}
 return {load,get prepared(){return art.prepared&&portraits.every(portrait=>portrait.prepared);},draw,drawContact};
})();

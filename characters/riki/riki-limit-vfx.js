'use strict';
const RikiLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('riki',['cutin','effects','forest','props'],{revision:2});
 const shots=[
  [0,476,671,1082,669,779,430,.94,0,0],[33,718,671,1082,669,900,432,.96,-.013,15],
  [47,883,671,1102,658,992,434,1,.018,9],[64,836,532,1153,628,994,375,.91,-.025,13],
  [82,1017,491,1231,583,1124,354,.89,.025,8],[102,1116,670,1300,631,1208,434,.93,-.019,17],
  [122,1238,631,1410,583,1324,399,.94,.024,19],[142,1222,545,1482,589,1352,366,.89,-.02,16],
  [170,1491,179,1482,660,1486,322,.72,0,16],[187,1452,356,1480,663,1466,388,.82,.009,10],
  [198,1456,671,1504,650,1480,432,.96,.024,11],[212,1391,651,1668,501,1525,411,.87,.013,6],
  [233,1440,671,2049,323,1710,401,.77,0,0]
 ];
 const pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=RikiLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...RikiLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,198,5,24);
  frameClip();
  const width=W+345;
  const height=width*9/16,ground=H*.51+(674-cy)*z;
  art.image('forest',-(width-W)*.48-(cx-1060)*.11,Math.min(-6,ground-height*.841),width,height);
  ctx.fillStyle='rgba(18,45,49,'+(finish*.21)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.61,finish));
  const rollTrail=pulse(t,122,11,9);
  art.grid('props',1,2,1,x-106,y-82,235,{anchorY:.5,alpha:rollTrail});
  const rise=pulse(t,168,18,17),reach=ease((t-198)/18);
  const balloonX=x+91+Math.sin(t*.18)*17,balloonY=y-99-ease((t-153)/19)*49;
  art.grid('props',0,2,1,balloonX,balloonY,172,{alpha:rise});
  const landingX=1504,landingY=674;
  art.strike(3,landingX+reach*96,landingY-139-reach*42,mix(586,1136,reach),mix(324,471,reach),finish,.08);
  art.glow(3,landingX+reach*114,landingY-143,677+reach*522,398,finish*.26,.08);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.16);
  target(opponent,tx,ty-impact*14,-.11-impact*.37-ease((t-199)/27)*1.35,2.56);
  for(const [i,h] of hits.entries())art.strike([0,1,2,0,0,0][i],tx-16,ty-113,393+i*16,308,pulse(t,h,4,9),[.1,-.55,.37,-.77,.73,-.27][i]);
  art.strike(0,landingX-50,landingY-87,235+reach*138,181,pulse(t,198,2,8),.51);
  ctx.restore();flash('255,238,175',Math.max(impact*.1,finish*.19));bands(t,'#223529');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,169+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

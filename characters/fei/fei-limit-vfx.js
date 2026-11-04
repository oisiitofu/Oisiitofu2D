'use strict';
const FeiLimitVFX=(()=>{
 const {assets,ease,unit,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('fei',['cutin','court','poses','gear','effects']);
 const shots=[
  [0,553,654,851,619,703,453,1.19,-.038,0],
  [37,614,649,871,621,749,431,1.12,.028,0],
  [55,683,619,909,573,776,417,1.15,-.055,1],
  [68,729,617,977,578,818,429,1.08,.046,2],
  [91,521,408,1005,599,754,361,.95,-.043,3],
  [107,468,369,1014,605,735,348,.86,.022,3],
  [124,468,388,1014,605,744,407,.88,.029,3],
  [149,486,414,1014,593,758,390,.94,-.03,3],
  [169,469,428,1011,587,747,387,.94,-.016,3],
  [182,533,456,1012,578,803,395,.97,.036,3],
  [195,550,467,1209,484,841,396,1.01,-.037,3],
  [223,532,525,1520,257,858,416,.94,.019,3],
  [263,516,644,1740,176,866,446,.94,0,4]
 ];
 const gearShots=[
  [93,465,167,646,0],[121,470,658,658,0],[143,497,645,669,1],
  [167,505,632,679,1],[181,549,628,688,2],[199,569,625,688,2],
  [220,529,539,635,3],[244,520,387,606,3],[263,519,274,586,3]
 ];
 function debris(t,x,y){
  const age=t-185,alpha=1-ease(age/56);
  if(age<0||!alpha)return;
  ctx.save();
  for(let i=0;i<40;i++){
   const angle=i*2.39996,velocity=7+i%7*2.1,length=4+i%6*2.7;
   ctx.save();ctx.translate(x+Math.cos(angle)*age*velocity+age*4,y+Math.sin(angle)*age*velocity*.53-age*2.1);
   ctx.rotate(angle+age*.083);ctx.globalAlpha=alpha*(.55+i%4*.12);
   ctx.fillStyle=['#fd6847','#643889','#ffd991'][i%3];
   ctx.beginPath();ctx.moveTo(length,0);ctx.lineTo(-length*.62,length*.33);
   ctx.lineTo(-length*.43,-length*.43);ctx.closePath();ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  const s=1.035+time*.001,opacity=ease(t/4)*(1-ease((t-23)/9));
  if(!opacity)return;
  ctx.save();ctx.beginPath();ctx.moveTo(0,128);ctx.lineTo(W,72);ctx.lineTo(W,670);ctx.lineTo(0,726);ctx.closePath();ctx.clip();
  art.portrait(s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=FeiLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const [gx,gy,height,gearIndex]=camera(gearShots,t);
  const arrival=ease((t-93)/13)*(1-ease((t-122)/21));
  const blast=ease((t-181)/7)*(1-ease((t-195)/29));
  frameClip();ctx.fillStyle='#190e23';ctx.fillRect(0,0,W,H);
  art.image('court',-113-t*.18,-106+ease((t-76)/55)*54,W+303,H+161);
  world(cx,cy,z,roll,face,t,Math.max(blast,arrival*.43));
  target(opponent,tx,ty,-.12-Math.sin(t*.17)*.12-ease((t-184)/33)*1.25);
  const gearOpacity=ease((t-100)/16)*(1-ease((t-223)/27));
  const onFoot=t<104?1-ease((t-92)/12):ease((t-233)/18);
  art.grid('poses',index,3,2,x,y,358,{alpha:onFoot});
  art.grid('gear',gearIndex,2,2,gx,gy,height,{alpha:gearOpacity,face:gearIndex===0||gearIndex===3?-1:1});
  art.glow(0,468,341,558+arrival*241,706,arrival*.81);
  for(const [at,angle] of [[40,-.12],[60,-.67]]){
   const hit=ease((t-at)/4)*(1-ease((t-at-3)/11));
   art.strike(3,tx-70,ty-91,173,135,hit*.61,angle);
  }
  const charge=ease((t-133)/34)*(1-ease((t-176)/9));
  const strike=ease((t-166)/15);
  const handX=gx+mix(153,267,strike),handY=gy-mix(343,293,strike);
  art.glow(1,handX,handY,154+charge*174,135+charge*154,charge*.99,t*.073);
  const pressure=ease((t-175)/7)*(1-ease((t-192)/25));
  art.strike(2,handX+227,handY+12,267+pressure*610,129+pressure*193,pressure*.99,.03);
  art.strike(3,1087,431,436+blast*635,269+blast*255,blast*.88);
  debris(t,1036,430);
  ctx.restore();flash('255,146,161',Math.max(blast*.19,arrival*.13));
  bands(t,'#120d20');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/FeiLimitProfile.contactHold;
  art.strike(3,x,y,141+49*p,131,1-p*.55,-.23,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
const PneumaLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('pneuma',['cutin','effects','orbit','prisms'],{revision:2});
 const shots=[
  [0,443,671,1116,669,780,435,.93,0,1],[31,661,612,1116,669,889,405,.96,0,3],
  [44,870,588,1122,651,996,410,.99,.022,7],[61,840,404,1175,602,1008,341,.89,-.02,16],
  [79,1188,279,1186,525,1187,311,.84,.026,9],[98,1401,448,1162,526,1282,352,.89,-.024,-14],
  [118,1260,478,1083,590,1172,376,.94,.02,-13],[138,845,389,1093,566,969,343,.9,-.02,44],
  [161,687,468,1163,619,925,389,.85,0,48],[184,738,370,1197,640,968,374,.83,0,47],
  [197,804,350,1202,630,1003,363,.93,.025,42],[210,1007,515,1356,573,1180,399,.88,.016,10],
  [232,1066,669,1757,322,1366,419,.76,0,1]
 ];
 const points=[[738,493],[944,303],[1242,172],[1449,378],[1240,442],[845,265]];
 const pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=PneumaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...PneumaLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,197,5,24);
  frameClip();
  const width=W+370;
  art.image('orbit',-(width-W)*.48-(cx-1030)*.14,-105-(cy-405)*.13,width,width*9/16);
  ctx.fillStyle='rgba(9,26,49,'+(finish*.3)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.51,finish));
  for(const [i,[px,py]] of points.entries()){
   const h=hits[i],travel=ease((t-h+17)/17),alpha=pulse(t,h,17,12);
   art.grid('prisms',0,2,1,mix(px,x+77,travel),mix(py,y-135,travel),160+travel*57,
    {anchorY:.5,alpha:alpha*.87,face:i%2?1:-1});
   art.glow(1,px,py,229,192,pulse(t,h-8,6,11)*.39,.54*i);
  }
  const charge=pulse(t,191,18,8),swell=ease((t-197)/15);
  for(let i=0;i<3;i++){
   const a=t*.069+i*Math.PI*2/3,reach=32+138*(1-ease((t-177)/18));
   art.grid('prisms',0,2,1,x+112+Math.cos(a)*reach,y-116+Math.sin(a)*reach*.63,114,
    {anchorY:.5,alpha:charge*.94});
  }
  art.glow(1,x+111,y-118,293,272,charge*.77,t*.041);
  const beamAngle=.74,originX=822,originY=166,beamWidth=744+swell*697;
  const along=beamWidth*.34,bx=originX+Math.cos(beamAngle)*along,by=originY+Math.sin(beamAngle)*along;
  art.glow(3,bx+48,by+13,beamWidth*1.07,438,finish*.41,beamAngle);
  art.strike(3,bx,by,beamWidth,330+swell*204,finish,beamAngle);
  art.grid('prisms',1,2,1,1202+swell*150,540,466+swell*317,{anchorY:.54,alpha:finish*.78});
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  const aim=ease((t-184)/13)*(1-ease((t-211)/16));
  ctx.save();ctx.translate(x+18,y-184);ctx.rotate(beamAngle*aim);ctx.translate(-x-18,184-y);
  drawSprite(sprite,1,Math.abs(pose)-1,3.12);
  ctx.restore();
  target(opponent,tx,ty-impact*14,-.1-impact*.35-ease((t-198)/27)*1.34,2.55);
  for(const [i,h] of hits.entries()){
   art.strike([0,1,2,1,0,2][i],tx-11,ty-116,419+i*12,323,pulse(t,h,4,9),
    [-.34,.48,.7,-.52,.37,-.27][i],Math.sign(pose));
  }
  art.strike(1,1205,509,314+swell*163,274,pulse(t,197,2,9),beamAngle);
  ctx.restore();flash('198,255,238',Math.max(impact*.1,finish*.23));bands(t,'#141f37');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,170+time*4,147,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';

const DragoonLimitVFX=(()=>{
 const art={}, assetNames=['poses','ground','sky','dragon','impact','cutin'];
 let preparation=null;
 function load(){
  return preparation??=Promise.all(assetNames.map(async name=>{
   const image=new Image();
   image.src='characters/dragoon/assets/limit-'+name+'.webp';
   await image.decode();
   art[name]=name==='impact'?splitImpacts(image):image;
  })).catch(error=>{preparation=null;throw error;});
 }
 function splitImpacts(image){
  return Array.from({length:4},(_,n)=>{
   const layer=document.createElement('canvas');layer.width=756;layer.height=500;
   const paint=layer.getContext('2d');
   paint.drawImage(image,n%2*768+6,Math.floor(n/2)*512+6,756,500,0,0,756,500);
   paint.globalCompositeOperation='destination-in';
   for(const [w,h] of [[756,0],[0,500]]){
    const edge=paint.createLinearGradient(0,0,w,h);
    for(const [at,alpha] of [[0,0],[.085,1],[.915,1],[1,0]])edge.addColorStop(at,'rgba(0,0,0,'+alpha+')');
    paint.fillStyle=edge;paint.fillRect(0,0,756,500);
   }
   return layer;
  });
 }
 const needsArt=(players,enabled)=>enabled&&players.some(p=>DragoonLimit.supports(p.character)||p.team?.some(DragoonLimit.supports));
 // Source rectangles and body anchors are independent of the length of the lance.
 const poses=[
  [0,76,520,256,.43,.92,.84],[547,48,543,284,.39,.92,.93],
  [1115,0,517,334,.42,.91,.72],[1642,0,530,315,.46,.87,.84],
  [82,360,388,352,.40,.91,.88],[564,350,475,374,.49,.61,.69],
  [1112,352,395,372,.58,.64,.57],[1659,341,419,383,.57,.93,.60]
 ];
 // Frame, dragoon and target foot positions, camera focus, zoom, roll, sprite.
 const shots=[
  [0,495,622,798,611,682,483,1.12,-.045,0],
  [25,475,622,795,612,676,470,1.25,-.024,0],
  [36,631,619,825,593,735,474,1.36,.055,1],
  [43,566,619,860,600,725,471,1.21,.012,0],
  [51,665,619,894,572,762,477,1.36,-.07,2],
  [59,606,620,889,566,740,466,1.16,-.01,0],
  [68,720,620,934,510,792,440,1.28,.07,1],
  [78,714,593,951,464,794,430,1.14,.025,3],
  [99,765,340,947,382,840,267,.98,-.09,3],
  [106,768,303,951,429,817,239,1.22,.08,4],
  [126,579,175,941,532,740,283,.97,-.115,4],
  [136,519,189,963,549,726,322,1.02,-.10,5],
  [152,865,523,1011,606,893,421,1.18,.14,5],
  [161,813,596,1011,620,877,481,1.06,.015,7],
  [173,789,339,1004,632,846,371,.87,-.095,4],
  [185,951,206,1004,632,918,276,.87,.04,6],
  [195,989,233,1004,632,968,308,.96,-.065,6],
  [203,989,620,1004,632,978,483,1.27,.08,6],
  [208,920,628,1105,524,977,482,.93,-.04,7],
  [233,918,631,1330,293,1020,463,.79,0,7]
 ];
 const impacts=[36,51,67,153,203], clamp01=n=>Math.max(0,Math.min(1,n));
 const blend=(a,b,t)=>a+(b-a)*t;
 const smooth=t=>t*t*(3-2*t);
 function cameraAt(t){
  const next=shots.findIndex(s=>s[0]>t);
  if(next<1)return shots.at(-1);
  const a=shots[next-1],b=shots[next],p=clamp01((t-a[0])/(b[0]-a[0]));
  return [t,...a.slice(1,9).map((v,i)=>blend(v,b[i+1],smooth(p))),p<.56?a[9]:b[9]];
 }
 function bitmap(name,x,y,w,h,alpha=1){
  const img=art[name];
  if(!img||alpha<=0)return;
  ctx.save();ctx.globalAlpha*=alpha;ctx.drawImage(img,x,y,w,h);ctx.restore();
 }
 function backdrop(t){
  const sky=smooth(clamp01((t-87)/18))*(1-smooth(clamp01((t-194)/12)));
  ctx.fillStyle='#06132c';ctx.fillRect(0,0,W,H);
  bitmap('ground',-85-Math.sin(t*.014)*45,-123,W+190,H+175);
  bitmap('sky',-70+Math.sin(t*.013)*36,-90+(t-145)*.34,W+150,H+180,sky);
  const vignette=ctx.createRadialGradient(W*.54,H*.53,190,W*.54,H*.53,825);
  vignette.addColorStop(0,'#06122d00');vignette.addColorStop(1,'#020617e3');
  ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
 }
 function fighter(x,y,index,alpha=1,size=235){
  const [sx,sy,w,h,anchorX,anchorY,bodyRatio]=poses[index],image=art.poses;
  if(!image)return;
  const k=size/(h*bodyRatio);
  ctx.save();ctx.globalAlpha*=alpha;
  ctx.drawImage(image,sx,sy,w,h,x-w*k*anchorX,y-h*k*anchorY,w*k,h*k);
  ctx.restore();
 }
 function targetSprite(target,x,y,t,impact){
  const sprite={...target,x,y,face:-1,attack:null,mode:'Tumble',state:'hit',inv:0,intangible:0,grounded:true};
  ctx.save();ctx.translate(x,y-75);ctx.rotate((t>203?-.65:.13)+impact*.26);ctx.translate(-x,75-y);
  drawSprite(sprite,1,pose(sprite),1.9);
  ctx.restore();
 }
 function stamp(index,x,y,w,h,alpha,angle=0){
  if(!art.impact||alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha*=alpha;ctx.globalCompositeOperation='screen';
  ctx.drawImage(art.impact[index],-w/2,-h/2,w,h);
  ctx.restore();
 }
 function drawContact({x,y,face,time}){
  const p=time/DragoonLimit.contactHold;
  ctx.save();ctx.translate(x,y);ctx.scale(face,1);
  stamp(0,0,0,110+p*42,73+p*32,1-p*.7,-.12);
  ctx.strokeStyle='#a9eaff';ctx.lineWidth=2.6;
  ctx.globalAlpha=(1-p)*.9;
  for(let i=0;i<8;i++){
   const a=i*Math.PI/4, r=12+p*35;
   ctx.beginPath();ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);
   ctx.lineTo(Math.cos(a)*(r+15),Math.sin(a)*(r+15));ctx.stroke();
  }
  ctx.restore();
 }
 function embers(t,x,y,strength){
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let n=0;n<48;n++){
   const a=n*2.39996,life=(t+n*17)%45/45,reach=life*(80+(n%11)*20)*(1+strength);
   const px=x+Math.cos(a)*reach,py=y+Math.sin(a)*reach*.58;
   ctx.globalAlpha=(1-life)*(.3+strength*.55);
   ctx.fillStyle=n%4?'#76cfff':'#f0f7ff';
   ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-12*Math.cos(a),py-9*Math.sin(a));ctx.lineTo(px-2,py+4);ctx.fill();
  }
  ctx.restore();
 }
 function speedLines(t,strength){
  if(strength<=0)return;
  ctx.save();ctx.strokeStyle='#9bcfff';ctx.globalAlpha=strength*.32;ctx.lineWidth=1.8;
  for(let n=0;n<34;n++){
   const a=n*2.39996,d=370+(n*41+t*13)%430;
   ctx.beginPath();ctx.moveTo(W*.51+Math.cos(a)*d,H*.50+Math.sin(a)*d*.7);
   ctx.lineTo(W*.51+Math.cos(a)*(d+120),H*.50+Math.sin(a)*(d+120)*.7);ctx.stroke();
  }
  ctx.restore();
 }
 function cutIn(t,time){
  const bar=36*smooth(clamp01(t/8));
  ctx.fillStyle='#020711';ctx.fillRect(0,0,W,bar);ctx.fillRect(0,H-bar,W,bar);
  if(t<26){
   const opacity=smooth(clamp01(t/7))*clamp01((27-t)/6);
   ctx.save();ctx.globalAlpha*=opacity;ctx.fillStyle='#060d23b8';ctx.fillRect(0,107,W,560);
   const scale=1+clamp01(time/45)*.05;
   bitmap('cutin',85+(26-t)*11-45*(scale-1),95,1335*scale,580*scale);
   ctx.restore();
  }
 }
 function draw({target,face,time}){
  const t=DragoonLimit.shotTime(time);
  const [,x,y,tx,ty,cx,cy,z,roll,index]=cameraAt(t);
  const last=impacts.findLast(f=>f<=t)??-100,age=t-last,shock=clamp01(1-age/13);
  ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();backdrop(t);
  const motion=Accessibility.shake,move=(t>=88&&t<154||t>=195&&t<205)?1:shock;
  speedLines(t,move*(.45+.55*motion));
  ctx.save();ctx.translate(W/2+Math.sin(t*2.13)*shock*13*motion,H*.49+Math.cos(t*2.6)*shock*9*motion);
  ctx.rotate(roll*(.55+.45*motion));ctx.scale(z*face,z);ctx.translate(-cx,-cy);
  if(t>=169&&t<=210){
   const strength=smooth(clamp01((t-169)/19))*clamp01((211-t)/12);
   const w=blend(610,1020,clamp01((t-172)/33)),dive=smooth(clamp01((t-194)/12));
   ctx.save();ctx.globalCompositeOperation='screen';
   bitmap('dragon',x-w*.82,y-278+dive*85,w,w*.667,strength*.92);
   ctx.restore();
  }
  if(t>=101&&t<151)stamp(1,x-80,y+45,315,210,.60, t<130?-1.35:0);
  if(t>=194&&t<204)stamp(1,x-38,y-150,660,275,.88,.91);
  targetSprite(target,tx,ty,t,shock);
  if(t>=29&&t<155&&move>.12)fighter(x-40,y+12,index,.18,222);
  fighter(x,y,index,1);
  if(last<100&&shock>0)stamp(0,tx-28,ty-97,300+100*(1-shock),170,shock*.92,last===51?-.74:.09);
  if(last===153&&shock>0)stamp(3,tx-82,ty+8,590,245,shock*.84);
  if(t>=203){
   const blast=clamp01(1-(t-203)/31);
   stamp(2,1004,379,560,560,blast*.97);
   stamp(3,1004,618,530+(t-203)*32,320,blast);
  }
  if(shock>0||t>=175)embers(t,t>=203?1004:tx,t>=203?606:ty-91,shock);
  ctx.restore();
  if(shock>0&&Accessibility.flash){ctx.fillStyle='rgba(164,219,255,'+(shock*.22*Accessibility.flash)+')';ctx.fillRect(0,0,W,H);}
  cutIn(t,time);
  const exit=clamp01((t-226)/8);if(exit>0){ctx.fillStyle='rgba(6,14,30,'+(exit*.55)+')';ctx.fillRect(0,0,W,H);}
  ctx.restore();
 }
 function hud(f,x,y){
  if(!DragoonLimit.enabled||!DragoonLimit.supports(f.characterId))return;
  const m=DragoonLimit.meter(f),ready=DragoonLimit.ready(f);
  ctx.fillStyle='#091427';ctx.fillRect(x+152,y+47,94,14);
  if(ready){
   ctx.save();
   const gold=ctx.createLinearGradient(0,y+48,0,y+60);
   gold.addColorStop(0,'#fff4aa');gold.addColorStop(.55,'#ffd258');gold.addColorStop(1,'#b96c17');
   ctx.fillStyle=gold;ctx.shadowBlur=9;ctx.shadowColor='#ffcc4d';ctx.fillRect(x+153,y+48,92,12);
   ctx.restore();
  }else if(!m?.used){
   ctx.fillStyle='#3968d4';ctx.fillRect(x+153,y+48,92*(m?.value||0)/DragoonLimit.threshold,12);
  }
  text(m?.used?'リミットブレイク 使用済み':ready?'MAX  攻撃＋必殺':'リミットブレイク',x+199,y+57,9,ready?'#2a1506':'#fff');
 }
 return {load,needsArt,draw,drawContact,hud,get prepared(){return assetNames.every(name=>!!art[name]);}};
})();

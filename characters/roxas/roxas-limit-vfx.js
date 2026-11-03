'use strict';

const RoxasLimitVFX=(()=>{
 const assets=['cutin','poses','city','dome','impact'],art={};
 let pending;
 function load(){
  return pending??=Promise.all(assets.map(async name=>{
   const image=new Image();image.src='characters/roxas/assets/limit-'+name+'.webp';
   await image.decode();art[name]=image;
  })).catch(error=>{pending=null;throw error;});
 }
 const cap=t=>Math.min(1,Math.max(0,t)),smooth=t=>{const p=cap(t);return p*p*(3-2*p);};
 const lerp=(a,b,t)=>a+(b-a)*t;
 // Camera time, hero feet, victim feet, look-at point, magnification, roll, pose.
 const shots=[
  [0,508,643,828,627,694,484,1.08,-.02,0],
  [19,522,643,828,627,688,459,1.21,-.04,0],
  [27,715,639,856,604,763,481,1.31,.06,1],
  [39,754,622,896,602,820,481,1.13,.018,1],
  [53,722,397,905,603,815,388,.98,-.084,2],
  [68,743,438,894,617,796,385,1.12,.055,3],
  [91,689,433,897,624,781,388,1.03,-.04,4],
  [112,670,442,900,615,815,416,1.12,.05,3],
  [129,657,440,907,620,817,418,1.10,-.036,3],
  [147,633,429,922,616,794,411,.97,.016,3],
  [164,610,438,921,620,746,415,.88,-.02,4],
  [177,659,446,924,629,786,428,1.1,-.035,4],
  [186,708,555,939,621,883,443,1.25,.081,5],
  [195,720,642,1040,564,841,483,1.01,-.021,5],
  [225,720,643,1320,300,871,464,.85,0,0]
 ];
 const beams=[
  [108,775,605,54],[112,902,622,94],[118,1040,606,58],
  [126,918,613,118],[135,816,620,64],[142,918,612,130],
  [150,1030,608,75],[186,934,624,290]
 ];
 function camera(t){
  const next=shots.findIndex(shot=>shot[0]>t);
  if(next<1)return shots[next===0?0:shots.length-1].slice(1);
  const a=shots[next-1],b=shots[next],p=smooth((t-a[0])/(b[0]-a[0]));
  return [...a.slice(1,9).map((v,i)=>lerp(v,b[i+1],p)),p<.58?a[9]:b[9]];
 }
 function image(name,x,y,w,h,alpha=1){
  if(alpha<=0||!art[name])return;
  ctx.save();ctx.globalAlpha*=alpha;ctx.drawImage(art[name],x,y,w,h);ctx.restore();
 }
 function stamp(n,x,y,w,h,alpha,angle=0){
  const im=art.impact;if(!im||alpha<=0)return;
  const iw=im.width/2,ih=im.height/2;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha*=alpha;ctx.globalCompositeOperation='screen';
  ctx.drawImage(im,n%2*iw+2,Math.floor(n/2)*ih+2,iw-4,ih-4,-w/2,-h/2,w,h);ctx.restore();
 }
 function hero(x,y,pose,opacity=1){
  const im=art.poses;if(!im)return;
  const sw=im.width/3,sh=im.height/2;
  const [anchorX,anchorY,size]=[[.48,.974,335],[.58,.915,326],[.55,.84,352],[.5,.957,345],[.5,.97,345],[.48,.915,351]][pose];
  const h=size,w=h*sw/sh;
  ctx.save();ctx.globalAlpha*=opacity;ctx.drawImage(im,pose%3*sw,Math.floor(pose/3)*sh,sw,sh,x-w*anchorX,y-h*anchorY,w,h);ctx.restore();
 }
 function opponent(target,x,y,shock,t){
  const sprite={...target,x,y,face:-1,attack:null,mode:'Tumble',state:'hit',inv:0,intangible:0,grounded:false};
  ctx.save();ctx.translate(x,y-65);ctx.rotate((t>=186?-.68:-.13)+shock*.26);ctx.translate(-x,65-y);
  drawSprite(sprite,1,pose(sprite),1.92);ctx.restore();
 }
 function sky(t){
  const p=smooth((t-50)/21)*(1-smooth((t-201)/23));
  ctx.fillStyle='#190e27';ctx.fillRect(0,0,W,H);
  image('city',-85-Math.sin(t*.016)*48,-120,W+185,H+128);
  image('dome',-92+Math.cos(t*.022)*36,-46,W+194,H+163,p);
  const shade=ctx.createRadialGradient(W*.56,H*.51,180,W*.52,H*.53,870);
  shade.addColorStop(0,'#1b153300');shade.addColorStop(1,'#100919bd');
  ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
 }
 function beam(x,y,width,t,hit,last){
  const age=t-hit;
  if(age<-13||age>21)return;
  const p=age<0?.55*smooth((age+13)/13):cap(1-age/(last?23:15));
  if(age<0){
   ctx.save();ctx.strokeStyle='#ffe0a3';ctx.lineWidth=1.8;ctx.globalAlpha=p;
   ctx.beginPath();ctx.ellipse(x,y,width*(.34+p*.28),width*.19,0,0,Math.PI*2);ctx.stroke();
   ctx.beginPath();ctx.moveTo(x,y-560);ctx.lineTo(x,y);ctx.stroke();ctx.restore();
   return;
  }
  const height=last?940:740;
  stamp(1,x,y-height*.46,width*2.5,height,p*(last?1:.82));
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=p*.91;
  const ray=ctx.createLinearGradient(x-width*.43,0,x+width*.43,0);
  ray.addColorStop(0,'#ffb95800');ray.addColorStop(.34,'#ffc87a66');ray.addColorStop(.49,'#fff9dc');ray.addColorStop(.56,'#ffffff');ray.addColorStop(.78,'#ffd59466');ray.addColorStop(1,'#ffb95800');
  ctx.fillStyle=ray;ctx.fillRect(x-width*.43,y-height,width*.86,height);
  ctx.restore();
  stamp(2,x,y-23,width*2.2,width*1.42,p);
  stamp(3,x,y+9,width*(1.5+age*.12),width*.66,p*.9);
 }
 function sparks(t,x,y,energy){
  if(energy<=0)return;
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<54;i++){
   const life=(t+i*13)%37/37,angle=i*2.399963,dist=life*(44+(i%13)*13)*(1+energy);
   ctx.save();ctx.translate(x+Math.cos(angle)*dist,y+Math.sin(angle)*dist*.54-life*48);ctx.rotate(angle);
   ctx.globalAlpha=(1-life)*energy;ctx.fillStyle=i%4?'#ffc476':'#fffcdf';
   ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(0,-2.8);ctx.lineTo(11,0);ctx.lineTo(0,2.8);ctx.closePath();ctx.fill();ctx.restore();
  }
  ctx.restore();
 }
 function seal(t,x,y,power){
  if(!power)return;
  ctx.save();ctx.translate(x,y);ctx.scale(1,.27);ctx.rotate(t*.012);
  ctx.globalAlpha=power;ctx.lineWidth=2.3;ctx.strokeStyle='#ffd69d';ctx.fillStyle='#a7642c20';
  for(const r of [118,145,187]){ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.stroke();}
  for(let n=0;n<12;n++){
   ctx.rotate(Math.PI/6);ctx.beginPath();ctx.moveTo(110,0);ctx.lineTo(157,-26);ctx.lineTo(187,0);ctx.lineTo(157,26);ctx.closePath();ctx.stroke();
  }
  ctx.restore();
 }
 function drawOpener(f){
  if(f.timer<8||f.timer>23)return;
  const age=f.timer-8;
  stamp(0,f.x+f.face*58,f.y-52,172,105,cap(1-age/18)*.82,f.face>0?-.13:.13);
 }
 function drawContact({x,y,time}){
  const p=time/RoxasLimitProfile.contactHold;
  stamp(0,x,y,126+36*p,97+14*p,1-p*.55,-.12);
  stamp(2,x,y,78+27*p,70+20*p,1-p,.17);
 }
 function cutin(t,time){
  const bar=33*smooth(t/6);ctx.fillStyle='#0d0616';ctx.fillRect(0,0,W,bar);ctx.fillRect(0,H-bar,W,bar);
  if(t>=29)return;
  const fade=smooth(t/7)*cap((29-t)/6);
  const k=1+cap(time/51)*.07;
  ctx.save();ctx.globalAlpha*=fade;ctx.beginPath();
  ctx.moveTo(-20,232);ctx.lineTo(W+20,77);ctx.lineTo(W+20,640);ctx.lineTo(-20,747);ctx.closePath();
  ctx.clip();ctx.fillStyle='#220f2f';ctx.fillRect(0,0,W,H);image('cutin',W*.5-W*k/2-22+t*1.4,H*.5-H*k/2,W*k,H*k);ctx.restore();
 }
 function draw({target,face,time}){
  const t=RoxasLimitProfile.shotTime(time);
  const [x,y,tx,ty,cx,cy,z,roll,index]=camera(t);
  const last=[27,112,126,142,186].findLast(at=>at<=t)??-100,shock=cap(1-(t-last)/16),shake=Accessibility.shake;
  ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();sky(t);
  ctx.save();ctx.translate(W*.5+Math.sin(t*2.11)*shock*16*shake,H*.51+Math.cos(t*1.7)*shock*12*shake);
  ctx.rotate(roll*(.45+.55*shake));ctx.scale(z*face,z);ctx.translate(-cx,-cy);
  const ring=smooth((t-68)/27)*(1-smooth((t-192)/28));
  seal(t,923,622,ring*.63);
  if(t>=61&&t<=179){
   const glow=smooth((t-61)/32)*(1-smooth((t-170)/10));
   stamp(3,x,y-120,290+18*Math.sin(t*.08),113,glow*.64,t*.012);
   sparks(t,x,y-147,glow*.54);
  }
  if(t>=23&&t<39)hero(x-52,y+3,index,.22);
  opponent(target,tx,ty,shock,t);hero(x,y,index);
  if(t>=25&&t<45)stamp(0,tx-29,ty-85,420,235,cap(1-(t-25)/20),-.1);
  for(const [at,bx,by,bw] of beams)beam(bx,by,bw,t,at,at===186);
  if(last>=0)sparks(t,t>=186?934:tx,t>=186?613:ty-72,shock);
  ctx.restore();
  if(shock&&Accessibility.flash){
   ctx.fillStyle='rgba(255,229,166,'+(shock*.18*Accessibility.flash)+')';ctx.fillRect(0,0,W,H);
  }
  cutin(t,time);
  const end=smooth((t-217)/9);
  if(end){ctx.fillStyle='rgba(18,8,29,'+end*.68+')';ctx.fillRect(0,0,W,H);}
  ctx.restore();
 }
 return {load,draw,drawContact,drawOpener,get prepared(){return assets.every(name=>!!art[name]);}};
})();

'use strict';
const MarukuLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('maruku',['cutin','court','poses','effects']);
 const shots=[
  [0,558,642,867,614,719,441,1.18,-.032,0],
  [45,552,599,947,578,747,419,1.08,.045,0],
  [67,498,550,992,575,749,398,.96,-.046,1],
  [94,465,534,1040,569,749,390,.93,.036,2],
  [117,463,540,1045,547,751,397,1.02,-.026,3],
  [135,582,544,1026,565,776,410,1.02,.033,4],
  [152,779,543,1016,553,818,402,.96,-.04,4],
  [176,796,538,816,475,808,379,.94,.055,4],
  [190,766,534,1018,486,825,386,1.03,-.039,4],
  [217,536,573,1390,298,865,409,.96,.019,5],
  [257,499,642,1763,183,878,442,.93,0,5]
 ];
 function halves(t,x,y,index){
  const open=ease((t-139)/25)*(1-ease((t-190)/24)),span=177*open;
  if(!open){art.grid('poses',index,3,2,x,y,365);return;}
  for(const sign of [-1,1]){
   const seam=x+span*sign;
   ctx.save();ctx.beginPath();
   ctx.rect(sign<0?seam-560:seam,0,560,900);ctx.clip();
   art.grid('poses',index,3,2,seam,y+open*29,365,{alpha:1-open*.93});ctx.restore();
  }
 }
 function orbit(t,x,y,openness){
  if(!openness)return;
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<40;i++){
   const cycle=(t*.023+i*.618034)%1,angle=i*2.39996+t*.069;
   const r=422*(1-cycle)+24,len=(7+i%4*5)*cycle;
   ctx.save();ctx.translate(x+Math.cos(angle)*r,y+Math.sin(angle)*r*.72);ctx.rotate(angle+1.57);
   ctx.globalAlpha=openness*Math.sin(cycle*Math.PI)*.90;
   ctx.fillStyle=['#fba6fe','#9beeff','#ffdf7e'][i%3];ctx.beginPath();
   ctx.moveTo(-len,0);ctx.lineTo(0,-len*.20);ctx.lineTo(len,0);ctx.lineTo(0,len*.20);ctx.closePath();ctx.fill();
   ctx.restore();
  }
  ctx.restore();
 }
 function cutin(t,time){
  const s=1.038+time*.001,opacity=ease(t/4)*(1-ease((t-23)/10));
  if(!opacity)return;
  ctx.save();ctx.beginPath();ctx.moveTo(0,150);ctx.lineTo(W,76);ctx.lineTo(W,658);ctx.lineTo(0,730);ctx.closePath();ctx.clip();
  art.portrait(s,opacity);ctx.restore();
 }
 function draw({target:opponent,face,time}){
  const t=MarukuLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,index]=camera(shots,t);
  const wish=ease((t-54)/10)*(1-ease((t-70)/23));
  const hole=ease((t-144)/22)*(1-ease((t-183)/14));
  const burst=ease((t-186)/7)*(1-ease((t-198)/29));
  frameClip();ctx.fillStyle='#100c2c';ctx.fillRect(0,0,W,H);
  art.image('court',-180-t*.20,-106+ease((t-56)/61)*63,W+306,H+165);
  world(cx,cy,z,roll,face,t,Math.max(burst,hole*.27));
  art.glow(0,x,y-156,344+wish*368,350+wish*318,wish*.82,t*.022);
  halves(t,x,y,index);
  const hx=802,hy=435,r=275*hole;
  if(r>0){
   ctx.save();ctx.globalAlpha=hole*.92;ctx.fillStyle='#080418';
   ctx.beginPath();ctx.ellipse(hx,hy,r*.72,r*.64,0,0,TAU);ctx.fill();ctx.restore();
  }
  art.glow(1,hx,hy,119+hole*602,105+hole*538,hole*.95,-t*.092);
  orbit(t,hx,hy,hole);
  const scale=mix(1.85,.68,hole);
  ctx.save();ctx.globalAlpha=1-hole*.61;
  target(opponent,tx,ty-mix(0,20,hole),-.09+hole*t*.047-ease((t-191)/29)*1.54,scale);
  ctx.restore();
  const beam=ease((t-106)/7)*(1-ease((t-116)/14));
  art.strike(2,x+395,y-88,860,195+beam*54,beam*.92,.084);
  art.strike(3,873,430,474+burst*699,398+burst*336,burst*.90);
  ctx.restore();flash('236,186,255',Math.max(burst*.21,wish*.12));
  bands(t,'#130d2e');cutin(t,time);ctx.restore();
 }
 function drawContact({x,y,time,face}){
  const p=time/MarukuLimitProfile.contactHold;
  art.strike(3,x,y,155+55*p,137,1-p*.56,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

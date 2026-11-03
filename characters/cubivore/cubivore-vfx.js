'use strict';
const CubivoreVFX=(()=>{
 const k=CharacterVFXKit.create('cubivore'),{stamp}=k;
 function draw(f){
  if(f.respawn)return;
  const a=f.attack,e=a&&k.envelope(f);
  if(e){
   if(a.cubivoreFold||['downsmash','dair','low'].includes(a.type))stamp(4,e.x,e.y,e.w,Math.min(e.h,56),1,.9);
   else if(a.type==='air')stamp(5,e.x,e.y,e.w,Math.min(e.h,56),1,.76);
   else stamp(0,e.x,e.y,Math.min(e.w,63),Math.min(e.h,55),e.back?f.face:-f.face,.76,e.upper?-Math.PI/2:0,true);
  }
  if(a?.type==='rise'&&f.timer>=6&&f.vy<1)stamp(3,f.x-f.vx*3,f.y+6,58,43,f.face,.85);
  if(a?.cubivoreFold&&!a.burst)stamp(5,f.x,f.y-27,43,37,1,.4);
  const meal=f.cubivoreMeal;
  if(meal&&meal.until>frame){
   const t=1-(meal.until-frame)/24;
   stamp(t<.48?1:2,meal.x+(f.x-meal.x)*t,meal.y+(f.y-35-meal.y)*t,38,38,1,1-t*.6);
  }
 }
 function impact(v){stamp(0,v.x,v.y,33+v.power*2,30+v.power*2,1,v.life/v.max,0,true);}
 function hud(f,x,y){
  const meat=f.cubivoreMeat??[],form={pig:'ブタ',bear:'クマ',bird:'トリ'}[cubivoreForm(f)];
  text('ニク '+form,x+12,y+43,9,'#ffde9d','left');
  for(let n=0;n<3;n++){
   const at=x+64+n*13,color=meat[n]==='red'?'#ff8d76':meat[n]==='blue'?'#85d6ff':'#283746';
   ctx.save();ctx.fillStyle=color;ctx.strokeStyle='#fbe9cd';ctx.lineWidth=1;ctx.beginPath();
   ctx.moveTo(at,y+35);ctx.lineTo(at+8,y+33);ctx.lineTo(at+10,y+41);ctx.lineTo(at+2,y+43);ctx.closePath();
   ctx.fill();ctx.stroke();ctx.restore();
  }
 }
 return {draw,impact,hud};
})();

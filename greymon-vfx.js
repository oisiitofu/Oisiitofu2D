'use strict';
const DigimonVFX=(()=>{
 // Native axes: flame/missile/wire/claw/beam point RIGHT; evolution, tornado,
 // shield and rise point UP. Translate -> reflect X -> rotate in local space.
 function create(id){const index=DigimonKit.ids.indexOf(id),Rules=NewcomerCore.registry[id];
  function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt[id]?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
  function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt[id]?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
  function draw(f){const a=f.attack;if(!a||f.respawn)return;for(const b of attackBoxes(f)){const angle=Math.atan2(b.y2-b.y1,b.x2-b.x1),w=Math.hypot(b.x2-b.x1,b.y2-b.y1)+30,n=index===3&&a.type==='bair'?1:[2,3,4,0][index];if(index===2&&a.digiRise)directed(2,f.x,f.y-55,95,145,Math.atan2(f.vy,f.vx),.85,-Math.PI/2);else if(index===0&&a.digiDown)stamp(3,f.x,f.y-23,215,65,f.face);else directed(n,(b.x1+b.x2)/2,(b.y1+b.y2)/2,w,55,angle,.9,index===0?-.45:0);}
   if(a.hold)stamp(index===2?0:0,f.x+f.face*35,f.y-65,35+a.charge*30,35+a.charge*30,f.face,.55);
   if(index===1&&a.digiRise&&a.phase==='glide')stamp(5,f.x,f.y-50,160,65,f.face,.65);
   if(index===2&&a.digiDown&&f.timer>=4&&f.timer<18)stamp(5,f.x+f.face*50,f.y-55,65,115,f.face,.75);
   if(index===3&&a.digiRise&&f.timer>=12)stamp(3,f.x,f.y-55,95,150,f.face,.6);
  }
  function drawObjects(){for(const q of Rules.objects){const alpha=Math.min(1,(q.life-q.age)/5);if(q.kind==='wire'){const dx=q.x-q.armX,dy=q.y-q.armY;if(Number.isFinite(dx))directed(2,(q.x+q.armX)/2,(q.y+q.armY)/2,Math.max(35,Math.hypot(dx,dy)),36,Math.atan2(dy,dx),alpha);}
    else if(q.kind==='beam')directed(1,q.x+q.face*q.length/2,q.y,q.length,Math.max(30,q.radius*2.5),q.face===1?0:Math.PI,alpha);
    else if(q.kind==='mode')stamp(q.defense?5:4,q.x,q.y,140,120,1,alpha*.8);
    else if(q.kind==='overflame')stamp(4,q.x,q.y,q.radius*2,80,1,alpha);
    else if(q.kind==='cross')stamp(3,q.x,q.y,110,80,q.face,alpha);
    else if(q.kind==='clawfinish')directed(3,q.x,q.y,85,55,q.face===1?0:Math.PI,alpha);
    else if(q.kind==='gaia')stamp(q.big?1:0,q.x,q.y,q.radius*3,q.radius*3,1,alpha);
    else directed(q.kind==='recoil'?1:q.kind==='shockwave'?6:q.kind==='flame'&&q.big?1:0,q.x-q.vx*2,q.y-q.vy*2,q.radius*5,q.radius*2.7,Math.atan2(q.vy,q.vx),alpha);
   }}
  function impact(v){stamp([7,6,7,6][index],v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
  function hud(f,x,y){if(f.characterId===id&&index===3&&!f.evolutionRoot)text(f.digiMode===1?'防御モード':'攻撃モード',x+50,y+54,10,f.digiMode===1?'#a8e6ff':'#ffbc8d','left');}
  return{stamp,directed,draw,drawObjects,impact,hud};
 }
 return{create};
})();
const GreymonVFX=DigimonVFX.create('greymon');

'use strict';
const KiryuVFX=(()=>{
 // FX0/1 lead RIGHT. FX2 convex RIGHT opens LEFT. translate → facing reflection → local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.kiryu?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}

 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b),angle=Math.atan2(b.y2-b.y1,b.x2-b.x1);directed(['bair','dair','low'].includes(a.type)?1:0,d.x,d.y,d.len+28,44,angle,.8);}if(a.kiryuStyle)stamp([2,3,4][a.style],f.x,f.y-48,105,110,f.face,.35);if(a.kiryuHeat&&f.timer>=5&&f.timer<=10)stamp(5,f.x+f.face*65,f.y-45,110,95,f.face,.75);}
 function drawObjects(){}
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,35+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='kiryu')text('スタイル '+['堂島の龍','ラッシュ','壊し屋'][f.kiryuStyle??0],x+52,y+54,9,'#ffb2a4','left');}return{stamp,directed,draw,drawObjects,impact,hud};
})();

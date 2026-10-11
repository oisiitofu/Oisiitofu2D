'use strict';
const KittenVFX=(()=>{
 // Native directional textures 0/1/4/6 lead RIGHT. Translate -> reflect -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.kitten?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,w,h,face=1,alpha=1){const img=characterArt.kitten?.frames[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){const a=f.attack,style=f.gravityStyle||0;prop(f.grounded?40:41,f.x-f.face*60,f.y-(f.grounded?13:65),44,35,f.face,.92);if(style)stamp(style===1?6:1,f.x,f.y-57,85,80,1,.2);if(!a)return;const t=f.timer;
  if(a.stasisField&&(a.hold||t<16)){stamp(2,f.x+f.face*55,f.y-65,65+a.charge*45,65+a.charge*45,1,.7);for(let n=0;n<a.collected;n++){const angle=frame*.05+n*2.1;prop(42,f.x+f.face*55+Math.cos(angle)*37,f.y-65+Math.sin(angle)*37,30,26,1);}}
  if(a.styleSwitch&&t>=12&&t<=25)stamp(style===1?6:style===2?7:0,f.x,f.y-50,110,100,1,.5);
  const w=CombatData.activeWindow(a,t);if(!w)return;for(const b of attackBoxes(f)){const d=AdolVFX.direction(b);if(w.shape==='shockwave'){stamp(5,d.x,d.y-30,d.len+35,90,1,.9);continue;}stamp(style===1?6:style===2?1:0,d.x,d.y,d.len+30,50,d.face,.85,d.rot);}
 }
 function drawObjects(){for(const q of KittenRules.objects){if(q.kind==='hole'){stamp(5,q.x,q.y,q.radius*2,q.radius*1.3,1,Math.min(1,(q.life-q.age)/5));continue;}const face=Math.sign(q.vx)||q.face;stamp(4,q.x,q.y,q.radius*5,q.radius*3,face,Math.min(1,(q.life-q.age)/5),Math.atan2(q.vy,q.vx*face));}}
 function impact(v){stamp(7,v.x,v.y,45+v.power*4,45+v.power*4,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId==='kitten')text('重力 '+KittenStyles[f.gravityStyle||0].name+' / ↓B スタイル切替 / ↑B 浮遊中に方向指定・壁で反発',x+52,y+54,8,'#decaff','left');}
 return{stamp,prop,draw,drawObjects,impact,hud};
})();

'use strict';
const EdeaVFX=(()=>{
 // Native red crescent 0 leads RIGHT; overhead arc 1 has its convex edge UP.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const im=characterArt.edea?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,boxes=attackVisualBoxes(f);if(a&&boxes.length&&!['grab','pummel'].includes(a.type)&&!a.type.endsWith('Throw')){if(boxes.some(b=>b.window?.shape==='up'))stamp(1,f.x,f.y-105,145,80,f.face,.92);else for(const b of boxes.flatMap(b=>SlashVFX.outward(f,b))){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;stamp(a.edeaBrave?8:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+30,Math.max(40,b.radius*2),face,.9,Math.atan2(dy,dx*face));}}
  if(a?.edeaDefault&&f.timer>=8&&f.timer<40&&!a.released)stamp(6,f.x,f.y-44,88,114,f.face,.55);if(a?.edeaDefault&&a.banked&&f.timer<48)stamp(7,f.x,f.y-105,35,35,1,.9);if(a?.edeaVault&&f.timer>=12&&f.timer<34)stamp(4,a.pivotX,a.pivotY-42,155,100,a.originFace,.5);if(a?.edeaLeap&&f.timer>=10&&f.timer<30)stamp(5,f.x,f.y+10,65,100,1,.55);
 }
 function drawObjects(){}
 function impact(v){stamp(11,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='edea')return;text('BP',x+158,y+20,11,'#f5de91');for(let n=0;n<3;n++)ellipse(x+183+n*19,y+16,6,6,n<(f.edeaBP||0)?'#80d5ff':'#3a3e50');}
 return{stamp,draw,drawObjects,impact,hud};
})();

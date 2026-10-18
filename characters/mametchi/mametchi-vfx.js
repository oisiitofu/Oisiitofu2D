'use strict';
const MametchiVFX=(()=>{
 // FX0 convex RIGHT opens LEFT; FX1 leads RIGHT. Transform: translate → facing reflection → local rotation. FX3 stays upright.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.mametchi?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;for(const b of attackVisualBoxes(f)){if(a.mametchiShare)stamp(2,f.x,f.y-30,90,65,1,.85);else if(b.window?.shape==='spin')stamp(0,f.x,f.y-35,90,70,f.face,.7);else{const d=AdolVFX.direction(b);directed(0,d.x,d.y,d.len+25,35,Math.atan2(b.y2-b.y1,b.x2-b.x1),.85);}}if(a.mametchiHop&&a.phase==='hop'&&f.timer-a.launchFrame<14)stamp(3,f.x,f.y-18,45,75,1,.65);if(a.mametchiMeal&&[12,24,36].some(t=>f.timer>=t&&f.timer<t+6))stamp(13,f.x,f.y-65,30,30,1,.8);if(a.mametchiEgg&&a.hold)stamp(4,f.x+f.face*30,f.y-38,22+(a.charge||0)*18,30+(a.charge||0)*22,f.face,.65);}
 function drawObjects(){for(const q of MametchiRules.objects){if(q.kind==='egg')directed(1,q.x,q.y,q.radius*4,q.radius*3,Math.atan2(q.vy,q.vx),1);else if(q.kind==='care'){stamp(8+q.itemType,q.x,q.y,q.itemType===3?45:35,q.itemType===3?28:35,q.face,.95,q.itemType===2?q.age*.08:0);if(q.pulse>0)stamp(2,q.x,q.y,95,65,1,q.pulse/12);}}}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='mametchi')text('おせわ '+['ごはん','おやつ','おもちゃ','おそうじ','ゲーム'][f.mametchiItemIndex||0]+' / 上B 押し直しで2段',x+52,y+54,9,'#ffe8a1','left');}return{stamp,directed,draw,drawObjects,impact,hud};
})();

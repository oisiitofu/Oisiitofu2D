'use strict';
const DietrichVFX=(()=>{
 // Source FX0 crescent convex edge RIGHT, FX1 sword wave and FX2 rush RIGHT, FX4 rising sword spiral UP.
 // Transform order is world translation, facing reflection, then local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.dietrich?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;for(const b of attackVisualBoxes(f)){if(b.segment===0)continue;const start=b.bladeStart||{x:b.x1,y:b.y1},tip=b.bladeTip||{x:b.x2,y:b.y2},d=AdolVFX.direction({...b,x1:start.x,y1:start.y,x2:tip.x,y2:tip.y}),angle=Math.atan2(tip.y-start.y,tip.x-start.x);if(a.dietrichWing&&a.phase==='ascent'||a.type==='upsmash')stamp(4,(start.x+tip.x)/2,(start.y+tip.y)/2+15,75,95,f.face,.8);else if(b.window?.shape==='spin')stamp(0,f.x,f.y-45,125,90,f.face,.7,frame*.15);else directed(a.dietrichRush&&a.phase==='rush'?2:0,d.x,d.y,d.len+20,50,angle,.8);}if(a.dietrichSwordWave&&a.hold)stamp(7,f.x+f.face*30,f.y-48,25+40*a.charge,30+45*a.charge,f.face,.7);if(a.dietrichWing&&a.phase==='glide')stamp(2,f.x-f.face*25,f.y-45,90,45,f.face,.5);if(a.dietrichField&&f.timer<19)stamp(3,f.x,f.y-10,70,25,1,.6);}
 function drawObjects(){for(const q of DietrichRules.objects){if(q.kind==='swordWave')directed(1,q.x,q.y,65+q.charge*40,q.radius*5,Math.atan2(q.vy,q.vx),.95);if(q.kind==='field'){stamp(3,q.x,q.y,q.radius*2,65,1,q.phase==='warning'?.45:.85);if(q.phase==='pull')stamp(7,q.x,q.y-15,q.radius*2,70,1,.3+.1*Math.sin(frame*.2));}}}
 function impact(v){stamp(6,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='dietrich')text('影 '+Math.floor(f.dietrichGauge||0)+' / →B 再入力で斬上 / ↑B 翼を操る',x+52,y+54,9,'#e7bfff','left');}return{stamp,directed,draw,drawObjects,impact,hud};
})();

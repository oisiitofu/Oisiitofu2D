'use strict';
const SukaponVFX=(()=>{
 // FX0/1 lead RIGHT; FX4 leads UP. Translate -> facing reflection -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.sukapon?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-sourceAngle);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;for(const b of attackVisualBoxes(f)){const x=(b.x1+b.x2)/2,y=(b.y1+b.y2)/2,angle=Math.atan2(b.y2-b.y1,b.x2-b.x1);if(a.sukaponRoll||['air','downsmash'].includes(a.type))stamp(2,x,y,90,74,f.face,.65);else directed(['up','uair','upsmash'].includes(a.type)?4:1,x,y,66,48,angle,.6,['up','uair','upsmash'].includes(a.type)?-Math.PI/2:0);}if(a.hold)stamp(7,f.x,f.y-58,28+24*a.charge,28+24*a.charge,f.face,.8);if(a.sukaponNage&&f.grabbed)stamp(2,f.x,f.y-40,112,86,f.face,.55);}
 function drawObjects(){for(const q of SukaponRules.objects){const f=fighters[q.owner],img=characterArt.sukapon?.tints[f.color]?.[49];if(!img)continue;const s=1+(q.charge||0)*.2,angle=Math.atan2(q.vy,q.vx);directed(0,q.x-Math.cos(angle)*26,q.y-Math.sin(angle)*26,80,30,angle,.65);ctx.save();ctx.translate(q.x,q.y);ctx.scale(q.face,1);AttackEffects.image(img,-24.5*s,-24.5*s*img.height/img.width,49*s,49*s*img.height/img.width);ctx.restore();}}
 function impact(v){stamp(3,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='sukapon')text('→必殺 再入力で回収 / ↑必殺 方向調整・反動',x+52,y+54,9,'#ffd0e7','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();

'use strict';
const AgumonVFX=(()=>{
 // Assets point RIGHT. Reflect the world first, then rotate in local coordinates.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.agumon?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){const a=f.attack;if(!a)return;if(a.flameRecoil&&f.timer>=12&&f.timer<=15)stamp(5,f.x-Math.sign(a.aim||f.face)*38,f.y+18,90,42,1,.8,Math.atan2(13,-a.aim*8));if(a.crossFight&&f.grabbed)stamp(2,f.x,f.y-45,125,100,a.originFace,.55,-Math.PI*clamp((f.timer-a.captureFrame)/18,0,1));const w=CombatData.activeWindow(a,f.timer);if(!w)return;for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b);if(a.volcano){stamp(4,d.x,d.y,d.len+85,95,d.face,.9,d.rot);continue;}stamp(a.agumonFX??2,d.x,d.y,d.len+25,w.shape==='spin'?85:45,d.face,.9,w.shape==='spin'?0:d.rot);}}
 function drawObjects(){for(const q of AgumonRules.objects){const face=Math.sign(q.vx)||q.face,rot=Math.atan2(q.vy,q.vx*face),fx=q.kind==='recoil'?5:q.kind==='burner'?1:0;stamp(fx,q.x,q.y,q.radius*4,q.radius*3,face,Math.min(1,(q.life-q.age)/6),rot);}}
 function impact(v){stamp(7,v.x,v.y,55+v.power*6,55+v.power*6,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId!=='agumon'||f.evolutionRoot)return;text('BABY FLAME / →B BITE & THROW / ↑B RECOIL',x+52,y+54,8,'#bfe6ff','left');}
 return{stamp,draw,drawObjects,impact,hud};
})();

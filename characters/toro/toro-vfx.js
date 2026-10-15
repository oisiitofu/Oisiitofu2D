'use strict';
const ToroVFX=(()=>{
function stamp(n,x,y,w,h,face=1,alpha=1,angle=0){const im=characterArt.toro?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(angle);ctx.globalAlpha*=alpha;ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();}
function draw(f){if(f.respawn)return;const a=f.attack;if(a?.toroSwitch&&f.timer>=6)stamp(9,f.x,f.y-28,90,75,1,.7);if(a?.toroUp&&a.upStarted){const dt=f.timer-a.upAt;if(a.toroForm===1&&dt<8)stamp(8,f.x,f.y-28,100,75,1,.8);else if(a.toroForm===2&&dt<42)stamp(4+Math.min(2,Math.floor(dt/14)),f.x,f.y+2,40,23,1,.9);}
// Punch/kick assets lead LEFT. Mirror opposite the hit direction, then negate
// its local rotation so the impact end follows front/back/up/down hit segments.
for(const b of attackVisualBoxes(f)){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=Math.abs(dx)<.01?f.face:Math.sign(dx),angle=Math.atan2(dy,dx*face);stamp(a?.type.includes('smash')?1:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+28,38,-face,.8,-angle);}}
function drawObjects(){for(const q of ToroRules.objects){if(q.kind==='chain'){const f=fighters[q.owner];ctx.save();ctx.strokeStyle='#c2c8d1';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(f.x,f.y-30);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.restore();}stamp(q.kind==='shuriken'?2:q.kind==='chain'?3:4+Math.round((q.radius-9)/3),q.x,q.y,q.kind==='chain'?50:q.radius*2.8,q.kind==='chain'?22:q.radius*2.8,q.face,.95,q.kind==='shuriken'?q.age*.3:0);}}
function impact(v){stamp(10,v.x,v.y,30+v.power*2,30+v.power*2,1,v.life/v.max);}function hud(f,x,y){if(f.characterId==='toro')text(ToroFormNames[toroForm(f)],x+242,y+18,9,'#ffdec1','right');}return{draw,drawObjects,impact,hud};})();

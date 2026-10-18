'use strict';
const HornetVFX=(()=>{
function stamp(n,x,y,w,h,face=1,alpha=1,angle=0){const im=characterArt.hornet?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(angle);ctx.globalAlpha*=alpha;AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
function draw(f){if(f.respawn)return;const a=f.attack;if(a?.hornetStorm&&f.timer>=16&&f.timer<=35)stamp(7,f.x,f.y-35,155,95,f.face,.8);if(a?.hornetSoar&&a.soarStarted){if(f.timer-a.soarAt<34){ctx.save();ctx.strokeStyle='#f5dfec';ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(f.x,f.y-60);ctx.lineTo(a.anchorX,a.anchorY);ctx.stroke();ctx.restore();}else stamp(5,f.x,f.y-35,100,65,f.face,.45);}for(const b of attackVisualBoxes(f)){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=Math.abs(dx)<.01?f.face:Math.sign(dx),angle=Math.atan2(dy,dx*face);stamp(a?.type.includes('smash')?1:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+32,42,face,.8,angle);}}
// Needle texture points RIGHT. Reflect locally then align to its velocity.
function drawObjects(){for(const q of HornetRules.objects){const f=fighters[q.owner];ctx.save();ctx.strokeStyle='#e8c7da';ctx.lineWidth=1;ctx.globalAlpha*=.65;ctx.beginPath();ctx.moveTo(f.x,f.y-35);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.restore();stamp(3,q.x,q.y,q.kind==='anchor'?50:67,9,q.face,.95,q.kind==='anchor'?-Math.PI/2:Math.atan2(q.vy,q.vx*q.face));}}
function impact(v){stamp(4,v.x,v.y,30+v.power*2,30+v.power*2,1,v.life/v.max);}
function hud(f,x,y){if(f.characterId==='hornet')text('SILK '+Math.round(hornetSilk(f)),x+242,y+18,9,'#ffd4eb','right');}return{draw,drawObjects,impact,hud};})();

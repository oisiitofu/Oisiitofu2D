'use strict';
const RieszVFX=(()=>{
 // Generated FX 0/2/8 lead RIGHT, 1 leads UP, 5 leads upper-right.
 // Rotate locally, then mirror to the fighter's world-facing direction.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const im=characterArt.riesz?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,boxes=attackVisualBoxes(f);if(a&&boxes.length&&!['grab','pummel'].includes(a.type)&&!a.type.endsWith('Throw')){const upper=boxes.some(b=>b.window?.shape==='up');if(upper)stamp(1,f.x,f.y-105,145,80,f.face,.9);else for(const b of boxes.flatMap(b=>SlashVFX.outward(f,b))){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;stamp(a.type==='smash'?2:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+30,Math.max(40,b.radius*2),face,.92,Math.atan2(dy,dx*face));}}
  if(f.rieszPowerTime>0)stamp(6,f.x,f.y-44,82,110,1,.18);if(a?.rieszPower&&f.timer>=18&&f.timer<=28)stamp(6,f.x,f.y-48,110,130,1,.8);if(a?.rieszLeap&&f.timer>=10&&f.timer<28)stamp(5,f.x-f.vx*2,f.y+10,90,45,f.face,.65,-Math.PI/4);
 }
 function drawObjects(){for(const q of RieszRules.objects)if(!q.dead)stamp(q.kind==='bird'?4:3,q.x,q.y,q.kind==='bird'?134:82,q.kind==='bird'?88:112,q.face,.95);}
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='riesz')return;const on=f.rieszPowerTime>0;ctx.fillStyle='#303c37';ctx.fillRect(x+158,y+20,82,6);ctx.fillStyle=on?'#ffd86a':'#79cda7';ctx.fillRect(x+158,y+20,82*(on?f.rieszPowerTime/360:1-Math.min(1,(f.rieszPowerCooldown||0)/720)),6);text(on?'パワーアップ '+Math.ceil(f.rieszPowerTime/60)+'秒':f.rieszPowerCooldown>0?'再強化まで '+Math.ceil(f.rieszPowerCooldown/60)+'秒':'パワーアップ OK',x+240,y+15,9,'#ebfdd4','right');}
 return{stamp,draw,drawObjects,impact,hud};
})();

'use strict';
const FioraVFX=(()=>{
// Slashes are authored opening to the RIGHT. Mirror local X before rotation;
// atan2 uses the mirrored segment so back/up/down all follow the actual hitbox.
function stamp(n,x,y,w,h,face=1,alpha=1,angle=0){const im=characterArt.fiora?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(angle);ctx.globalAlpha*=alpha;ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();}
function draw(f){if(f.respawn)return;const a=f.attack;if(f.fioraShiftTime>0)stamp(8,f.x,f.y-40,100,100,1,.3);if(a?.fioraShift&&f.timer>=10)stamp(8,f.x,f.y-40,115,110,1,.65);if(a?.fioraZero&&a.zeroStarted){stamp(7,f.x,f.y-42,120,90,f.face,.55);stamp(6,f.x-f.face*20,f.y+8,65,40,f.face,.7);}for(const b of attackVisualBoxes(f)){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=Math.abs(dx)<.01?f.face:Math.sign(dx),angle=Math.atan2(dy,dx*face);stamp(a?.type.includes('smash')?1:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+36,50,face,.8,angle);}}
function drawObjects(){for(const q of FioraRules.objects){stamp(6,q.x-q.face*20,q.y,55,25,q.face,.5);stamp(5,q.x,q.y,43,24,q.face,1,Math.atan2(q.y-q.previousY,(q.x-q.previousX)*q.face));}}
function impact(v){stamp(4,v.x,v.y,32+v.power*2,32+v.power*2,1,v.life/v.max);}
function hud(f,x,y){if(f.characterId!=='fiora')return;const s=f.fioraShiftTime>0?'SHIFT '+Math.ceil(f.fioraShiftTime/60):f.fioraShiftCooldown>0?'再起動 '+Math.ceil(f.fioraShiftCooldown/60):'SHIFT READY';text(s,x+242,y+18,9,'#92ddff','right');}
return{draw,drawObjects,impact,hud};
})();

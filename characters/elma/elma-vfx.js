'use strict';
const ElmaVFX=(()=>{
 // Native directional FX 0,1,3,4 lead RIGHT. World translate -> face reflect -> local rotate.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.elma?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;if(a.ocgSummon&&t>=12&&t<=30)stamp(6,f.x,f.y-60,135,120,1,.65);if(a.elmaRifle&&a.hold)stamp(2,f.x+a.originFace*65,f.y-60,30+a.charge*25,30+a.charge*25,1,.65);if((a.boostDodge||a.ocgHover)&&a.launched&&!a.escapeSide&&(t<a.boostStart+11||a.ocgHover&&a.fuel>0)){const dx=f.vx,dy=f.vy,face=Math.sign(dx)||f.face;stamp(3,f.x-dx*2,f.y-dy*2-20,85,34,face,.8,Math.atan2(dy,dx*face));}
  const w=CombatData.activeWindow(a,t);if(!w)return;for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b);if(w.shape==='shockwave'){stamp(5,d.x,d.y-20,d.len+20,70,1,.7);continue;}stamp(a.ocg?4:['jab','bair','up','uair','smash','upsmash'].includes(a.type)?0:4,d.x,d.y,d.len+25,a.ocg?60:40,d.face,.85,d.rot);}
 }
 function drawObjects(){for(const q of ElmaRules.objects){if(q.kind==='grenade'){const img=characterArt.elma?.frames[56];if(img){ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.age*.15);ctx.drawImage(img,-12,-12,24,24);ctx.restore();}continue;}if(q.kind==='blast'){stamp(5,q.x,q.y,q.radius*2.2,q.radius*1.7,1,Math.min(1,(q.life-q.age)/4));continue;}const face=Math.sign(q.vx)||q.face;stamp(q.kind==='beam'?1:0,q.x,q.y,q.kind==='beam'?100:58,q.kind==='beam'?38:17,face,1,Math.atan2(q.vy,q.vx*face));}}
 function impact(v){stamp(7,v.x,v.y,45+v.power*4,45+v.power*4,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId==='elma')text(f.ocgTime>0?'OCG '+Math.ceil(f.ocgTime/60)+'s / ↓B 降機':f.ocgCooldown>0?'OCG 待機 '+Math.ceil(f.ocgCooldown/60)+'s':'↓B OCG搭乗',x+245,y+27,9,'#b9ecff','right');}
 return{stamp,draw,drawObjects,impact,hud};
})();

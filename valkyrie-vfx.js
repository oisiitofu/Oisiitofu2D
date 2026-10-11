'use strict';
const ValkyrieVFX=(()=>{
 // Authoring axis RIGHT. Reflection before rotation keeps back/up/down effects attached to the actual blade.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.valkyrie?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){const a=f.attack;if(!a)return;if(a.holyBow&&a.hold)stamp(4,f.x+f.face*40,f.y-65,60,60,f.face,.3+.6*a.charge);if(a.featherSail&&a.gliding)stamp(5,f.x,f.y-45,125,65,f.face,.65);const w=CombatData.activeWindow(a,f.timer);if(!w)return;for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b);stamp(a.valkEffect??0,d.x,d.y,d.len+24,w.shape==='spin'?90:47,d.face,.95,w.shape==='spin'?0:d.rot);}}
 function drawObjects(){for(const q of ValkyrieRules.objects){const d=AdolVFX.direction({x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y});stamp(q.kind==='wind'?2:q.kind==='blast'?4:3,q.x,q.y,q.radius*5,q.radius*3,d.face,Math.min(1,(q.life-q.age)/5),d.rot);}}
 function impact(v){stamp(7,v.x,v.y,55+v.power*7,55+v.power*7,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId!=='valkyrie')return;text(f.attack?.trick?(f.attack.confirmed?'WIND HIT / B: PASS & REVERSE SLASH':'WIND BLADE / B: FEINT'):f.attack?.featherSail?'FEATHER SAIL / ↓ OR B: END GLIDE':'TRI-BLAST / TRICK STEP / FEATHER SAIL',x+52,y+54,8,'#bfe6ff','left');}
 return{stamp,draw,drawObjects,impact,hud};
})();

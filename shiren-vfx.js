'use strict';
const ShirenVFX=(()=>{
 // Horizontal assets point RIGHT: reflect, then rotate in local coordinates.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.shiren?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,w,h,face=1){const img=characterArt.shiren?.frames[40+n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function direction(b){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;return{face,rot:Math.atan2(dy,dx*face),x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2,len:Math.hypot(dx,dy)};}
 function draw(f){const a=f.attack;if(!a)return;if(a.dragonHerb&&f.timer<=12)prop(6,f.x+f.face*16,f.y-57,17,20,f.face);if(a.vacuumScroll&&f.timer<a.startupFrames)prop(7,f.x+f.face*22,f.y-42,23,18,f.face);if(a.selfPull){const o=fighters[a.targetId],b={x1:f.x,y1:f.y-35,x2:o.x,y2:o.y-35},d=direction(b);stamp(3,d.x,d.y,d.len,12,d.face,.65,d.rot);}const w=CombatData.activeWindow(a,f.timer);if(!w)return;for(const b of attackVisualBoxes(f)){const d=direction(b);if(w.shape==='spin')stamp(5,d.x,d.y,d.len+30,60);else stamp(a.vacuumScroll?0:a.chargeFrame?1:0,d.x,d.y,d.len+20,a.vacuumScroll?58:32,d.face,.9,d.rot);}}
 function drawObjects(){for(const q of ShirenRules.objects){const fade=Math.min(1,(q.life-q.age)/5);if(q.kind==='pot')prop(4,q.x,q.y-9,29,29);else if(q.kind==='blast')stamp(4,q.x,q.y,q.radius*2,q.radius*2,1,fade);else if(q.kind==='staff'){prop(2,q.x,q.y,40,14,q.face);stamp(3,q.x-q.face*20,q.y,50,12,q.face,.6);}else stamp(2,q.x,q.y,q.radius*3,q.radius*2,q.face,fade);}}
 function impact(v){stamp(7,v.x,v.y,55+v.power*8,55+v.power*8,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId!=='shiren')return;prop(0,x+245,y+29,22,28);text(f.attack?.selfPull?'STAFF: PULL → SLASH':f.attack?.blastPot?'← →: BLAST DIRECTION':'DRAGON HERB / POUNCE STAFF',x+52,y+54,8,'#bcd8ff','left');}
 return{stamp,prop,direction,draw,drawObjects,impact,hud};
})();

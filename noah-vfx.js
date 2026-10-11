'use strict';
const NoahVFX=(()=>{
 // Authored slash tip is RIGHT. Reflect first, then rotate in local space.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.noah?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function direction(b){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;return{face,rotation:Math.atan2(dy,dx*face),x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2,length:Math.hypot(dx,dy)};}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;if(a.hold)stamp(2,f.x+f.face*22,f.y-56,80+80*a.charge,70, f.face,.55);if(a.flank&&t>=a.travelStart&&t<=a.travelEnd)stamp(4,f.x-f.vx*2,f.y-36,90,95,f.face,.6);if(a.reboundSlash&&t>=a.launchFrame&&t<=a.reboundEnd)stamp(5,f.x-f.vx*2,f.y-30,80,90,f.face,.6);const w=CombatData.activeWindow(a,t);if(!w)return;if(a.beat){const b=attackBoxes(f)[0];stamp(3,f.x,f.y-18,Math.abs(b.x2-b.x1)+b.radius*2,95);return;}for(const b of attackBoxes(f)){const d=direction(b);stamp(a.overclock?2:a.reboundSlash||a.type==='rebound'?1:0,d.x,d.y,d.length+24,b.radius*4,d.face,1,d.rotation);}}
 function impact(v){const u=(v.max-v.life)/v.max;stamp(7,v.x,v.y,90+v.power*12,90+v.power*12,1,(1-u)**1.7);}
 function hud(f,x,y){if(f.characterId==='noah')text('FLANK / REBOUND',x+52,y+54,8,'#a5d9ff','left');}
 return{stamp,direction,draw,impact,hud};
})();

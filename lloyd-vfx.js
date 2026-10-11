'use strict';
const LloydVFX=(()=>{
 // Slashes and wave tips were authored RIGHT; reflect before local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.lloyd?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function direction(b){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;return{face,rotation:Math.atan2(dy,dx*face),x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2,length:Math.hypot(dx,dy)};}
 function draw(f){const a=f.attack;if(!a)return;if(a.hold)stamp(3,f.x,f.y-60,55+40*a.charge,55+40*a.charge,f.face,.5);if(a.tiger&&f.timer>=a.branch[0]&&f.timer<=a.branch[1]){const good=f.timer>=a.perfect[0]&&f.timer<=a.perfect[1];stamp(7,f.x,f.y-145,good?18:8,good?18:8,1,good?.85:.35);}if(a.tempest&&a.launched||a.tempestSail)stamp(4,f.x,f.y-60,110,135,f.face,.35);if(a.guardCircle&&f.timer>=10&&f.timer<18)stamp(5,f.x,f.y-12,110,55,1,.4);const w=CombatData.activeWindow(a,f.timer);if(!w)return;if(w.shape==='shockwave'){const b=attackVisualBoxes(f)[0];stamp(4,f.x,f.y-22,b.x2-b.x1+30,50,f.face,.75);return;}for(const b of attackVisualBoxes(f)){const d=direction(b);stamp(a.type==='smash'||a.tigerFinish?1:0,d.x,d.y,d.length+16,32,d.face,.75,d.rotation);}}
 function drawObjects(){for(const q of LloydRules.objects){const fade=Math.min(1,(q.life-q.age)/6);if(q.kind==='wave')stamp(2,q.x-q.face*18,q.y,65+30*(q.charge||0),30+q.radius,q.face,fade);else stamp(5,q.x,q.y-15,q.radius*2,70,1,fade*(q.age<=q.delay?.45:1));}}
 function impact(v){stamp(7,v.x,v.y,65+v.power*10,65+v.power*10,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId==='lloyd')text(f.lloydCircleCooldown>0?'GUARD CIRCLE '+Math.ceil(f.lloydCircleCooldown/60)+'s':'TWIN BLADES / RHYTHM',x+52,y+54,8,'#a5d9ff','left');}
 return{stamp,direction,draw,drawObjects,impact,hud};
})();

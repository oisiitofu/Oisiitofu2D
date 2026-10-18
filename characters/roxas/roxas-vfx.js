'use strict';
const RoxasVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1){const img=characterArt.roxas?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.globalCompositeOperation='lighter';AttackEffects.image(img,-w/2,-h,w,h);ctx.restore();}
 function guard(f){stamp(7,f.x,f.y+8,112,112,1,.8);}
 function impact(v){const t=(v.max-v.life)/v.max,r=(85+v.power*40)*(1+t*.3);stamp(5,v.x,v.y+r*.5,r,r,1,(1-t)**1.5);}
 function draw(f){for(const o of RoxasRules.objects){if(o.owner!==f.id||o.age<0)continue;if(o.kind==='orbs'){if(!o.hit)stamp(3,o.x,o.y+22,44,44,o.face);else if(o.age<70)stamp(5,o.x,o.y+20,40,40,1,.35);}else{stamp(6,o.x,o.y+10,145,65,1,o.age<45?.4+.25*Math.sin(o.age*.2):.8);if(o.age>=45)stamp(2,o.x,o.y+8,160,182,1,Math.max(0,1-(o.age-52)/10));}}
 const a=f.attack;if(!a)return;if(a.hold&&a.spawnLight==='orbs'){for(let n=0;n<3+Math.floor(a.charge*2);n++){const angle=frame*.04+n*TAU/5;stamp(3,f.x+Math.cos(angle)*48,f.y-36+Math.sin(angle)*32,27,27,1,.8);}return;}if(a.spawnLight)return;const t=f.timer,w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w)return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/7)*.5;if(!alpha||a.type==='grab'||a.type.endsWith('Throw'))return;
 if(a.type==='upsmash'){stamp(2,f.x,f.y+8,150,160,1,alpha);return;}if(a.type==='rise'){stamp(0,f.x,f.y+20,150,160,1,alpha);return;}const r=(w.reach??a.reach)*FIGHTER_SCALE,side=w.shape==='back'?-f.face:f.face;stamp(a.type==='smash'?1:0,f.x+side*r*.4,f.y+10,r*1.8,r*1.4,side,alpha);}
 return{draw,guard,impact};
})();

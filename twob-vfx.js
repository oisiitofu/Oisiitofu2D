'use strict';
const TwoBVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1){const img=characterArt.twob?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h,w,h);ctx.restore();}
 function guard(f){stamp(7,f.x,f.y+8,112,112,1,.7);}
 function impact(v){const t=(v.max-v.life)/v.max,r=(80+v.power*35)*(1+t*.3);stamp(3,v.x,v.y+r*.5,r,r,1,(1-t)**1.5);}
 function draw(f){const a=f.attack,p=TwoBRules.pod(f),firing=a?.podShots?.some(t=>f.timer>=t&&f.timer<t+2);stamp(firing?1:0,p.x,p.y+12+Math.sin(frame*.08)*2,48,55,f.face);
 for(const o of TwoBRules.objects){if(o.owner!==f.id)continue;if(o.kind==='bullet')stamp(4,o.x,o.y+10,46,20,o.face);else{stamp(5,o.x,o.y+12,150,65,1,o.age<36?.4+.2*Math.sin(o.age*.2):.8);if(o.age>=36)stamp(6,o.x,o.y+8,158,155,1,Math.max(0,1-(o.age-45)/13));}}
 if(!a)return;const t=f.timer,w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w)return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/7)*.5;if(!alpha||a.type==='grab'||a.type.endsWith('Throw'))return;if(a.type==='upsmash'){stamp(6,f.x,f.y+8,145,160,1,alpha);return;}
 const r=(w.reach??a.reach)*FIGHTER_SCALE,side=w.shape==='back'?-f.face:f.face;ctx.save();ctx.translate(f.x+side*r*.35,f.y-(w.shape==='up'?50:28));ctx.rotate((w.shape==='up'?-.9:w.shape==='down'?1.3:0)*side);stamp(a.type==='smash'?3:2,0,r*.5,r*1.8,r*1.45,side,alpha);ctx.restore();}
 return{draw,guard,impact};
})();

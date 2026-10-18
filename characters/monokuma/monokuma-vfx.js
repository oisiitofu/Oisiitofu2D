'use strict';
const MonokumaVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1){const img=characterArt.monokuma?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h,w,h);ctx.restore();}
 function vehicle(f,alpha=1){const a=f.attack;if(a?.carMove&&f.timer>=6&&f.timer<=29){stamp(1,f.x,f.y+5,143,104,f.face,alpha);return true;}if(a?.type==='rise'&&f.timer>=7&&f.timer<=16){stamp(2,f.x,f.y+40,104,171,f.face,alpha);return true;}return false;}
 function guard(f){stamp(7,f.x,f.y+9,112,112,1,.7);}
 function impact(v){const t=(v.max-v.life)/v.max,r=(85+v.power*35)*(1+t*.3);stamp(4,v.x,v.y+r*.5,r,r,1,(1-t)**1.5);}
 function world(f){for(const o of MonokumaRules.objects){if(o.owner!==f.id)continue;if(o.burst){const size=o.kind==='trap'?178:140+o.charge*55;stamp(o.kind==='trap'?6:4,o.x,o.y+25,size,size,o.face,Math.max(0,1-(o.burst-6)/16));}else if(o.kind==='ball'){const r=45+o.charge*22;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.age*.13*o.face);stamp(0,0,r*.5,r,r);ctx.restore();}else{stamp(3,o.x,o.y,84,73,o.face,o.age<20?.55:1);if(o.warning)stamp(6,o.x,o.y+10,120,120,1,.35+.3*Math.sin(o.warning));}}}
 function draw(f){world(f);const a=f.attack;if(!a||a.spawnObject)return;const t=f.timer,w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w)return;const live=t<=w.end,fade=live?1:Math.max(0,1-(t-w.end)/7)*.45;if(!fade||a.type==='grab'||a.type.endsWith('Throw'))return;const r=(w.reach??a.reach)*FIGHTER_SCALE,side=w.shape==='back'?-f.face:f.face;ctx.save();ctx.translate(f.x+side*r*.4,f.y-(w.shape==='up'?65:34));ctx.rotate((w.shape==='up'?-.8:w.shape==='down'?1.3:0)*side);stamp(5,0,r*.5,r*1.8,r*1.5,side,fade);ctx.restore();}
 return{draw,guard,impact,vehicle};
})();

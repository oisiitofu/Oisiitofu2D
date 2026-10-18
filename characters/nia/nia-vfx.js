'use strict';
const NiaVFX=(()=>{
 // Local rotation follows the horizontal mirror, so down remains down on either side.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.nia?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function impact(v){const t=(v.max-v.life)/v.max,r=(70+v.power*30)*(1+t*.4);stamp(6,v.x,v.y,r,r,1,(1-t)**1.5);}
 function draw(f){for(const o of NiaRules.objects){if(o.owner!==f.id)continue;const size=60+o.tier*30;stamp(2,o.x,o.y,size,size,o.face);}
 if(f.niaHealUntil>frame)stamp(7,f.x,f.y-40,115,130,1,(f.niaHealUntil-frame)/24);
 const a=f.attack;if(!a)return;const t=f.timer;if(a.hold)stamp(2,f.x+f.face*35,f.y-40,35+a.charge*50,35+a.charge*50,f.face,.8);
 if(a.type==='rise'&&t<=18){const p=Math.min(1,t/a.startupFrames);stamp(4,f.x-f.face*(35-25*p),f.y+20+20*p,165,115,f.face,t<12?.95:(19-t)/8);}
 if(a.type==='dash'&&t>=5&&t<=18)stamp(5,f.x-f.face*60,f.y-30,160,70,f.face,.8);
 if(a.spellShots)return;const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w)return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/7)*.6;if(!alpha||a.type==='grab'||a.type==='pummel'||a.type.endsWith('Throw'))return;
 if(a.type==='gale'){stamp(3,f.x,f.y-22,255,130,1,alpha);drawSprite(f);return;}
 const up=w.shape==='up',back=w.shape==='back',down=w.shape==='down',spin=w.shape==='spin';stamp(up||spin?1:0,f.x+(spin||up?0:back?-45:45)*f.face,f.y-(up?65:down?10:35),(a.reach||150)*FIGHTER_SCALE*1.4,up?140:spin?115:90,back?-f.face:f.face,alpha,down?Math.PI/2:0);if(a.type==='rise')drawSprite(f);
 }
 return{draw,impact};
})();

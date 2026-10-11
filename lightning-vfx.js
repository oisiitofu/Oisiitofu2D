'use strict';
const LightningVFX=(()=>{function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.lightning?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(face,1);ctx.globalAlpha*=alpha;SlashVFX.image('lightning',n,img,-w/2,-h/2,w,h);ctx.restore();}
function impact(v){const t=(v.max-v.life)/v.max,r=(75+v.power*30)*(1+t*.4);stamp(1,v.x,v.y,r,r,1,(1-t)**1.5);}
function draw(f){for(const o of LightningRules.objects)if(o.owner===f.id&&o.age>=0)stamp(2,o.x,o.y,65,65,o.face);
if(f.paradigmFlash>frame)stamp(5+(f.paradigm||0),f.x,f.y-35,115,145,1,(f.paradigmFlash-frame)/32);

const a=f.attack;if(!a)return;const t=f.timer;if(a.hold)stamp(a.charge>=1?3:2,f.x+f.face*35,f.y-40,35+a.charge*55,35+a.charge*55,f.face,.8);if(a.spellShots||a.type==='gale')return;const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w)return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/7)*.6;if(!alpha||a.type==='grab'||a.type==='pummel'||a.type.endsWith('Throw'))return;
if(a.type==='upsmash'){stamp(4,f.x,f.y-70,135,190,1,alpha);drawSprite(f);return;}if(a.type==='jab3'||a.type==='side2'){stamp(1,f.x+f.face*70,f.y-40,100,80,f.face,alpha);return;}
const up=w.shape==='up',back=w.shape==='back',down=w.shape==='down',spin=w.shape==='spin';if(w.shape!=='spin')SlashVFX.melee(f,w,0,alpha);else stamp(0,f.x+(spin||up?0:back?-45:45)*f.face,f.y-(up?65:down?10:35),(a.reach||150)*FIGHTER_SCALE*1.4,up?145:spin?120:90,back?-f.face:f.face,alpha,up?-Math.PI/2:down?Math.PI/2:0);}
function status(f){ctx.save();ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillStyle=['#ff729a','#75cfff','#85ffb5'][f.paradigm||0];const roleLabel=LightningRules.roles[f.paradigm||0]+(f.paradigmReady?' ✦':'');ctx.strokeStyle='#081022';ctx.lineWidth=3;ctx.strokeText(roleLabel,f.x,f.y-137);ctx.fillText(roleLabel,f.x,f.y-137);ctx.restore();}
return{draw,impact,status};})();
